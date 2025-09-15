<?php
    require_once __DIR__ . '/../vendor/autoload.php';
    require_once __DIR__ . '/../src/bootstrap.php';

    use App\Controllers\AuthController;
    use App\Controllers\PostController;
    use App\Controllers\CommentController;
    use App\Controllers\LikeController;
    use App\Middleware\AuthMiddleware;

    $method = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = rtrim($uri, '/');

    // simple routing (for demo purposes)
    if ($uri === '/api/register' && $method === 'POST') {
        (new AuthController($rb, $redis))->register();
        exit;
    }

    if ($uri === '/api/login' && $method === 'POST') {
        (new AuthController($rb, $redis))->login();
        exit;
    }

    // posts list & create
    if ($uri === '/api/posts') {
        if ($method === 'GET') { 
            (new PostController($rb, $mongo, $redis))->index(); exit; 
        }
        if ($method === 'POST') { 
            AuthMiddleware::guard($redis, function($userId) use($rb,$mongo,$redis){ 
                (new PostController($rb,$mongo,$redis))->create($userId); 
            }); 
            exit; 
        }
    }

    // post details
    if (preg_match('#^/api/posts/(\d+)$#', $uri, $m) && $method === 'GET') {
        $id = intval($m[1]); (new PostController($rb,$mongo,$redis))->show($id); exit;
    }

    // comments
    if (preg_match('#^/api/posts/(\d+)/comments$#', $uri, $m) && $method === 'POST') {
        $postId = intval($m[1]); AuthMiddleware::guard($redis, function($userId) use($rb,$postId){ (new CommentController($rb))->create($userId,$postId); }); exit;
    }

    // like
    if (preg_match('#^/api/posts/(\d+)/like$#', $uri, $m) && $method === 'POST') {
        $postId = intval($m[1]); AuthMiddleware::guard($redis, function($userId) use($rb,$redis,$postId){ (new LikeController($rb,$redis))->toggle($userId,$postId); }); exit;
    }

    http_response_code(404);
    echo json_encode(["error" => "Not found"]);

?>