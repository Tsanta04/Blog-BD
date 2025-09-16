<?php
namespace App\Controllers;

use App\Utils\Response;
use RedBeanPHP\R;

class PostController {
    private $rb;

    public function __construct($rb){
        $this->rb = $rb; // instance RedBean
    }

    private function body(){ 
        return json_decode(file_get_contents('php://input'), true); 
    }

    // GET /api/posts
    public function index(){
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
        $posts = R::findAll('posts', ' ORDER BY created_at DESC LIMIT ? ', [$limit]);

        $result = [];
        foreach ($posts as $p){
            $postId = $p->id;

            // compter vues
            $views = R::count('views', 'post_id = ?', [$postId]);

            // récupérer tags
            $tagsPivot = R::findAll('posts_tags', ' post_id = ? ', [$postId]);
            $tags = [];
            foreach($tagsPivot as $tp){
                $tag = R::load('tags', $tp->tag_id);
                if ($tag->id) $tags[] = $tag->tags;
            }

            // récupérer médias
            $mediasR = R::findAll('medias', ' post_id = ? ', [$postId]);
            $medias = [];
            foreach($mediasR as $m){
                $type = R::load('types_medias', $m->type_id);
                $medias[] = [
                    'url' => $m->path_name,
                    'type' => $type->type_,
                ];
            }

            $result[] = [
                'id' => $postId,
                'title' => $p->title,
                'excerpt' => mb_substr($p->content, 0, 200),
                'user_id' => $p->user_id,
                'created_at' => $p->created_at,
                'update_at' => $p->update_at,
                'views' => $views,
                'tags' => $tags,
                'media' => $medias
            ];
        }

        Response::json(['data' => $result]);
    }

    // POST /api/posts
    public function create($userId){
        $b = $this->body(); 
        if (empty($b['title']) || empty($b['content'])) 
            return Response::json(['error'=>'Missing fields'], 400);

        $post = R::dispense('posts');
        $post->title = $b['title'];
        $post->content = $b['content'];
        $post->user_id = intval($userId);
        $post->created_at = date('Y-m-d H:i:s');
        $post->update_at = date('Y-m-d H:i:s');
        $postId = R::store($post);

        // tags
        if (!empty($b['tags']) && is_array($b['tags'])){
            foreach($b['tags'] as $t){
                // vérifier si tag existe
                $tag = R::findOne('tags', ' tags = ? ', [$t]);
                if (!$tag){
                    $tag = R::dispense('tags');
                    $tag->tags = $t;
                    $tag->id = R::store($tag);
                }
                $pt = R::dispense('posts_tags');
                $pt->post_id = $postId;
                $pt->tag_id = $tag->id;
                R::store($pt);
            }
        }

        // médias
        if (!empty($b['media']) && is_array($b['media'])){
            foreach($b['media'] as $m){
                if (!isset($m['url']) || !isset($m['type'])) continue;
                $type = R::findOne('types_medias', ' type_ = ? ', [$m['type']]);
                if (!$type){
                    $type = R::dispense('types_medias');
                    $type->type_ = $m['type'];
                    $type->id = R::store($type);
                }
                $media = R::dispense('medias');
                $media->path_name = $m['url'];
                $media->post_id = $postId;
                $media->type_id = $type->id;
                R::store($media);
            }
        }

        Response::json(['message'=>'Post created','id'=>$postId], 201);
    }

    // GET /api/posts/{id}
    public function show($postId){
        $post = R::load('posts', $postId);
        if (!$post->id) return Response::json(['error'=>'Post not found'],404);

        // views
        $views = R::count('views','post_id = ?',[$postId]);

        // tags
        $tagsPivot = R::findAll('posts_tags',' post_id = ? ',[$postId]);
        $tags = [];
        foreach($tagsPivot as $tp){
            $tag = R::load('tags',$tp->tag_id);
            if ($tag->id) $tags[] = $tag->tags;
        }

        // médias
        $mediasR = R::findAll('medias', ' post_id = ? ', [$postId]);
        $medias = [];
        foreach($mediasR as $m){
            $type = R::load('types_medias', $m->type_id);
            $medias[] = [
                'url' => $m->path_name,
                'type' => $type->type_,
            ];
        }

        // commentaires
        $commentsR = R::findAll('comments',' post_id = ? ORDER BY created_at ASC ', [$postId]);
        $comments = [];
        foreach($commentsR as $c){
            $comments[] = [
                'id' => $c->id,
                'content' => $c->content,
                'user_id' => $c->user_id,
                'created_at' => $c->created_at
            ];
        }

        Response::json([
            'post'=>[
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'user_id' => $post->user_id,
                'created_at' => $post->created_at,
                'update_at' => $post->update_at,
                'views' => $views,
                'tags' => $tags,
                'media' => $medias,
                'comments' => $comments
            ]
        ]);
    }

    // PUT /api/posts/{id}
    public function update($userId, $postId){
        $post = R::load('posts', $postId);
        if (!$post->id) return Response::json(['error'=>'Post not found'],404);
        if ($post->user_id != $userId) return Response::json(['error'=>'Forbidden'],403);

        $b = $this->body();
        $updated = false;

        if (!empty($b['title'])) { $post->title = $b['title']; $updated=true; }
        if (!empty($b['content'])) { $post->content = $b['content']; $updated=true; }
        if ($updated) $post->update_at = date('Y-m-d H:i:s');

        R::store($post);

        // tags
        if (isset($b['tags']) && is_array($b['tags'])){
            // supprimer anciens
            R::exec('DELETE FROM posts_tags WHERE post_id = ?', [$postId]);
            foreach($b['tags'] as $t){
                $tag = R::findOne('tags',' tags = ? ',[$t]);
                if (!$tag){
                    $tag = R::dispense('tags');
                    $tag->tags = $t;
                    $tag->id = R::store($tag);
                }
                $pt = R::dispense('posts_tags');
                $pt->post_id = $postId;
                $pt->tag_id = $tag->id;
                R::store($pt);
            }
        }

        Response::json(['message'=>'Post updated']);
    }

    // DELETE /api/posts/{id}
    public function delete($userId, $postId){
        $post = R::load('posts', $postId);
        if (!$post->id) return Response::json(['error'=>'Post not found'],404);
        if ($post->user_id != $userId) return Response::json(['error'=>'Forbidden'],403);

        R::trash($post);

        // les commentaires, médias et likes sont supprimés automatiquement grâce aux contraintes FOREIGN KEY ON DELETE CASCADE

        Response::json(['message'=>'Post deleted']);
    }
}
?>
