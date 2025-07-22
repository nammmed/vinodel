<?php
// controllers/RecipeController.php

namespace Controllers;

use Models\Batch;
use Models\Recipe;

class RecipeController extends BaseController
{
    /**
     * Получить список всех рецептов текущего пользователя.
     */
    public function index()
    {
        $recipeModel = new Recipe();
        $recipes = $recipeModel->getAllByUser($this->userId);

        echo json_encode($recipes);
    }

    /**
     * Получить детальную информацию о конкретном рецепте, включая его ингредиенты.
     */
    public function show($id)
    {
        $recipeModel = new Recipe();
        $recipe = $recipeModel->getWithIngredients($id, $this->userId);

        if ($recipe) {
            echo json_encode($recipe);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Рецепт не найден или у вас нет к нему доступа.']);
        }
    }

    public function getAssemblyPlan($id)
    {
        // 1. Получаем данные из запроса (желаемый объем)
        $data = json_decode(file_get_contents('php://input'), true);
        $targetVolume = $data['targetVolume'] ?? null;

        if (!$targetVolume || !is_numeric($targetVolume) || $targetVolume <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать корректный желаемый объем.']);
            exit;
        }

        // 2. Получаем рецепт с ингредиентами
        $recipeModel = new Recipe();
        $recipe = $recipeModel->getWithIngredients($id, $this->userId);

        if (!$recipe) {
            http_response_code(404);
            echo json_encode(['error' => 'Рецепт не найден.']);
            exit;
        }

        $batchModel = new Batch();
        $assemblyPlan = [
            'recipe_name' => $recipe['name'],
            'target_volume' => $targetVolume,
            'required_ingredients' => [],
        ];
        $isPossible = true;

        // 3. Ищем источники для каждого ингредиента
        foreach ($recipe['ingredients'] as $ingredient) {
            $requiredVolume = $targetVolume * ($ingredient['percentage'] / 100);
            $grapeSort = $ingredient['grape_sort'];

            // Ищем все моносортовые партии данного сорта у пользователя
            $sourceBatches = $batchModel->findMonoSortBatches($grapeSort, $this->userId);

            // Считаем общий доступный объем этого сорта
            $totalAvailableVolume = array_reduce($sourceBatches, function($sum, $batch) {
                return $sum + $batch['current_volume'];
            }, 0);

            if ($totalAvailableVolume < $requiredVolume) {
                $isPossible = false; // Отмечаем, что сборка невозможна
            }

            $assemblyPlan['required_ingredients'][] = [
                'grape_sort' => $grapeSort,
                'required_volume' => $requiredVolume,
                'total_available' => $totalAvailableVolume,
                'sources' => $sourceBatches // Список возможных партий-источников
            ];
        }

        $assemblyPlan['is_possible'] = $isPossible;

        echo json_encode($assemblyPlan);
    }

}