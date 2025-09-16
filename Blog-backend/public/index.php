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

    if ($uri === '/api/logout' && $method === 'POST') {
        (new AuthController($rb, $redis))->logout();
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
        $id = intval($m[1]); 
        (new PostController($rb,$mongo,$redis))->show($id); exit;
    }

    // GET /api/posts
    if ($uri === '/api/posts' && $method === 'GET') {
        (new PostController($mongo, $redis))->index();
        exit;
    }

    // POST /api/posts (protected)
    if ($uri === '/api/posts' && $method === 'POST') {
        AuthMiddleware::guard($redis, function($userId) use($mongo,$redis){ 
            (new PostController($mongo,$redis))->create($userId); 
        });
        exit;
    }

    // GET /api/posts/{id}
    if (preg_match('#^/api/posts/([0-9a-fA-F]{24})$#', $uri, $m) && $method === 'GET') {
        $id = $m[1];
        (new PostController($mongo, $redis))->show($id);
        exit;
    }

    // PUT /api/posts/{id} (protected)
    if (preg_match('#^/api/posts/([0-9a-fA-F]{24})$#', $uri, $m) && $method === 'PUT') {
        $id = $m[1];
        AuthMiddleware::guard($redis, function($userId) use($mongo,$redis,$id){ 
            (new PostController($mongo,$redis))->update($userId,$id); 
        });
        exit;
    }

    // DELETE /api/posts/{id} (protected)
    if (preg_match('#^/api/posts/([0-9a-fA-F]{24})$#', $uri, $m) && $method === 'DELETE') {
        $id = $m[1];
        AuthMiddleware::guard($redis, function($userId) use($mongo,$redis,$id){ 
            (new PostController($mongo,$redis))->delete($userId,$id); 
        });
        exit;
    }


    // comments
    if (preg_match('#^/api/posts/(\d+)/comments$#', $uri, $m) && $method === 'POST') {
        $postId = intval($m[1]); 
        AuthMiddleware::guard($redis, function($userId) use($rb,$postId){ (new CommentController($rb))->create($userId,$postId); }); exit;
    }

    // GET /api/posts/{postId}/comments
    if (preg_match('#^/api/posts/(\w+)/comments$#', $uri, $m) && $method === 'GET') {
        $postId = $m[1];
        (new CommentController($mongo))->index($postId);
        exit;
    }

    // PUT /api/comments/{commentId}
    if (preg_match('#^/api/comments/(\w+)$#', $uri, $m) && $method === 'PUT') {
        $commentId = $m[1];
        AuthMiddleware::guard($redis, function($userId) use($rb,$mongo,$commentId){ (new CommentController($rb,$mongo))->update($userId,$commentId); }); exit;
        exit;
    }

    // DELETE /api/comments/{commentId}
    if (preg_match('#^/api/comments/(\w+)$#', $uri, $m) && $method === 'DELETE') {
        $commentId = $m[1];
        AuthMiddleware::guard($redis, function($userId) use($rb,$mongo,$commentId){ (new CommentController($rb,$mongo))->delete($userId,$commentId); }); exit;
        (new CommentController($mongo))->delete($userId, $commentId);
        exit;
    }
    
    // like
    if (preg_match('#^/api/posts/(\d+)/like$#', $uri, $m) && $method === 'POST') {
        $postId = intval($m[1]); 
        AuthMiddleware::guard($redis, function($userId) use($rb,$redis,$postId){ (new LikeController($rb,$redis))->toggle($userId,$postId); }); exit;
    }

    // GET /api/posts/{postId}/likes → list users who liked the post
    if (preg_match('#^/api/posts/(\w+)/likes$#', $uri, $m) && $method === 'GET') {
        $postId = $m[1];
        (new LikeController($mongo, $redis, $rb))->listUsers($postId);
        exit;
    }

    http_response_code(404);
    echo json_encode(["error" => "Not found"]);

?>