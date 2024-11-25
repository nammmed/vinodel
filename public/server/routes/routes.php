<?php

use Controllers\UserController;
use Controllers\GrapeController;
use Controllers\BatchController;
use Controllers\BatchComponentController;
use Controllers\ProcessController;
use Controllers\ProcessLogController;
use Controllers\MeasurementController;

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Убираем параметры из URI
$uri = parse_url($requestUri, PHP_URL_PATH);

// Маршруты
$routes = [
    'POST' => [
        '/register' => [UserController::class, 'register'],
        '/login' => [UserController::class, 'login'],
        '/logout' => [UserController::class, 'logout'],

        '/grapes' => [GrapeController::class, 'store'],

        '/batches' => [BatchController::class, 'store'],
        '/batches/(\d+)/components' => [BatchComponentController::class, 'store'],
        '/batches/(\d+)/processes' => [ProcessLogController::class, 'store'],

        '/processes' => [ProcessController::class, 'store'],

        '/process-logs/(\d+)/measurements' => [MeasurementController::class, 'store'],

        // Добавьте другие POST-маршруты
    ],
    'GET' => [
        '/grapes' => [GrapeController::class, 'index'],
        '/grapes/(\d+)' => [GrapeController::class, 'show'],

        '/batches' => [BatchController::class, 'index'],
        '/batches/(\d+)' => [BatchController::class, 'show'],
        '/batches/(\d+)/components' => [BatchComponentController::class, 'index'],
        '/batches/(\d+)/processes' => [ProcessLogController::class, 'index'],

        '/processes' => [ProcessController::class, 'index'],

        '/process-logs/(\d+)/measurements' => [MeasurementController::class, 'index'],

        // Добавьте другие GET-маршруты
    ],
    'PUT' => [
        '/grapes/(\d+)' => [GrapeController::class, 'update'],
        '/batches/(\d+)' => [BatchController::class, 'update'],
        '/processes/(\d+)' => [ProcessController::class, 'update'],
        // Добавьте другие PUT-маршруты
    ],
    'DELETE' => [
        '/grapes/(\d+)' => [GrapeController::class, 'destroy'],
        '/batches/(\d+)' => [BatchController::class, 'destroy'],
        '/batches/(\d+)/components/(\d+)' => [BatchComponentController::class, 'destroy'],
        '/processes/(\d+)' => [ProcessController::class, 'destroy'],
        '/batches/(\d+)/processes/(\d+)' => [ProcessLogController::class, 'destroy'],
        '/process-logs/(\d+)/measurements/(\d+)' => [MeasurementController::class, 'destroy'],
        // Добавьте другие DELETE-маршруты
    ],
];

// Простая реализация маршрутизатора
$found = false;
foreach ($routes[$requestMethod] as $routePattern => $handler) {
    $pattern = '@^' . $routePattern . '$@';
    if (preg_match($pattern, $uri, $matches)) {
        array_shift($matches); // Убираем полное совпадение
        $controller = new $handler[0]();
        call_user_func_array([$controller, $handler[1]], $matches);
        $found = true;
        break;
    }
}

if (!$found) {
    http_response_code(404);
    echo json_encode(['error' => 'Маршрут не найден']);
}