<?php
// controllers/ProcessController.php

namespace Controllers;

use Models\Process;

class ProcessController extends BaseController
{
    // Получить список всех процессов
    public function index()
    {
        $processModel = new Process();
        $processes = $processModel->getAll();

        echo json_encode($processes);
    }

    // Создать новый процесс
    public function store()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        // Валидация данных
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать имя процесса']);
            exit;
        }

        $processModel = new Process();

        $processId = $processModel->create([
            'name' => trim($data['name']),
            'description' => isset($data['description']) ? trim($data['description']) : null,
        ]);

        echo json_encode(['message' => 'Процесс создан', 'process_id' => $processId]);
    }

    // Обновить процесс
    public function update($id)
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $processModel = new Process();
        $process = $processModel->findById($id);

        if (!$process) {
            http_response_code(404);
            echo json_encode(['error' => 'Процесс не найден']);
            exit;
        }

        $updateData = [];
        if (isset($data['name'])) {
            $updateData['name'] = trim($data['name']);
        }
        if (isset($data['description'])) {
            $updateData['description'] = trim($data['description']);
        }

        $processModel->update($id, $updateData);

        echo json_encode(['message' => 'Процесс обновлен']);
    }

    // Удалить процесс
    public function destroy($id)
    {
        $processModel = new Process();
        $process = $processModel->findById($id);

        if (!$process) {
            http_response_code(404);
            echo json_encode(['error' => 'Процесс не найден']);
            exit;
        }

        $processModel->delete($id);

        echo json_encode(['message' => 'Процесс удален']);
    }
}