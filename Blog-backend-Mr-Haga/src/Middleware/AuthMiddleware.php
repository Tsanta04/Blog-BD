<?php
    namespace App\Middleware;

    use App\Utils\Response;

    class AuthMiddleware {
        public static function guard($redis, $callback) {
            $headers = getallheaders();

            $token = isset($headers['Authorization']) ? $headers['Authorization'] : null;

            if (!$token) 
                return Response::json(['error' => 'Unauthorized'], 401);

            $token = preg_replace('/^Bearer\s+/i','',$token);
            $userId = $redis->get('session:token:' . $token);
            
            var_dump($token);
            die();

            if (!$userId) 
                return Response::json(['error' => 'Unauthorized or session expired'], 401);
            
            $callback(intval($userId));
        }
    }

?>