<?php
namespace App\Controllers;

use App\Utils\Response;
use MongoDB\BSON\ObjectId;
use RedBeanPHP\R;

class LikeController {
    private $mongo;
    private $redis;
    private $rb;

    public function __construct($mongo, $redis, $rb){ 
        $this->mongo = $mongo; 
        $this->redis = $redis; 
        $this->rb = $rb;
    }

    // toggle like: if liked -> unlike, else like
    public function toggle($userId, $postId){
        // Vérifier que le post existe
        $post = $this->mongo->posts->findOne(['_id' => new ObjectId($postId)]);
        if (!$post) return Response::json(['error'=>'Post not found'], 404);

        $likesKey = 'post:' . $postId . ':likes';

        // Vérifier si le like existe
        $existing = $this->mongo->likes->findOne([
            'user_id' => new ObjectId($userId),
            'post_id' => new ObjectId($postId)
        ]);

        if ($existing) {
            $this->mongo->likes->deleteOne(['_id' => $existing['_id']]);
            $this->redis->decr($likesKey);
            $newCount = intval($this->redis->get($likesKey) ?? 0);
            return Response::json([
                'message' => 'unliked',
                'likesCount' => $newCount
            ]);
        }

        // Ajouter un like
        $like = [
            'user_id' => new ObjectId($userId),
            'post_id' => new ObjectId($postId),
            'created_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        $this->mongo->likes->insertOne($like);
        $this->redis->incr($likesKey);
        $newCount = intval($this->redis->get($likesKey) ?? 0);

        return Response::json([
            'message' => 'liked',
            'likesCount' => $newCount
        ]);
    }

    // Liste des utilisateurs qui ont liké un post
    public function listUsers($postId){
        $post = $this->mongo->posts->findOne(['_id' => new ObjectId($postId)]);
        if (!$post) return Response::json(['error'=>'Post not found'], 404);

        // Récupérer les user_id depuis Mongo
        $likesCursor = $this->mongo->likes->find(['post_id' => new ObjectId($postId)]);
        $userIds = [];
        foreach ($likesCursor as $like) {
            $userIds[] = intval((string)$like['user_id']); // Conversion en int pour RedBean
        }

        if (empty($userIds)) return Response::json([]);

        // Récupérer les infos des users depuis PostgreSQL en une seule requête
        $usersData = R::findAll('user', ' id IN ('.implode(',', $userIds).') ');

        $result = [];
        foreach ($usersData as $user) {
            $result[] = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ];
        }

        Response::json($result);
    }
}
?>
