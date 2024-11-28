<?php
// index.php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/config.php';

// Подключение автозагрузки, если вы настроили ее, или вручную подключите нужные файлы
require_once 'models/BaseModel.php';
require_once 'models/User.php';
require_once 'controllers/UserController.php';
require_once 'controllers/BaseController.php';
require_once 'controllers/BatchController.php';
require_once 'models/Batch.php';
// Подключите остальные модели и контроллеры по мере необходимости

require_once 'routes/routes.php';