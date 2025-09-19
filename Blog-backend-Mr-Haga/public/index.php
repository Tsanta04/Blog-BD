<?php
    require_once __DIR__ . '/../vendor/autoload.php';
    require_once __DIR__ . '/../src/bootstrap.php';

    use App\Controllers\AuthController;
    use App\Controllers\PostController;
    use App\Controllers\CommentController;
    use App\Controllers\LikeController;
    use App\Middleware\AuthMiddleware;

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

    if ($uri === '/api/me_' && $method === 'POST') {
        AuthMiddleware::guard($redis, fn($userId) => (new AuthController($rb, $redis))->me()); exit;
    }

    if ($uri === '/api/logout' && $method === 'POST') {
        AuthMiddleware::guard($redis, fn($userId) => (new AuthController($rb, $redis))->logout()); exit;
    }

    if (preg_match('#^/api/update_user/(\d+)$#', $uri, $m) && $method === 'PUT') {
        $userId = intval($m[1]);
        (new AuthController($rb, $redis))->updateUser($userId); exit;
    }

    // Posts
    if ($uri === '/api/posts' && $method === 'GET') {
        (new PostController($rb, $mongo, $redis))->index(); exit;
    }

    if ($uri === '/api/posts' && $method === 'POST') {
        AuthMiddleware::guard($redis, fn($userId) => (new PostController($rb, $mongo, $redis))->create($userId)); exit;
    }

    if (preg_match('#^/api/posts/(\d+)$#', $uri, $m)) {
        $id = intval($m[1]);
        switch ($method) {
            case 'GET': (new PostController($rb, $mongo, $redis))->show($id); break;
            case 'PUT':
                AuthMiddleware::guard($redis, fn($userId) => (new PostController($rb, $mongo, $redis))->update($userId, $id));
                break;
            case 'DELETE':
                AuthMiddleware::guard($redis, fn($userId) => (new PostController($rb, $mongo, $redis))->delete($userId, $id));
                break;
        }
        exit;
    }

    // Comments
    if (preg_match('#^/api/posts/(\d+)/comments$#', $uri, $m)) {
        $postId = intval($m[1]);
        if ($method === 'GET') (new CommentController($mongo))->index($postId);
        if ($method === 'POST') AuthMiddleware::guard($redis, fn($userId) => (new CommentController($rb))->create($userId, $postId));
        exit;
    }

    if (preg_match('#^/api/comments/(\w+)$#', $uri, $m)) {
        $commentId = $m[1];
        switch ($method) {
            case 'PUT': AuthMiddleware::guard($redis, fn($userId) => (new CommentController($rb,$mongo))->update($userId, $commentId)); break;
            case 'DELETE': AuthMiddleware::guard($redis, fn($userId) => (new CommentController($rb,$mongo))->delete($userId, $commentId)); break;
        }
        exit;
    }

    // Likes
    if (preg_match('#^/api/like_post/(\d+)$#', $uri, $m)) {
        $postId = intval($m[1]);
        switch ($method) {
            case 'POST': AuthMiddleware::guard($redis, fn($userId) => (new LikeController($rb,$redis))->like($userId, $postId)); break;
            case 'DELETE': AuthMiddleware::guard($redis, fn($userId) => (new LikeController($rb,$redis))->unlike($userId, $postId)); break;
        }
        exit;
    }

    if (preg_match('#^/api/like_post/(\d+)$#', $uri, $m) && $method === 'GET') {
        $postId = intval($m[1]);
        (new LikeController($rb, $mongo, $redis))->listUsers($postId); exit;
    }

    http_response_code(404);
    echo json_encode(["error" => "Not found"]);
?>