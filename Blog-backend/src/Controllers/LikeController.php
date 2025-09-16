<?php
namespace App\Controllers;

use App\Utils\Response;
use MongoDB\BSON\ObjectId;

class LikeController {
    private $mongo;
    private $redis;

    public function __construct($mongo, $redis){ 
        $this->mongo = $mongo; 
        $this->redis = $redis; 
    }

    // toggle like: if liked -> unlike, else like
    public function toggle($userId, $postId){
        // vérifier que le post existe
        $post = $this->mongo->posts->findOne(['_id' => new ObjectId($postId)]);
        if (!$post) return Response::json(['error'=>'Post not found'],404);

        // vérifier si like existe
        $existing = $this->mongo->likes->findOne([
            'user_id' => new ObjectId($userId),
            'post_id' => new ObjectId($postId)
        ]);

        $likesKey = 'post:' . $postId . ':likes';

        if ($existing) {
            $this->mongo->likes->deleteOne([
                '_id' => $existing['_id']
            ]);
            $this->redis->decr($likesKey);
            return Response::json(['message'=>'unliked']);
        }

        // ajouter un like
        $like = [
            'user_id' => new ObjectId($userId),
            'post_id' => new ObjectId($postId),
            'created_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        $this->mongo->likes->insertOne($like);
        $this->redis->incr($likesKey);

        return Response::json(['message'=>'liked']);
    }

    // Liste des utilisateurs qui ont liké un post
    public function listUsers($postId){
        $post = $this->mongo->posts->findOne(['_id' => new ObjectId($postId)]);
        if (!$post) return Response::json(['error'=>'Post not found'],404);

        $likesCursor = $this->mongo->likes->find(['post_id' => new ObjectId($postId)]);
        $userIds = [];
        foreach ($likesCursor as $like) {
            $userIds[] = (string)$like['user_id'];
        }

        // récupérer les infos des users depuis PostgreSQL
        $usersData = [];
        foreach ($userIds as $id) {
            $user = $this->rb->load('user', intval($id)); // Assumes user.id is int
            if ($user->id) {
                $usersData[] = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ];
            }
        }

        Response::json($usersData);
    }
}
?>
