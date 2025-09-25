<?php
namespace App\Controllers;

use App\Utils\Response;
use RedBeanPHP\R;

class UserController {


    public function __construct(){ 

    }    
    
    // Récupérer un utilisateur par son id
    public function getOne($id,$likerId){
        // Récupérer l'utilisateur
        $user = R::findOne('users', 'id = ?', [$id]);
        if (!$user) return Response::json(['error' => 'User not found'], 404);

        // Followers
        $followers = R::findAll('followers', 'user_id = ?', [$id]);
        $followersCount = count($followers);

        // Likes
        $likes = R::findAll('likesusers', 'user_id = ?', [$id]);
        $likesCount = count($likes);

        $isLiked = false;
        $isFollowed = false;
        
        if($likerId){
            $isLiked = R::findOne('likesusers', 'user_id = ? AND liker_id = ?', [$id, $likerId]);
            $isFollowed = R::findOne('followers', 'user_id = ? AND follower_id = ?', [$id, $likerId]);
        }

        // Posts
        $posts = R::findAll('posts', 'user_id = ?', [$id]);
        $postsData = [];
        foreach($posts as $post){
            $postsData[] = [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'created_at' => $post->created_at,
            ];
        }
        $postsCount = count($postsData);

        Response::json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'posts' => $postsData,
            'postsCount' => $postsCount,
            'followersCount' => $followersCount,
            'isLiked' => $isLiked,
            'isFollowed' => $isFollowed,
            'likesCount' => $likesCount
        ]);
    }


    // Rechercher des utilisateurs par query (ex: nom ou email)
    public function search($query){
        $query = "%$query%";
        error_log($query);
        if ($query === '') {
            // si pas de query, on renvoie les derniers posts
            $users = R::findAll('users', ' ORDER BY created_at DESC LIMIT ? ', [$limit]);
        } else {
            $users = R::findAll('users', 'name LIKE ? OR email LIKE ? ORDER BY name ASC', [$query, $query]);
        }

        $result = [];
        foreach ($users as $user) {
            $result[] = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ];
        }
        Response::json($result);
    }

    // Récupérer tous les utilisateurs
    public function getAll(){
        $users = R::findAll('users', 'ORDER BY name ASC');

        $result = [];
        foreach ($users as $user) {
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
