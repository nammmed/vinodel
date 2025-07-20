<?php
// controllers/MeasurementController.php

namespace Controllers;

use Models\Batch;
use Models\ProcessLog;
use Models\Measurement;

class MeasurementController extends BaseController
{
    // Получить замеры для лога процесса
    public function index($processLogId)
    {
        $processLogModel = new ProcessLog();
        $log = $processLogModel->findById($processLogId);

        if (!$log) {
            http_response_code(404);
            echo json_encode(['error' => 'Лог процесса не найден']);
            exit;
        }

        // Проверяем принадлежность партии
        $batchModel = new Batch();
        $batch = $batchModel->findById($log['batch_id']);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(403);
            echo json_encode(['error' => 'Нет доступа к этим данным']);
            exit;
        }

        $measurementModel = new Measurement();
        $measurements = $measurementModel->getMeasurementsByProcessLog($processLogId);

        echo json_encode($measurements);
    }

    // Добавить замер к логу процесса
    public function store($processLogId)
    {
        $processLogModel = new ProcessLog();
        $log = $processLogModel->findById($processLogId);

        if (!$log) {
            http_response_code(404);
            echo json_encode(['error' => 'Лог процесса не найден']);
            exit;
        }

        // Проверяем принадлежность партии
        $batchModel = new Batch();
        $batch = $batchModel->findById($log['batch_id']);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(403);
            echo json_encode(['error' => 'Нет доступа к этим данным']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        // Валидация данных
        if (!isset($data['date'], $data['type'], $data['value'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать date, type и value']);
            exit;
        }

        $measurementModel = new Measurement();

        $measurementId = $measurementModel->create([
            'process_log_id' => $processLogId,
            'date' => $data['date'],
            'type' => trim($data['type']),
            'value' => (float)$data['value'],
            'unit' => isset($data['unit']) ? trim($data['unit']) : null,
            'notes' => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        echo json_encode(['message' => 'Замер добавлен', 'measurement_id' => $measurementId]);
    }

    // Удалить замер
    public function destroy($processLogId, $measurementId)
    {
        $processLogModel = new ProcessLog();
        $log = $processLogModel->findById($processLogId);

        if (!$log) {
            http_response_code(404);
            echo json_encode(['error' => 'Лог процесса не найден']);
            exit;
        }

        // Проверяем принадлежность партии
        $batchModel = new Batch();
        $batch = $batchModel->findById($log['batch_id']);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(403);
            echo json_encode(['error' => 'Нет доступа к этим данным']);
            exit;
        }

        $measurementModel = new Measurement();
        $measurement = $measurementModel->findById($measurementId);

        if (!$measurement || $measurement['process_log_id'] != $processLogId) {
            http_response_code(404);
            echo json_encode(['error' => 'Замер не найден']);
            exit;
        }

        $measurementModel->delete($measurementId);

        echo json_encode(['message' => 'Замер удален']);
    }
}