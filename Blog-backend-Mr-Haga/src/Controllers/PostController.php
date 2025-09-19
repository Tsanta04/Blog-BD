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

    // GET /api/posts/{id}
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

    // create, update, delete restent identiques
}
?>
