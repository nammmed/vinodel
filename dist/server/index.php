<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Убедитесь, что сессии работают с CORS
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'vinodel.prostoweb.su', // Замените на ваш домен
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);

// Подключаем конфигурацию
require_once __DIR__ . '/config/config.php';

// Подключаем автозагрузчик
require_once __DIR__ . '/autoload.php';

// Подключаем маршруты
require_once __DIR__ . '/routes/routes.php';
