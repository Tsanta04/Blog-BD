<?php
    use Predis\Client as PredisClient;
    use RedBeanPHP\R; 
    // use MongoDB\Client as MongoClient;

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED);
    ini_set('display_errors', '0'); 

    // RedBean (Postgres)
    R::setup(
        sprintf('%s:host=%s;port=%s;dbname=%s', $_ENV['DB_DRIVER'], $_ENV['DB_HOST'], $_ENV['DB_PORT'], $_ENV['DB_NAME']),
        $_ENV['DB_USER'],
        $_ENV['DB_PASS']
    );
    R::ext('xdispense', function($type){ return R::dispense($type); });
    $rb = R::getRedBean(); 

    // Predis
    $redis = new PredisClient([
        'scheme' => 'tcp',
        'host' => isset($_ENV['REDIS_HOST']) ? $_ENV['REDIS_HOST'] : '127.0.0.1',
        'port' => isset($_ENV['REDIS_PORT']) ? $_ENV['REDIS_PORT'] : 6379,
    ]);

    header('Content-Type: application/json; charset=utf-8');

?>