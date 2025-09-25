<?php
    require_once __DIR__ . '/../vendor/autoload.php';
    require_once __DIR__ . '/../src/bootstrap.php';

    use App\Controllers\AuthController;
    use App\Controllers\PostController;
    use App\Controllers\CommentController;
    use App\Controllers\LikeController;
    use App\Middleware\AuthMiddleware;
    use App\Controllers\UserController;    

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");


    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = rtrim($uri, '/');

    // Auth
    if ($uri === '/api/login' && $method === 'POST') {
        (new AuthController($redis))->login(); exit;
    }

    if ($uri === '/api/register' && $method === 'POST') {
        (new AuthController($redis))->register(); exit;
    }

    if ($uri === '/api/moi' && $method === 'GET') {
        AuthMiddleware::guard($redis, fn($userId) => (new AuthController($redis))->me($userId)); exit;
    }

    if ($uri === '/api/logout' && $method === 'POST') {
        AuthMiddleware::guard($redis, fn($userId) => (new AuthController($redis))->logout()); exit;
    }

    if (preg_match('#^/api/update_user/(\d+)$#', $uri, $m) && $method === 'PUT') {
        $userId = intval($m[1]);
        (new AuthController($rb, $redis))->updateUser($userId); exit;
    }

    // Posts
    if ($uri === '/api/posts' && $method === 'GET') {
        (new PostController($redis))->index(); exit;
    }

    if ($uri === '/api/post/stat' && $method === 'GET') {
        AuthMiddleware::guard($redis, fn($userId) => (new PostController($redis))->getPostStat($userId)); exit;
    }    

    if (preg_match('#^/api/post/(\d+)$#', $uri, $m)) {
        $id = intval($m[1]);
        switch ($method) {
            case 'GET': (new PostController($redis))->show($id); break;
            case 'PUT':
                AuthMiddleware::guard($redis, fn($userId) => (new PostController($redis))->update($userId, $id));
                break;
            case 'DELETE':
                AuthMiddleware::guard($redis, fn($userId) => (new PostController($redis))->delete($userId, $id));
                break;
        }
        exit;
    }

    if ($uri === '/api/posts/search' && $method === 'GET') {
        (new PostController($redis))->filter(); exit;
    }

    if (preg_match('#^/api/posts/([0-9a-fA-F\-]+)$#', $uri, $m)) {
        $userId = $m[1];
        switch ($method) {
            case 'GET': (new PostController($redis))->getByUsers($userId); break;
            case 'PUT':
                AuthMiddleware::guard($redis, fn($userId) => (new PostController($redis))->update($userId, $id));
                break;
            case 'DELETE':
                AuthMiddleware::guard($redis, fn($userId) => (new PostController($redis))->delete($userId, $id));
                break;
        }
        exit;
    }

    if ($uri === '/api/post' && $method === 'POST') {
        AuthMiddleware::guard($redis, fn() => (new PostController())->create()); exit;
        // (new PostController($redis))->create(); exit;
    }

    // Comments
    if ($uri === '/api/comment' && $method === 'POST') {
        (new CommentController())->create(); exit;
    }

    // Likes
    if (preg_match('#^/api/like_post/(\d+)$#', $uri, $m)) {
        $postId = intval($m[1]);

        AuthMiddleware::guard($redis, function($userId) use ($postId) {
            $likeController = new LikeController($redis);
            $likeController->toggle_like_post($userId, $postId);
        });
        exit;
    }

    if (preg_match('#^/api/liked_post/(\d+)$#', $uri, $m) && $method === 'GET') {
        $postId = intval($m[1]);
        (new LikeController($redis))->listUsers($postId); exit;
    }


    // Users
    if (preg_match('#^/api/user/([0-9a-fA-F\-]+)$#', $uri, $m) && $method === 'GET') {
        $userId = $m[1];
        AuthMiddleware::guard($redis, fn($likerId) => (new UserController())->getOne($userId, $likerId));
        exit();
    }

    if ($uri === '/api/users/search' && $method === 'GET') {
        AuthMiddleware::guard($redis, fn() => (new UserController())->search($_GET['q'] ?? ''));
        exit;
    }

    if ($uri === '/api/users' && $method === 'GET') {
        AuthMiddleware::guard($redis, fn() => (new UserController())->getAll());
        exit;
    }

    // Users
    if (preg_match('#^/api/like_user/([0-9a-fA-F\-]+)$#', $uri, $m) && $method === 'POST') {
        $toLikeId = $m[1];
        AuthMiddleware::guard($redis, fn($userId) => (new LikeController())->toggle_like_user($userId,$toLikeId)); exit;
    }    

    if (preg_match('#^/api/follow/([0-9a-fA-F\-]+)$#', $uri, $m) && $method === 'POST') {
        $toFollowId = $m[1];
        AuthMiddleware::guard($redis, fn($userId) => (new LikeController())->toggle_follow($userId,$toFollowId)); exit;
    }    

    http_response_code(404);
    echo json_encode(["error" => "Not found"]);
?>