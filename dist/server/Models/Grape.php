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
        $stmt = $this->db->prepare('
            SELECT g.*, gs.name as sort_name 
            FROM grapes g
            LEFT JOIN grape_sorts gs ON g.grape_sort_id = gs.id
            WHERE g.id = :id
        ');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // Получить все закупки пользователя
    public function getAllByUser($userId)
    {
        $stmt = $this->db->prepare('
            SELECT g.*, gs.name as sort_name 
            FROM grapes g
            LEFT JOIN grape_sorts gs ON g.grape_sort_id = gs.id
            WHERE g.user_id = :user_id 
            ORDER BY g.date_purchased ASC
        ');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Создать новую закупку
    public function create($data)
    {
        try {
            $stmt = $this->db->prepare('
            INSERT INTO grapes (user_id, grape_sort_id, date_purchased, quantity, cost, supplier, notes, created_at)
            VALUES (:user_id, :grape_sort_id, :date_purchased, :quantity, :cost, :supplier, :notes, NOW())
        ');
            $stmt->execute([
                'user_id' => $data['user_id'],
                'grape_sort_id' => $data['grape_sort_id'],
                'date_purchased' => $data['date_purchased'],
                'quantity' => $data['quantity'],
                'cost' => $data['cost'],
                'supplier' => $data['supplier'],
                'notes' => $data['notes'],
            ]);
            return $this->db->lastInsertId();
        } catch (\PDOException $e) {
            error_log('Ошибка при добавлении винограда: ' . $e->getMessage());
            throw new \Exception('Не удалось добавить запись о винограде');
        }
    }

    public function update($id, $data)
    {
        try {
            $fields = [];
            $params = ['id' => $id];

            if (isset($data['grape_sort_id'])) {
                $fields[] = 'grape_sort_id = :grape_sort_id';
                $params['grape_sort_id'] = $data['grape_sort_id'];
            }
            if (isset($data['date_purchased'])) {
                $fields[] = 'date_purchased = :date_purchased';
                $params['date_purchased'] = $data['date_purchased'];
            }
            if (isset($data['quantity'])) {
                $fields[] = 'quantity = :quantity';
                $params['quantity'] = $data['quantity'];
            }
            if (isset($data['cost'])) {
                $fields[] = 'cost = :cost';
                $params['cost'] = $data['cost'];
            }
            if (isset($data['supplier'])) {
                $fields[] = 'supplier = :supplier';
                $params['supplier'] = $data['supplier'];
            }
            if (isset($data['notes'])) {
                $fields[] = 'notes = :notes';
                $params['notes'] = $data['notes'];
            }

            if ($fields) {
                $sql = 'UPDATE grapes SET ' . implode(', ', $fields) . ' WHERE id = :id';
                $stmt = $this->db->prepare($sql);
                $stmt->execute($params);
            }
        } catch (\PDOException $e) {
            // Логируем ошибку и выбрасываем исключение
            error_log('Ошибка при обновлении винограда: ' . $e->getMessage());
            throw new \Exception('Не удалось обновить запись о винограде');
        }
    }

    public function delete($id)
    {
        try {
            $stmt = $this->db->prepare('DELETE FROM grapes WHERE id = :id');
            $stmt->execute(['id' => $id]);
        } catch (\PDOException $e) {
            // Логирование ошибки или выброс собственного исключения
            error_log('Ошибка при удалении винограда: ' . $e->getMessage());
            throw new \Exception('Не удалось удалить запись о винограде');
        }
    }
}