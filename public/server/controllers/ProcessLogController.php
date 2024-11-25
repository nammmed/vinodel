<?php
// controllers/ProcessLogController.php

namespace Controllers;

use Models\Batch;
use Models\ProcessLog;

class ProcessLogController extends BaseController
{
    // Получить логи процессов для партии
    public function index($batchId)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($batchId);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена']);
            exit;
        }

        $processLogModel = new ProcessLog();
        $logs = $processLogModel->getLogsByBatch($batchId);

        echo json_encode($logs);
    }

    // Добавить лог процесса к партии
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
        if (!isset($data['process_id'], $data['start_date'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать process_id и start_date']);
            exit;
        }

        $processLogModel = new ProcessLog();

        $processLogId = $processLogModel->create([
            'batch_id' => $batchId,
            'process_id' => (int)$data['process_id'],
            'start_date' => $data['start_date'],
            'end_date' => isset($data['end_date']) ? $data['end_date'] : null,
            'notes' => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        echo json_encode(['message' => 'Лог процесса добавлен', 'process_log_id' => $processLogId]);
    }

    // Удалить лог процесса
    public function destroy($batchId, $logId)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($batchId);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена']);
            exit;
        }

        $processLogModel = new ProcessLog();
        $log = $processLogModel->findById($logId);

        if (!$log || $log['batch_id'] != $batchId) {
            http_response_code(404);
            echo json_encode(['error' => 'Лог процесса не найден']);
            exit;
        }

        $processLogModel->delete($logId);

        echo json_encode(['message' => 'Лог процесса удален']);
    }
}