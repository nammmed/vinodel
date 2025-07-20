<?php
// models/Recipe.php

namespace Models;

class Recipe extends BaseModel
{
    public function create($data)
    {
        $stmt = $this->db->prepare('
            INSERT INTO recipes (user_id, name, description, is_blend, created_at)
            VALUES (:user_id, :name, :description, :is_blend, NOW())
        ');
        $stmt->execute([
            'user_id' => $data['user_id'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'is_blend' => 1, // Рецепт - это всегда для купажа
        ]);
        return $this->db->lastInsertId();
    }
}