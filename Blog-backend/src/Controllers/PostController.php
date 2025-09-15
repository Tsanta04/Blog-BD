<?php
    namespace App\Controllers;

    use App\Utils\Response;

    class PostController {
        private $rb; private $mongo; private $redis;

        public function __construct($rb, $mongo, $redis){ $this->rb=$rb; $this->mongo=$mongo; $this->redis=$redis; }

        private function body(){ 
            return json_decode(file_get_contents('php://input'), true); 
        }

        // GET /api/posts
        public function index(){
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
            $posts = R::findAll('post', ' ORDER BY created_at DESC LIMIT ? ', [$limit]);
            $result = [];
            
            foreach ($posts as $p){
                $meta = $this->mongo->selectCollection('post_metadata')->findOne(['post_id' => intval($p->id)]);
                $views = $this->redis->get('post:'.$p->id.':views') ?? ($meta['views']['today'] ?? 0);
                $result[] = ['id'=>$p->id,'title'=>$p->title,'excerpt'=>mb_substr($p->content,0,200),'user_id'=>$p->user_id,'created_at'=>$p->created_at,'views'=>intval($views)];
            }

            Response::json(['data'=>$result]);
        }

        // POST /api/posts (protected)
        public function create($userId){
            $b = $this->body(); 

            if (empty($b['title']) || empty($b['content'])) 
                return Response::json(['error'=>'Missing fields'],400);

            $post = R::dispense('post'); $post->title = $b['title']; $post->content=$b['content']; $post->user_id=$userId; $post->created_at = date('c');
            $id = R::store($post);

            // save tags & metadata in mongo
            $meta = ['post_id'=>intval($id),'tags'=>$b['tags'] ?? [], 'views'=>['today'=>0],'updated_at'=>new \MongoDB\BSON\UTCDateTime((new \DateTime())->getTimestamp()*1000)];
            $this->mongo->selectCollection('post_metadata')->insertOne($meta);

            Response::json(['message'=>'created','id'=>$id],201);
        }


        // GET /api/posts/{id}
        public function show($id){
            $p = R::load('post', $id); if (!$p->id) return Response::json(['error'=>'Not found'],404);

            // increment view counter in Redis
            $this->redis->incr('post:'.$id.':views');
            $meta = $this->mongo->selectCollection('post_metadata')->findOne(['post_id'=>intval($id)]);

            // comments
            $comments = R::find('comment', ' post_id = ? ORDER BY created_at DESC ', [$id]);
            $cdata = [];
            foreach ($comments as $c){
                $cdata[]=['id'=>$c->id,'content'=>$c->content,'user_id'=>$c->user_id,'created_at'=>$c->created_at]; 
            }

            Response::json(['post'=>['id'=>$p->id,'title'=>$p->title,'content'=>$p->content,'created_at'=>$p->created_at,'user_id'=>$p->user_id,'tags'=>$meta['tags'] ?? [],'views'=>intval($this->redis->get('post:'.$id.':views') ?? 0),'comments'=>$cdata]]);
        }
    }

?>