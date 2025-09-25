<?php
namespace App\Controllers;

use App\Utils\Response;
use RedBeanPHP\R;

class LikeController {
    private $redis;

    public function __construct($redis = null){ 
        $this->redis = $redis; 
    }

    // toggle like: if liked -> unlike, else like
    public function toggle_like_post($userId, $postId){
        // Vérifier que le post existe
        $post = R::findOne('posts', 'id = ?', [$postId]);
        if (!$post) return Response::json(['error'=>'Post not found'], 404);
        $likesKey = 'post:' . $postId . ':likes';

        // Vérifier si le like existe
        $existing = R::findOne('likesposts', 'user_id = ? AND post_id = ?', [$userId, $postId]);

        if ($existing) {
            R::trash($existing); // Supprimer le like
            if ($this->redis) $this->redis->decr($likesKey);
            $newCount = $this->redis ? intval($this->redis->get($likesKey) ?? 0) : null;

            return Response::json([
                'message' => 'unliked',
                'likesCount' => $newCount
            ]);
        }

        // Ajouter un like
        $like = R::dispense('likesposts');

        $like->user_id = $userId;
        $like->post_id = intval($postId);
        $like->created_at = date('Y-m-d H:i:s');

        R::store($like);

        if ($this->redis) $this->redis->incr($likesKey);
        $newCount = $this->redis ? intval($this->redis->get($likesKey) ?? 0) : null;

        return Response::json([
            'message' => 'liked',
            'likesCount' => $newCount
        ]);
    }

    // toggle like: if liked -> unlike, else like
    public function toggle_like_user($userId, $toLikeId){
        // Vérifier que le user existe
        $user = R::findOne('users', 'id = ?', [$toLikeId]);
        if (!$user) return Response::json(['error'=>'User not found'], 404);
        $likesKey = 'user:' . $toLikeId . ':likes';

        // Vérifier si le like existe
        $existing = R::findOne('likesusers', 'user_id = ? AND liker_id = ?', [$toLikeId,$userId]);

        if ($existing) {
            R::trash($existing); // Supprimer le like
            if ($this->redis) $this->redis->decr($likesKey);
            $newCount = $this->redis ? intval($this->redis->get($likesKey) ?? 0) : null;

            return Response::json([
                'message' => 'unliked',
                'likesCount' => $newCount
            ]);
        }

        // Ajouter un like
        $like = R::dispense('likesusers');

        $like->user_id = $toLikeId;
        $like->liker_id = $userId;
        $like->created_at = date('Y-m-d H:i:s');

        R::store($like);

        if ($this->redis) $this->redis->incr($likesKey);
        $newCount = $this->redis ? intval($this->redis->get($likesKey) ?? 0) : null;

        return Response::json([
            'message' => 'liked',
            'likesCount' => $newCount
        ]);
    }

    // toggle like: if liked -> unlike, else like
    public function toggle_follow($userId, $toFollowId){
        // Vérifier que le user existe
        $user = R::findOne('users', 'id = ?', [$toFollowId]);
        if (!$user) return Response::json(['error'=>'User not found'], 404);
        $likesKey = 'user:' . $toLikeId . ':likes';

        // Vérifier si le like existe
        $existing = R::findOne('followers', 'user_id = ? AND follower_id = ?', [$toFollowId,$userId]);

        if ($existing) {
            R::trash($existing); // Supprimer le like
            if ($this->redis) $this->redis->decr($likesKey);
            $newCount = $this->redis ? intval($this->redis->get($likesKey) ?? 0) : null;

            return Response::json([
                'message' => 'unliked',
                'likesCount' => $newCount
            ]);
        }

        // Ajouter un like
        $like = R::dispense('followers');

        $like->user_id = $toFollowId;
        $like->follower_id = $userId;
        $like->created_at = date('Y-m-d H:i:s');

        R::store($like);

        if ($this->redis) $this->redis->incr($likesKey);
        $newCount = $this->redis ? intval($this->redis->get($likesKey) ?? 0) : null;

        return Response::json([
            'message' => 'liked',
            'likesCount' => $newCount
        ]);
    }

    // Liste des utilisateurs qui ont liké un post
    public function listUsers($postId){
        $post = R::findOne('posts', 'id = ?', [$postId]);
        if (!$post) return Response::json(['error'=>'Post not found'], 404);

        // Récupérer les likes
        $likes = R::findAll('likesposts', 'post_id = ?', [$postId]);
        if (empty($likes)) return Response::json([]);

        $userIds = array_map(fn($like) => $like->user_id, $likes);

        // Récupérer les users
        $usersData = R::findAll('users', 'id IN ('.implode(',', $userIds).')');

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
