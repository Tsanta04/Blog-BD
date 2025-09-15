<?php
    namespace App\Controllers;

    use App\Utils\Response;

    class LikeController {
        private $rb; private $redis;

        public function __construct($rb, $redis){ 
            $this->rb=$rb; 
            $this->redis=$redis; 
        }

        // toggle like: if liked -> unlike, else like
        public function toggle($userId, $postId){
            $p = R::load('post', $postId); if (!$p->id) return Response::json(['error'=>'Post not found'],404);

            // check SQL join table
            $existing = R::findOne('likes', ' user_id = ? AND post_id = ? ', [$userId, $postId]);
            if ($existing) {
                R::exec('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [$userId, $postId]);

                // decrement redis counter
                $this->redis->decr('post:'.$postId.':likes');
                return Response::json(['message'=>'unliked']);
            }

            // insert
            R::exec('INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, ?)', [$userId, $postId, date('c')]);
            $this->redis->incr('post:'.$postId.':likes');

            return Response::json(['message'=>'liked']);
        }
    }
?>