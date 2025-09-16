<?php
namespace App\Controllers;

use App\Utils\Response;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

class PostController {
    private $mongo;
    private $redis;

    public function __construct($mongo, $redis){
        $this->mongo = $mongo;
        $this->redis = $redis;
    }

    private function body(){ 
        return json_decode(file_get_contents('php://input'), true); 
    }

    // GET /api/posts
    public function index(){
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
        $postsCursor = $this->mongo->posts->find([], [
            'sort' => ['metadata.created_at' => -1],
            'limit' => $limit
        ]);

        $result = [];
        foreach ($postsCursor as $p){
            $postId = (string)$p->_id;
            $views = $this->redis->exists('post:' . $postId . ':views') 
                        ? intval($this->redis->get('post:' . $postId . ':views')) 
                        : (isset($p->metadata['views']['today']) ? intval($p->metadata['views']['today']) : 0);

            $result[] = [
                'id' => $postId,
                'title' => $p->title,
                'excerpt' => mb_substr($p->content, 0, 200),
                'user_id' => $p->user_id,
                'created_at' => isset($p->metadata['created_at']) ? $p->metadata['created_at']->toDateTime()->format('c') : null,
                'views' => $views,
                'tags' => isset($p->metadata['tags']) ? $p->metadata['tags'] : [],
                'media' => isset($p->media) ? $p->media : []
            ];
        }

        Response::json(['data' => $result]);
    }

    // POST /api/posts (protected)
    public function create($userId){
        $b = $this->body(); 

        if (empty($b['title']) || empty($b['content'])) 
            return Response::json(['error'=>'Missing fields'], 400);

        $postData = [
            'user_id' => new ObjectId($userId),
            'title' => $b['title'],
            'content' => $b['content'],
            'metadata' => [
                'tags' => (isset($b['tags']) && is_array($b['tags'])) ? $b['tags'] : [],
                'views' => ['today'=>0, 'week'=>0, 'month'=>0, 'total'=>0, 'country'=>[]],
                'created_at' => new UTCDateTime(),
                'updated_at' => new UTCDateTime(),
            ],
            'media' => (isset($b['media']) && is_array($b['media'])) ? $b['media'] : []
        ];

        $insertResult = $this->mongo->posts->insertOne($postData);
        $postId = (string)$insertResult->getInsertedId();

        // initialiser compteur de vues dans Redis
        $this->redis->set('post:' . $postId . ':views', 0);

        Response::json(['message'=>'created', 'id' => $postId], 201);
    }

    // GET /api/posts/{id}
    public function show($id){
        try {
            $postObjId = new ObjectId($id);
        } catch (\Exception $e) {
            return Response::json(['error'=>'Invalid post id'], 400);
        }

        $p = $this->mongo->posts->findOne(['_id' => $postObjId]);
        if (!$p) return Response::json(['error'=>'Not found'], 404);

        // increment view counter in Redis
        $this->redis->incr('post:' . $id . ':views');
        $views = intval($this->redis->get('post:' . $id . ':views') ?: 0);

        // comments
        $commentsCursor = $this->mongo->comments->find(['post_id' => $postObjId]);
        $cdata = [];
        foreach ($commentsCursor as $c){
            $cdata[] = [
                'id' => (string)$c->_id,
                'content' => $c->content,
                'user_id' => (string)$c->user_id,
                'created_at' => $c->created_at->toDateTime()->format('c')
            ];
        }

        Response::json([
            'post' => [
                'id' => $id,
                'title' => $p->title,
                'content' => $p->content,
                'created_at' => isset($p->metadata['created_at']) ? $p->metadata['created_at']->toDateTime()->format('c') : null,
                'updated_at' => isset($p->metadata['updated_at']) ? $p->metadata['updated_at']->toDateTime()->format('c') : null,
                'user_id' => $p->user_id,
                'tags' => isset($p->metadata['tags']) ? $p->metadata['tags'] : [],
                'views' => $views,
                'media' => isset($p->media) ? $p->media : [],
                'comments' => $cdata
            ]
        ]);
    }

    // PUT /api/posts/{id} (protected)
    public function update($userId, $id){
        try {
            $postObjId = new ObjectId($id);
        } catch (\Exception $e) {
            return Response::json(['error'=>'Invalid post id'], 400);
        }

        $post = $this->mongo->posts->findOne(['_id' => $postObjId]);
        if (!$post) return Response::json(['error'=>'Post not found'], 404);
        if ((string)$post->user_id !== (string)$userId) return Response::json(['error'=>'Forbidden'], 403);

        $b = $this->body();
        $updateData = [];

        if (!empty($b['title'])) $updateData['title'] = $b['title'];
        if (!empty($b['content'])) $updateData['content'] = $b['content'];
        if (isset($b['tags']) && is_array($b['tags'])) $updateData['metadata.tags'] = $b['tags'];
        if (isset($b['media']) && is_array($b['media'])) $updateData['media'] = $b['media'];
        if (!empty($updateData)) $updateData['metadata.updated_at'] = new UTCDateTime();

        if (!empty($updateData)) {
            $this->mongo->posts->updateOne(
                ['_id' => $postObjId],
                ['$set' => $updateData]
            );
        }

        Response::json(['message'=>'Post updated']);
    }


    // DELETE /api/posts/{id} (protected)
    public function delete($userId, $id){
        try {
            $postObjId = new ObjectId($id);
        } catch (\Exception $e) {
            return Response::json(['error'=>'Invalid post id'], 400);
        }

        $post = $this->mongo->posts->findOne(['_id' => $postObjId]);
        if (!$post) return Response::json(['error'=>'Post not found'], 404);

        if ($post->user_id != $userId) return Response::json(['error'=>'Forbidden'], 403);

        // Supprimer tous
        $this->mongo->posts->deleteOne(['_id' => $postObjId]);
        $this->mongo->comments->deleteMany(['post_id' => $id]);
        $this->mongo->likes->deleteMany(['post_id' => $id]);

        // Supprimer les compteurs Redis
        $this->redis->del('post:' . $id . ':views');
        $this->redis->del('post:' . $id . ':likes');

        Response::json(['message'=>'Post deleted']);
    }
    
}
?>
