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
$uri = preg_replace('/^\/server/', '', $uri);

// Маршруты
$routes = [
    'POST' => [
        '/register' => [UserController::class, 'register'],
        '/login' => [UserController::class, 'login'],
        '/logout' => [UserController::class, 'logout'],

        '/grapes' => [GrapeController::class, 'store'],

        '/batches' => [BatchController::class, 'store'],
        '/batches/blend' => [BatchController::class, 'createBlend'],
        '/batches/(\d+)/components' => [BatchComponentController::class, 'store'],
        '/batches/(\d+)/processes' => [ProcessLogController::class, 'store'],
        '/batches/(\d+)/split' => [BatchController::class, 'split'],

        '/processes' => [ProcessController::class, 'store'],

        '/process-logs/(\d+)/measurements' => [MeasurementController::class, 'store'],

        '/grapes/(\d+)/vinify' => [BatchController::class, 'vinifyGrape'],
    ],
    'GET' => [
        '/check-auth' => [UserController::class, 'checkAuthStatus'],
        '/grapes' => [GrapeController::class, 'index'],
        '/grapes/(\d+)' => [GrapeController::class, 'show'],

        '/batches' => [BatchController::class, 'index'],
        '/batches/(\d+)' => [BatchController::class, 'show'],
        '/batches/(\d+)/components' => [BatchComponentController::class, 'index'],
        '/batches/(\d+)/processes' => [ProcessLogController::class, 'index'],

        '/processes' => [ProcessController::class, 'index'],

        '/process-logs/(\d+)/measurements' => [MeasurementController::class, 'index'],
    ],
    'PUT' => [
        '/grapes/(\d+)' => [GrapeController::class, 'update'],
        '/batches/(\d+)' => [BatchController::class, 'update'],
        '/processes/(\d+)' => [ProcessController::class, 'update'],
    ],
    'DELETE' => [
        '/grapes/(\d+)' => [GrapeController::class, 'destroy'],
        '/batches/(\d+)' => [BatchController::class, 'destroy'],
        '/batches/(\d+)/components/(\d+)' => [BatchComponentController::class, 'destroy'],
        '/processes/(\d+)' => [ProcessController::class, 'destroy'],
        '/batches/(\d+)/processes/(\d+)' => [ProcessLogController::class, 'destroy'],
        '/process-logs/(\d+)/measurements/(\d+)' => [MeasurementController::class, 'destroy'],
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