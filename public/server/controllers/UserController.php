<?php
// controllers/UserController.php

namespace Controllers;

use Models\User;

class UserController
{
    // Регистрация нового пользователя
    public function register()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        // Валидация данных
        if (!isset($data['name'], $data['email'], $data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать имя, email и пароль']);
            exit;
        }

        $name = trim($data['name']);
        $email = trim($data['email']);
        $password = $data['password'];

        // Проверка валидности email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Некорректный email']);
            exit;
        }

        // Проверка длины пароля
        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['error' => 'Пароль должен содержать не менее 6 символов']);
            exit;
        }

        $userModel = new User();

        // Проверяем, существует ли пользователь с таким email
        if ($userModel->findByEmail($email)) {
            http_response_code(400);
            echo json_encode(['error' => 'Пользователь с таким email уже существует']);
            exit;
        }

        // Хешируем пароль
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Создаем пользователя
        $userId = $userModel->create([
            'name' => $name,
            'email' => $email,
            'password' => $hashedPassword,
        ]);

        // Авторизуем пользователя
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $userId;

        // Возвращаем успешный ответ
        echo json_encode(['message' => 'Регистрация успешна', 'user_id' => $userId]);
    }

    // Вход пользователя
    public function login()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $userModel = new User();
        $user = $userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Неверный email или пароль']);
            exit;
        }

        // Успешная авторизация
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $user['id'];

        echo json_encode(['message' => 'Вход выполнен', 'user_id' => $user['id']]);
    }

    // Выход пользователя
    public function logout()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        session_destroy();

        echo json_encode(['message' => 'Вы вышли из системы']);
    }
}