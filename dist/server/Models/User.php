<?php
// models/User.php

namespace Models;

class User extends BaseModel
{
    public $id;
    public $name;
    public $email;
    public $password;
    public $created_at;

    public function __construct()
    {
        parent::__construct();
    }

    // Найти пользователя по ID
    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // Найти пользователя по email
    public function findByEmail($email)
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // Создать нового пользователя
    public function create($data)
    {
        $stmt = $this->db->prepare('INSERT INTO users (name, email, password, created_at) VALUES (:name, :email, :password, NOW())');
        $stmt->execute([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'], // Пароль должен быть захеширован
        ]);
        return $this->db->lastInsertId();
    }
}