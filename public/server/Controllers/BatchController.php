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

        try {
            $this->db->beginTransaction();

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

            $this->db->commit(); // Фиксация транзакции (все изменения сохраняются)

            echo json_encode(['message' => 'Партия создана', 'batch_id' => $batchId]);
        } catch (\Exception $e) {
            $this->db->rollBack(); // Откат транзакции (все изменения отменяются)
            error_log("Ошибка при винификации винограда: " . $e->getMessage()); // Логирование ошибки
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка при винификации винограда.']); // Общее сообщение об ошибке
        }

    }

    public function split($batchId)
    {
        $batchModel = new Batch();
        $batch = $batchModel->findById($batchId);

        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Партия не найдена или у вас нет доступа к ней.']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $newBatches = $data['newBatches'];

        // Валидация данных
        $errors = [];
        if (empty($newBatches) || !is_array($newBatches)) {
            $errors[] = 'Необходимо передать массив новых партий.';
        }

        $totalNewVolume = 0;
        foreach ($newBatches as $newBatch) {
            if (!isset($newBatch['name']) || empty(trim($newBatch['name']))) {
                $errors[] = 'Название партии не может быть пустым.';
            }
            if (!isset($newBatch['volume']) || !is_numeric($newBatch['volume']) || $newBatch['volume'] <= 0) {
                $errors[] = 'Объем партии должен быть числом больше нуля.';
            }
            $totalNewVolume += $newBatch['volume'];
        }

        if ($totalNewVolume > $batch['current_volume']) {
            $errors[] = 'Суммарный объем новых партий превышает текущий объем исходной партии.';
        }

        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            exit;
        }

        $batchComponentModel = new BatchComponent();
        $processModel = new \Models\Process();
        $processLogModel = new \Models\ProcessLog();

        try {
            $this->db->beginTransaction();

            $createdBatches = [];

            foreach ($newBatches as $newBatchData) {
                $newBatchId = $batchModel->create([
                    'user_id' => $this->userId,
                    'name' => $newBatchData['name'],
                    'is_blend' => $batch['is_blend'],
                    'initial_volume' => $newBatchData['volume'],
                    'current_volume' => $newBatchData['volume'],
                    'status' => $batch['status'],
                    'notes' => $newBatchData['notes'],
                    'recipe_id' => $batch['recipe_id'],
                ]);

                $batchComponentModel->create([
                    'batch_id' => $newBatchId,
                    'component_type' => 'batch',
                    'operation_type' => 'split',
                    'component_id' => $batchId,
                    'percentage' => ($newBatchData['volume'] / $batch['current_volume']) * 100,
                    'volume' => $newBatchData['volume'],
                    'notes' => null,
                ]);

                $createdBatches[] = $newBatchId;
            }

            // Определение типа процесса
            $processName = isset($data['processType']) ? $data['processType'] : null;
            if ($processName === 'Другое' && isset($data['customProcessType'])) {
                $processName = $data['customProcessType'];
            } elseif ($processName === null) {
                $percentage = ($totalNewVolume / $batch['initial_volume']) * 100;
                if ($percentage <= 20) {
                    $processName = "Отбор пробы ($totalNewVolume л)";
                } elseif ($percentage >= 80) {
                    $processName = "Разделение партии";
                } else {
                    $processName = "Отделение части партии ($totalNewVolume л)";
                }
            }

            $notes = $processName . " для партии {$batch['name']}";

            // Получаем (или создаем) процесс
            $process = $processModel->findByName($processName);
            $processId = $process ? $process['id'] : $processModel->create(['name' => $processName, 'description' => $processName]);

            foreach ($createdBatches as $newBatchId) {
                $this->createProcessLog($newBatchId, $processId, null);
            }
            $this->createProcessLog($batchId, $processId, $notes);

            // Запись в batch_components для исходной партии
            $batchComponentModel->create([
                'batch_id' => $batchId,
                'component_type' => 'batch',
                'operation_type' => 'split',
                'component_id' => $batchId,
                'percentage' => 100,
                'volume' => $batch['current_volume'] - $totalNewVolume,
                'notes' => 'Объем уменьшен после разделения',
            ]);

            $batchModel->update($batchId, ['current_volume' => $batch['current_volume'] - $totalNewVolume]);

            $this->db->commit();
            echo json_encode(['message' => 'Партия успешно разделена.']);

        } catch (\Exception $e) {
            $this->db->rollBack();
            error_log("Ошибка при разделении партии: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка при разделении партии.']);
        }
    }

    private function createProcessLog($batchId, $processId, $notes) {
        $processLogModel = new \Models\ProcessLog();
        $processLogModel->create([
            'batch_id' => $batchId,
            'process_id' => $processId,
            'start_date' => date('Y-m-d'),
            'notes' => $notes,
        ]);
    }

}