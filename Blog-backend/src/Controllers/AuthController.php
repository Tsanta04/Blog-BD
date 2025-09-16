<?php
    namespace App\Controllers;

    use App\Utils\Response;

    class AuthController {
        private $rb; private $redis;

        public function __construct($rb, $redis) { 
            $this->rb = $rb; $this->redis = $redis; 
        }

        private function body() { 
            return json_decode(file_get_contents('php://input'), true); 
        }

        public function register() {
            $b = $this->body();

            if (empty($b['email']) || empty($b['password']) || empty($b['name'])) 
                return Response::json(['error'=>'Missing fields'], 400);

            $existing = R::findOne('user', ' email = ? ', [$b['email']]);
            if ($existing) 
                return Response::json(['error'=>'Email exists'], 409);

            $u = R::dispense('user');
            $u->name = $b['name']; $u->email = $b['email']; $u->password = password_hash($b['password'], PASSWORD_DEFAULT); $u->created_at = date('c');
            $id = R::store($u);
            Response::json(['message'=>'Registered','id'=>$id], 201);
        }


        public function login() {
            $b = $this->body();

            if (empty($b['email']) || empty($b['password'])) 
                return Response::json(['error'=>'Missing fields'], 400);

            $user = R::findOne('user',' email = ? ', [$b['email']]);

            if (!$user || !password_verify($b['password'], $user->password)) 
                return Response::json(['error'=>'Invalid credentials'], 401);
            
            $token = bin2hex(random_bytes(16));
            $ttl = isset($_ENV['REDIS_TTL']) ? intval($_ENV['REDIS_TTL']) : 86400;
            $this->redis->setex('session:token:' . $token, $ttl, $user->id);

            Response::json(['token' => $token, 'user' => ['id'=>$user->id,'name'=>$user->name,'email'=>$user->email]]);
        }

        public function logout() {
            $headers = getallheaders();
            $token = isset($headers['Authorization']) ? preg_replace('/^Bearer\s+/i','',$headers['Authorization']) : null;

            if (!$token) {
                return Response::json(['error' => 'Token missing'], 400);
            }

            if ($this->redis->exists('session:token:' . $token)) {
                $this->redis->del('session:token:' . $token);
                return Response::json(['message' => 'Logged out successfully']);
            } else {
                return Response::json(['error' => 'Invalid or expired token'], 401);
            }
        }
    }

?>