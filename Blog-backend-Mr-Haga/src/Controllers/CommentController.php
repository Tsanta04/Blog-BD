<?php 
namespace App\Controllers;

use App\Utils\Response;
use MongoDB\BSON\ObjectId;

class CommentController {
    private $mongo;

    public function __construct($mongo) {
        $this->mongo = $mongo;
    }

    // Créer un commentaire
    public function create($userId, $postId){
        $b = json_decode(file_get_contents('php://input'), true);

        if (empty($b['content'])) 
            return Response::json(['error'=>'Missing content'],400);

        // Vérifier que le post existe
        $post = $this->mongo->posts->findOne(['_id' => new ObjectId($postId)]);
        if (!$post) return Response::json(['error'=>'Post not found'],404);

        $comment = [
            'post_id' => new ObjectId($postId),
            'user_id' => new ObjectId($userId),
            'content' => $b['content'],
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ];

        $insertResult = $this->mongo->comments->insertOne($comment);

        Response::json(['message'=>'Comment added','id'=>$insertResult->getInsertedId()],201);
    }

    // Lire tous les commentaires d'un post
    public function index($postId){
        $post = $this->mongo->posts->findOne(['_id' => new ObjectId($postId)]);
        if (!$post) return Response::json(['error'=>'Post not found'],404);

        $cursor = $this->mongo->comments->find(
            ['post_id' => new ObjectId($postId)],
            ['sort' => ['created_at' => 1]]
        );

        $data = [];
        foreach($cursor as $c){
            $data[] = [
                'id' => (string)$c['_id'],
                'content' => $c['content'],
                'user_id' => (string)$c['user_id'],
                'created_at' => $c['created_at']->toDateTime()->format('c')
            ];
        }

        Response::json($data);
    }

    // Modifier un commentaire
    public function update($userId, $commentId){
        $b = json_decode(file_get_contents('php://input'), true);
        if (empty($b['content'])) 
            return Response::json(['error'=>'Missing content'],400);

        $comment = $this->mongo->comments->findOne(['_id' => new ObjectId($commentId)]);
        if (!$comment) return Response::json(['error'=>'Comment not found'],404);
        if ((string)$comment['user_id'] !== (string)$userId) return Response::json(['error'=>'Forbidden'],403);

        $this->mongo->comments->updateOne(
            ['_id' => new ObjectId($commentId)],
            ['$set' => ['content' => $b['content'], 'updated_at' => new \MongoDB\BSON\UTCDateTime()]]
        );

        Response::json(['message'=>'Comment updated']);
    }

    // Supprimer un commentaire
    public function delete($userId, $commentId){
        $comment = $this->mongo->comments->findOne(['_id' => new ObjectId($commentId)]);
        if (!$comment) return Response::json(['error'=>'Comment not found'],404);
        if ((string)$comment['user_id'] !== (string)$userId) return Response::json(['error'=>'Forbidden'],403);

        $this->mongo->comments->deleteOne(['_id' => new ObjectId($commentId)]);
        Response::json(['message'=>'Comment deleted']);
    }
}
?>
