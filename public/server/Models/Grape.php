<?php
// models/Grape.php

namespace Models;

class Grape extends BaseModel
{
    public $id;
    public $user_id;
    public $sort;
    public $date_purchased;
    public $quantity;
    public $cost;
    public $supplier;
    public $notes;
    public $created_at;

    public function __construct()
    {
        parent::__construct();
    }

    // Найти закупку по ID
    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM grapes WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // Получить все закупки пользователя
    public function getAllByUser($userId)
    {
        $stmt = $this->db->prepare('SELECT * FROM grapes WHERE user_id = :user_id');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Создать новую закупку
    public function create($data)
    {
        $stmt = $this->db->prepare('
            INSERT INTO grapes (user_id, sort, date_purchased, quantity, cost, supplier, notes, created_at)
            VALUES (:user_id, :sort, :date_purchased, :quantity, :cost, :supplier, :notes, NOW())
        ');
        $stmt->execute([
            'user_id' => $data['user_id'],
            'sort' => $data['sort'],
            'date_purchased' => $data['date_purchased'],
            'quantity' => $data['quantity'],
            'cost' => $data['cost'],
            'supplier' => $data['supplier'],
            'notes' => $data['notes'],
        ]);
        return $this->db->lastInsertId();
    }
}