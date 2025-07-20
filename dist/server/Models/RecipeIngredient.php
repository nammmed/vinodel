<?php
// models/RecipeIngredient.php

namespace Models;

class RecipeIngredient extends BaseModel
{
    public function create($data)
    {
        $stmt = $this->db->prepare('
            INSERT INTO recipe_ingredients (recipe_id, component_type, component_id, percentage, notes)
            VALUES (:recipe_id, :component_type, :component_id, :percentage, :notes)
        ');
        $stmt->execute([
            'recipe_id' => $data['recipe_id'],
            'component_type' => $data['component_type'],
            'component_id' => $data['component_id'], // В нашем случае это ID исходной партии
            'percentage' => $data['percentage'],
            'notes' => $data['notes'] ?? null,
        ]);
        return $this->db->lastInsertId();
    }
}