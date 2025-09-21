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
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
        $posts = R::findAll('posts', ' ORDER BY created_at DESC LIMIT ? ', [$limit]);

        $result = [];
        foreach ($posts as $p){
            $postId = $p->id;

            // likes
            $likesR = R::findAll('likes_posts', ' post_id = ? ', [$postId]);
            $likes = [];
            foreach($likesR as $l){
                $user = R::load('users', $l->user_id);
                if ($user->id) $likes[] = ['id'=>$user->id,'name'=>$user->name]; // ajouter les champs nécessaires
            }

            // views
            $viewsR = R::findAll('views', ' post_id = ? ', [$postId]);
            $viewsCount = count($viewsR);

            // tags
            $tagsPivot = R::findAll('posts_tags', ' post_id = ? ', [$postId]);
            $tags = [];
            foreach($tagsPivot as $tp){
                $tag = R::load('tags', $tp->tag_id);
                if ($tag->id) $tags[] = ['id'=>$tag->id,'tags'=>$tag->tag];
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

            $result[] = [
                'id' => $postId,
                'title' => $p->title,
                'content' => $p->content,
                'user_id' => $p->user_id,
                'user' => R::load('users', $p->user_id), // charger l'utilisateur
                'tags' => $tags,
                'medias' => $medias,
                'comments' => $comments,
                'commentsCount' => count($comments),
                'likes' => $likes,
                'likesCount' => count($likes),
                'viewsCount' => $viewsCount,
                'createdAt' => $p->created_at,
            ];
        }

        Response::json(['data' => $result]);
    }
    
    // GET /api/post/{id}
    public function show($postId){
        $post = R::load('posts', $postId);
        if (!$post->id) return Response::json(['error'=>'Post not found'],404);

        // likes
        $likesR = R::findAll('likes_posts', ' post_id = ? ', [$postId]);
        $likes = [];
        foreach($likesR as $l){
            $user = R::load('users', $l->user_id);
            if ($user->id) $likes[] = ['id'=>$user->id,'name'=>$user->name];
        }

        // views
        $viewsR = R::findAll('views', ' post_id = ? ', [$postId]);
        $viewsCount = count($viewsR);

        // tags
        $tagsPivot = R::findAll('posts_tags',' post_id = ? ',[$postId]);
        $tags = [];
        foreach($tagsPivot as $tp){
            $tag = R::load('tags',$tp->tag_id);
            if ($tag->id) $tags[] = ['id'=>$tag->id,'tags'=>$tag->tags];
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
                'user' => R::load('users', $post->user_id),
                'tags' => $tags,
                'medias' => $medias,
                'comments' => $comments,
                'commentsCount' => count($comments),
                'likes' => $likes,
                'likesCount' => count($likes),
                'viewsCount' => $viewsCount,
                'createdAt' => $post->created_at,
            ]
        ]);
    }

    // GET /api/posts/search?query=...
    public function filter() {
        $query = isset($_GET['q']) ? trim($_GET['q']) : '';
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;

        if ($query === '') {
            // si pas de query, on renvoie les derniers posts
            $posts = R::findAll('posts', ' ORDER BY created_at DESC LIMIT ? ', [$limit]);
        } else {
            // recherche par titre ou contenu (LIKE)
            $posts = R::find('posts', ' (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC LIMIT ? ', 
                ["%$query%", "%$query%", $limit]);
        }

        $result = [];
        foreach ($posts as $p) {
            $postId = $p->id;

            // Likes
            $likesR = R::findAll('likes_posts', ' post_id = ? ', [$postId]);
            $likes = [];
            foreach($likesR as $l){
                $user = R::load('users', $l->user_id);
                if ($user->id) $likes[] = ['id'=>$user->id,'name'=>$user->name];
            }

            // Views
            $viewsR = R::findAll('views', ' post_id = ? ', [$postId]);
            $viewsCount = count($viewsR);

            // Tags
            $tagsPivot = R::findAll('posts_tags', ' post_id = ? ', [$postId]);
            $tags = [];
            foreach($tagsPivot as $tp){
                $tag = R::load('tags', $tp->tag_id);
                if ($tag->id) $tags[] = ['id'=>$tag->id,'tag'=>$tag->tag];
            }

            // Médias
            $mediasR = R::findAll('medias', ' post_id = ? ', [$postId]);
            $medias = [];
            foreach($mediasR as $m){
                $type = R::load('types_medias', $m->type_id);
                $medias[] = [
                    'url' => $m->path_name,
                    'type' => $type->type_,
                ];
            }

            // Commentaires
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

            $result[] = [
                'id' => $postId,
                'title' => $p->title,
                'content' => $p->content,
                'user_id' => $p->user_id,
                'user' => R::load('users', $p->user_id),
                'tags' => $tags,
                'medias' => $medias,
                'comments' => $comments,
                'commentsCount' => count($comments),
                'likes' => $likes,
                'likesCount' => count($likes),
                'viewsCount' => $viewsCount,
                'createdAt' => $p->created_at,
            ];
        }

        Response::json(['posts' => $result]);
    }

    public function create() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['title']) || !isset($data['content']) || !isset($data['user_id'])) {
            Response::json(['error' => 'title, content et user_id sont requis'], 400);
            exit;
        }

        $post = R::dispense('posts');
        $post->id = 123456;
        $post->title = trim($data['title']);
        $post->content = trim($data['content']);
        $post->user_id = $data['user_id']; // UUID
        $post->created_at = date('Y-m-d H:i:s');
        $post->update_at = date('Y-m-d H:i:s');

        $postId = R::store($post);
        var_dump($post);
        die();

        // TAGS
        if (!empty($data['tags']) && is_array($data['tags'])) {
            foreach ($data['tags'] as $tagData) {
                $tagName = $tagData['tags'] ?? null;
                if (!$tagName) continue;

                $tag = R::findOne('tags', ' tags = ? ', [$tagName]);
                if (!$tag) {
                    $tag = R::dispense('tags');
                    $tag->tags = $tagName;
                    $tag->id = R::store($tag);
                }

                $pivot = R::dispense('posts_tags');
                $pivot->post_id = $postId;
                $pivot->tag_id = $tag->id;
                R::store($pivot);
            }
        }

        // MEDIAS
        if (!empty($data['medias']) && is_array($data['medias'])) {
            foreach ($data['medias'] as $m) {
                $media = R::dispense('medias');
                $media->post_id = $postId;
                $media->path_name = $m['path_name'] ?? '';
                $media->type_id = isset($m['type_id']) ? intval($m['type_id']) : 1;
                R::store($media);
            }
        }

        $post = R::load('posts', $postId);
        Response::json(['post' => $post, 'message' => 'Post créé avec succès']);
    }

    // create, update, delete restent identiques
}
?>
