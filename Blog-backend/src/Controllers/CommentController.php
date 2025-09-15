<?php
    namespace App\Controllers;

    use App\Utils\Response;

    class CommentController {
        public function create($userId, $postId){
            $b = json_decode(file_get_contents('php://input'), true);

            if (empty($b['content'])) 
                return Response::json(['error'=>'Missing content'],400);

            $p = R::load('post', $postId); if (!$p->id) return Response::json(['error'=>'Post not found'],404);
            $c = R::dispense('comment'); $c->content = $b['content']; $c->post_id=$postId; $c->user_id=$userId; $c->created_at=date('c');
            $id = R::store($c);
            
            Response::json(['message'=>'Comment added','id'=>$id],201);
        }
    }

?>