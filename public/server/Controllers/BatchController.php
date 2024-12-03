<?php
// controllers/BatchController.php

namespace Controllers;

use Models\Batch;

class BatchController extends BaseController
{
    // Получить все партии текущего пользователя
    public function index()
    {
        $batchModel = new Batch();
        $batches = $batchModel->getAllByUser($this->userId);

        echo json_encode($batches);
    }

    // Создать новую партию
    public function store()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        // Валидация данных
        if (!isset($data['name'], $data['is_blend'], $data['initial_volume'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать имя, is_blend и initial_volume']);
            exit;
        }

        $batchModel = new Batch();

        $batchId = $batchModel->create([
            'user_id' => $this->userId,
            'name' => trim($data['name']),
            'is_blend' => (bool)$data['is_blend'],
            'initial_volume' => (float)$data['initial_volume'],
            'current_volume' => isset($data['current_volume']) ? (float)$data['current_volume'] : (float)$data['initial_volume'],
            'status' => isset($data['status']) ? trim($data['status']) : null,
            'notes' => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        echo json_encode(['message' => 'Партия создана', 'batch_id' => $batchId]);
    }

    // Получить информацию о конкретной партии
    public function show($id)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($id);

        if ($batch && $batch['user_id'] == $this->userId) {
            echo json_encode($batch);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена']);
        }
    }

    // Обновить партию
    public function update($id)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($id);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $updateData = [];
        if (isset($data['name'])) {
            $updateData['name'] = trim($data['name']);
        }
        if (isset($data['is_blend'])) {
            $updateData['is_blend'] = (bool)$data['is_blend'];
        }
        if (isset($data['initial_volume'])) {
            $updateData['initial_volume'] = (float)$data['initial_volume'];
        }
        if (isset($data['current_volume'])) {
            $updateData['current_volume'] = (float)$data['current_volume'];
        }
        if (isset($data['status'])) {
            $updateData['status'] = trim($data['status']);
        }
        if (isset($data['notes'])) {
            $updateData['notes'] = trim($data['notes']);
        }

        $batchModel->update($id, $updateData);

        echo json_encode(['message' => 'Партия обновлена']);
    }

    // Удалить партию
    public function destroy($id)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($id);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена']);
            exit;
        }

        $batchModel->delete($id);

        echo json_encode(['message' => 'Партия удалена']);
    }
}