<?php
namespace App\Controllers;
use App\Utils\Response;
use RedBeanPHP\R;

class AuthController {
    private $rb;

    public function __construct($redis) {
        $this->redis = $redis;
    }

    private function body() {
        return json_decode(file_get_contents('php://input'), true);
    }

    private function getTokenFromHeader() {
        $headers = getallheaders();
        return isset($headers['Authorization']) ? preg_replace('/^Bearer\s+/i','',$headers['Authorization']) : null;
    }

    private function generateToken() {
        return bin2hex(random_bytes(16));
    }

    private function getTTL() {
        return isset($_ENV['REDIS_TTL']) ? intval($_ENV['REDIS_TTL']) : 86400;
    }

    // --- REGISTER ---
    public function register() {
        $b = $this->body();

        if (empty($b['email']) || empty($b['password']) || empty($b['name'])) {
            return Response::json(['error'=>'Missing fields'], 400);
        }

        $existing = R::findOne('users', 'email = ?', [$b['email']]);
        if ($existing) return Response::json(['error'=>'Email exists'], 409);

        $u = R::dispense('users');
        $u->name = $b['name'];
        $u->email = $b['email'];
        $u->password = password_hash($b['password'], PASSWORD_DEFAULT);
        $u->created_at = date('c');
        $id = R::store($u);

        // Générer token
        $token = $this->generateToken();
        $this->redis->setex('session:token:' . $token, $this->getTTL(), $id);

        Response::json([
            'message' => 'Registered',
            'user' => ['id'=>$id, 'name'=>$u->name, 'email'=>$u->email],
            'token' => ['accessToken'=>$token, 'refreshToken'=>''] // format AuthToken
        ], 201);
    }

    // --- LOGIN ---
    public function login() {
        $b = $this->body();

        if (empty($b['email']) || empty($b['password'])) {
            return Response::json(['error'=>'Missing fields'], 400);
        }

        $user = R::findOne('users', 'email = ?', [$b['email']]);
        if (!$user || !password_verify($b['password'], $user->password)) {
            return Response::json(['error'=>'Invalid credentials'], 401);
        }

        $token = $this->generateToken();

        // --- DÉBOGAGE : AFFICHER LE TOKEN ---
        // Décommentez les lignes ci-dessous pour voir le token généré

        $this->redis->setex('session:token:' . $token, $this->getTTL(), $user->id);

        Response::json([
            'user' => ['id'=>$user->id, 'name'=>$user->name, 'email'=>$user->email],
            'token' => ['accessToken'=>$token, 'refreshToken'=>'']
        ]);
    }

    // --- LOGOUT ---
    public function logout() {
        $token = $this->getTokenFromHeader();

        if (!$token) return Response::json(['error'=>'Token missing'], 400);

        if ($this->redis->exists('session:token:' . $token)) {
            $this->redis->del('session:token:' . $token);
            return Response::json(['message'=>'Logged out successfully']);
        } else {
            return Response::json(['error'=>'Invalid or expired token'], 401);
        }
    }

    // --- ME ---
    public function me() {
        $token = $this->getTokenFromHeader();
        if (!$token) return Response::json(['error'=>'Token missing'], 400);

        $userId = $this->redis->get('session:token:' . $token);
        if (!$userId) return Response::json(['error'=>'Invalid or expired token'], 401);

        $user = R::load('users', $userId);
        Response::json(['user'=>['id'=>$user->id,'name'=>$user->name,'email'=>$user->email]]);
    }

    // --- UPDATE USER ---
    public function updateUser($id) {
        $token = $this->getTokenFromHeader();
        if (!$token) return Response::json(['error'=>'Token missing'], 400);

        $userId = $this->redis->get('session:token:' . $token);
        if (!$userId || $userId != $id) return Response::json(['error'=>'Unauthorized'], 401);

        $b = $this->body();
        if (empty($b['username']) || empty($b['email'])) return Response::json(['error'=>'Missing fields'], 400);

        $user = R::load('user', $id);
        $user->name = $b['username'];
        $user->email = $b['email'];
        R::store($user);

        Response::json(['user'=>['id'=>$user->id,'name'=>$user->name,'email'=>$user->email]]);
    }
}
?>
