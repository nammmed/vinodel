<?php
// controllers/BatchController.php

namespace Controllers;

use Models\Batch;
use Models\BatchComponent;

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

    public function vinifyGrape($grapeId)
    {
        // Проверяем авторизацию пользователя
        $grapeModel = new \Models\Grape();
        $grape = $grapeModel->findById($grapeId);

        if (!$grape || $grape['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Виноград не найден']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        // Валидация данных
        if ($data['quantity'] > $grape['quantity'] || $data['quantity'] <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Некорректное количество винограда']);
            exit;
        }
        if (!isset($data['juice_volume']) || $data['juice_volume'] <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Укажите корректный объем сока']);
            exit;
        }
        if (!isset($data['vinification_method']) || empty($data['vinification_method'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Укажите метод винификации']);
            exit;
        }

        // Создаем новую партию
        $batchModel = new \Models\Batch();
        $batchData = [
            'user_id' => $this->userId,
            'name' => $data['batch_name'],
            'is_blend' => 0,
            'initial_volume' => $data['juice_volume'],
            'current_volume' => $data['juice_volume'],
            'status' => 'Создана',
            'notes' => $data['notes'],
            // Другие поля при необходимости
        ];

        $batchId = $batchModel->create($batchData);

        // Добавляем запись в batch_components
        $batchComponentModel = new \Models\BatchComponent();
        $batchComponentModel->create([
            'batch_id' => $batchId,
            'component_type' => 'grape',
            'component_id' => $grapeId,
            'operation_type' => 'create',
            'percentage' => 100,
            'volume' => $data['juice_volume'],
            'notes' => null,
        ]);

        // Создаем процесс "Начало винификации" (если еще нет такого процесса)
        $processModel = new \Models\Process();
        $process = $processModel->findByName('Начало винификации');
        if (!$process) {
            $processId = $processModel->create([
                'name' => 'Начало винификации',
                'description' => 'Первичный процесс создания партии из винограда',
            ]);
        } else {
            $processId = $process['id'];
        }

        // Создаем запись в process_logs
        $processLogModel = new \Models\ProcessLog();
        $processLogId = $processLogModel->create([
            'batch_id' => $batchId,
            'process_id' => $processId,
            'start_date' => date('Y-m-d'),
            'notes' => 'Начальная информация о партии',
        ]);

        // Создаем измерения в measurements
        $measurementModel = new \Models\Measurement();

        // Исходное количество винограда
        $measurementModel->create([
            'process_log_id' => $processLogId,
            'date' => date('Y-m-d H:i:s'),
            'type' => 'grape_quantity',
            'value' => $data['quantity'],
            'unit' => 'kg',
            'notes' => null,
        ]);

        // Сахаристость
        if (!empty($data['sugar_content'])) {
            $measurementModel->create([
                'process_log_id' => $processLogId,
                'date' => date('Y-m-d H:i:s'),
                'type' => 'sugar_content',
                'value' => $data['sugar_content'],
                'unit' => 'Brix',
                'notes' => null,
            ]);
        }

        // Кислотность
        if (!empty($data['acidity'])) {
            $measurementModel->create([
                'process_log_id' => $processLogId,
                'date' => date('Y-m-d H:i:s'),
                'type' => 'acidity',
                'value' => $data['acidity'],
                'unit' => 'pH',
                'notes' => null,
            ]);
        }
        // тип дрожжей и способ винификации надо убрать из таблицы измерений куда-то еще, потому что в измерениях только числовые данные
        // пока просто сохранили эти данные не в значении, а в заметках
        // Тип дрожжей
        if (!empty($data['yeast_type']) && trim($data['yeast_type']) != '') {
            $measurementModel->create([
                'process_log_id' => $processLogId,
                'date' => date('Y-m-d H:i:s'),
                'type' => 'yeast_type',
                'value' => 0,
                'unit' => '',
                'notes' => $data['yeast_type'],
            ]);
        }

        // Температура брожения
        if (!empty($data['fermentation_temperature'])) {
            $measurementModel->create([
                'process_log_id' => $processLogId,
                'date' => date('Y-m-d H:i:s'),
                'type' => 'fermentation_temperature',
                'value' => $data['fermentation_temperature'],
                'unit' => '°C',
                'notes' => null,
            ]);
        }

        // Метод винификации
        $measurementModel->create([
            'process_log_id' => $processLogId,
            'date' => date('Y-m-d H:i:s'),
            'type' => 'vinification_method',
            'value' => 0,
            'unit' => '',
            'notes' => $data['vinification_method'],
        ]);

        // Уменьшаем количество винограда
        $newQuantity = $grape['quantity'] - $data['quantity'];
        if ($newQuantity > 0)
            $grapeModel->update($grapeId, ['quantity' => $newQuantity]);
        else
            $grapeModel->delete($grapeId);

        echo json_encode(['message' => 'Партия создана', 'batch_id' => $batchId]);
    }

}