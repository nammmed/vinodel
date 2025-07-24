<?php
namespace Models;

class Supply extends BaseModel {
    public function getAllByUser($userId) {
        $stmt = $this->db->prepare('SELECT * FROM supplies WHERE user_id = :user_id ORDER BY category, name');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $stmt = $this->db->prepare('SELECT * FROM supplies WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->db->prepare('
            INSERT INTO supplies (user_id, name, category, volume_ml, quantity, notes, created_at) 
            VALUES (:user_id, :name, :category, :volume_ml, :quantity, :notes, NOW())
        ');
        $stmt->execute([
            'user_id' => $data['user_id'],
            'name' => $data['name'],
            'category' => $data['category'],
            'volume_ml' => $data['volume_ml'] ?? null,
            'quantity' => $data['quantity'] ?? 0,
            'notes' => $data['notes'] ?? null,
        ]);
        return $this->db->lastInsertId();
    }

    public function updateQuantity($id, $newQuantity) {
        $stmt = $this->db->prepare('UPDATE supplies SET quantity = :quantity WHERE id = :id');
        $stmt->execute(['id' => $id, 'quantity' => $newQuantity]);
    }

    public function findByCategory($userId, $category) {
        $stmt = $this->db->prepare('SELECT * FROM supplies WHERE user_id = :user_id AND category = :category ORDER BY name');
        $stmt->execute(['user_id' => $userId, 'category' => $category]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}