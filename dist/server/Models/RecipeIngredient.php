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

    public function getByRecipeId($recipeId)
    {
        $stmt = $this->db->prepare('
            SELECT ri.*, gs.name as grape_sort_name
            FROM recipe_ingredients ri
            JOIN grape_sorts gs ON ri.grape_sort_id = gs.id
            WHERE ri.recipe_id = :recipe_id
        ');
        $stmt->execute(['recipe_id' => $recipeId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

}