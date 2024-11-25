<?php
// controllers/BaseController.php

namespace Controllers;

class BaseController
{
    protected $userId;

    public function __construct()
    {
        // Инициализируем сессию, если она еще не инициализирована
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        // Проверяем, авторизован ли пользователь
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Требуется авторизация']);
            exit;
        }

        // Получаем ID текущего пользователя
        $this->userId = $_SESSION['user_id'];
    }
}