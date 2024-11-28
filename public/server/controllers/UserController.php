<?php
// controllers/UserController.php

namespace Controllers;

use Models\User;

class UserController
{
    public function checkAuth() {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }
        return $_SESSION['user_id'];
    }

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

        session_start();
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $data['email'];

        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $userId,
                'email' => $data['email'],
                'name' => $data['name']
            ]
        ]);
    }

    // Вход пользователя
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);

        $userModel = new User();
        $user = $userModel->findByEmail($data['email']);

        if (!$user || !password_verify($data['password'], $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Неверный email или пароль']);
            return;
        }

        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];

        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name']
            ]
        ]);
    }

    // Выход пользователя
    public function logout() {
        session_start();
        session_destroy();
        echo json_encode(['success' => true]);
    }
}