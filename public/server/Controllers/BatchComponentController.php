<?php
// controllers/BatchComponentController.php

namespace Controllers;

use Models\Batch;
use Models\BatchComponent;

class BatchComponentController extends BaseController
{
    // Получить компоненты для партии
    public function index($batchId)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($batchId);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена']);
            exit;
        }

        $componentModel = new BatchComponent();
        $components = $componentModel->getComponentsByBatch($batchId);

        echo json_encode($components);
    }

    // Добавить компонент к партии
    public function store($batchId)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($batchId);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        // Валидация данных
        if (!isset($data['component_type'], $data['component_id'], $data['percentage'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать component_type, component_id и percentage']);
            exit;
        }

        $componentType = $data['component_type'];
        $componentId = (int)$data['component_id'];
        $percentage = (float)$data['percentage'];
        $volume = isset($data['volume']) ? (float)$data['volume'] : null;
        $notes = isset($data['notes']) ? trim($data['notes']) : null;

        // Проверка корректности component_type
        if (!in_array($componentType, ['grape', 'batch'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Некорректный component_type']);
            exit;
        }

        // Проверка существования component_id
        if ($componentType == 'grape') {
            // Проверяем, принадлежит ли закупка текущему пользователю
            $grapeModel = new \Models\Grape();
            $grape = $grapeModel->findById($componentId);

            if (!$grape || $grape['user_id'] != $this->userId) {
                http_response_code(400);
                echo json_encode(['error' => 'Закупка не найдена']);
                exit;
            }
        } elseif ($componentType == 'batch') {
            // Проверяем, принадлежит ли партия текущему пользователю
            $componentBatch = $batchModel->findById($componentId);

            if (!$componentBatch || $componentBatch['user_id'] != $this->userId) {
                http_response_code(400);
                echo json_encode(['error' => 'Компонентная партия не найдена']);
                exit;
            }
        }

        $componentModel = new BatchComponent();

        $componentModel->create([
            'batch_id' => $batchId,
            'component_type' => $componentType,
            'component_id' => $componentId,
            'percentage' => $percentage,
            'volume' => $volume,
            'notes' => $notes,
        ]);

        echo json_encode(['message' => 'Компонент добавлен']);
    }

    // Удалить компонент из партии
    public function destroy($batchId, $componentId)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($batchId);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена']);
            exit;
        }

        $componentModel = new BatchComponent();
        $component = $componentModel->findById($componentId);

        if (!$component || $component['batch_id'] != $batchId) {
            http_response_code(404);
            echo json_encode(['error' => 'Компонент не найден']);
            exit;
        }

        $componentModel->delete($componentId);

        echo json_encode(['message' => 'Компонент удален']);
    }
}