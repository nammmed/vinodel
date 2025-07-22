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

    /**
     * Получить все рецепты пользователя.
     */
    public function getAllByUser($userId)
    {
        $stmt = $this->db->prepare('SELECT * FROM recipes WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Получить один рецепт вместе с его ингредиентами.
     * Проверяет принадлежность рецепта пользователю.
     */
    public function getWithIngredients($recipeId, $userId)
    {
        // Сначала получаем сам рецепт и проверяем владельца
        $stmt = $this->db->prepare('SELECT * FROM recipes WHERE id = :id AND user_id = :user_id');
        $stmt->execute(['id' => $recipeId, 'user_id' => $userId]);
        $recipe = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$recipe) {
            return null; // Рецепт не найден или не принадлежит пользователю
        }

        // Если рецепт найден, получаем его ингредиенты
        $ingredientModel = new RecipeIngredient();
        $recipe['ingredients'] = $ingredientModel->getByRecipeId($recipeId);

        return $recipe;
    }

}