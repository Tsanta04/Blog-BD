<?php 
namespace App\Controllers;

use App\Utils\Response;
use RedBeanPHP\R;

class CommentController {

    public function __construct() {
    }

    // Créer un commentaire
    public function create() {
        $b = json_decode(file_get_contents('php://input'), true);

        if (empty($b['content']) || empty($b['post_id']) || empty($b['user_id'])) {
            return Response::json(['error' => 'Missing fields'], 400);
        }
        
        // Vérifier que le post existe
        $post = R::load('posts', $b['post_id']);
        if (!$post->id) {
            return Response::json(['error' => 'Post not found'], 404);
        }

        $comment = R::dispense('comments');
        $comment->post_id    = $b['post_id'];
        $comment->user_id    = $b['user_id'];
        $comment->content    = $b['content'];
        $comment->created_at = date('c');
        $comment->updated_at = date('c');

        $id = R::store($comment);

        Response::json(['message' => 'Comment added', 'id' => $id], 201);
    }

    // Lire tous les commentaires d'un post
    public function index($postId) {
        $post = R::load('post', $postId);
        if (!$post->id) {
            return Response::json(['error' => 'Post not found'], 404);
        }

        $comments = R::findAll('comment', ' post_id = ? ORDER BY created_at ASC ', [$postId]);

        $data = [];
        foreach ($comments as $c) {
            $data[] = [
                'id'         => $c->id,
                'content'    => $c->content,
                'user_id'    => $c->user_id,
                'created_at' => $c->created_at,
                'updated_at' => $c->updated_at
            ];
        }

        Response::json($data);
    }

    // Modifier un commentaire
    public function update($userId, $commentId) {
        $b = json_decode(file_get_contents('php://input'), true);
        if (empty($b['content'])) {
            return Response::json(['error' => 'Missing content'], 400);
        }

        $comment = R::load('comment', $commentId);
        if (!$comment->id) {
            return Response::json(['error' => 'Comment not found'], 404);
        }
        if ((string)$comment->user_id !== (string)$userId) {
            return Response::json(['error' => 'Forbidden'], 403);
        }

        $comment->content    = $b['content'];
        $comment->updated_at = date('c');
        R::store($comment);

        Response::json(['message' => 'Comment updated']);
    }

    // Supprimer un commentaire
    public function delete($userId, $commentId) {
        $comment = R::load('comment', $commentId);
        if (!$comment->id) {
            return Response::json(['error' => 'Comment not found'], 404);
        }
        if ((string)$comment->user_id !== (string)$userId) {
            return Response::json(['error' => 'Forbidden'], 403);
        }

        R::trash($comment);
        Response::json(['message' => 'Comment deleted']);
    }
}
?>
