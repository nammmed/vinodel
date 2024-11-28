<?php
// index.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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