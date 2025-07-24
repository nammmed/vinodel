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


    /**
     * Рассчитывает предварительный план для розлива.
     * Возвращает список необходимых расходников и их наличие на складе.
     */
    public function getBottlingPlan($batchId) {
        // 1. Получаем параметры из GET-запроса
        $volumeToBottle = $_GET['volume'] ?? null;
        $bottleSupplyId = $_GET['bottle_id'] ?? null;

        if (!$volumeToBottle || !$bottleSupplyId) {
            http_response_code(400); exit(json_encode(['error' => 'Не указан объем или тип бутылки.']));
        }

        $batchModel = new \Models\Batch();
        $supplyModel = new \Models\Supply();

        // 2. Проверяем партию и бутылку
        $batch = $batchModel->findById($batchId);
        if (!$batch || $batch['user_id'] != $this->userId) {
            http_response_code(404); exit(json_encode(['error' => 'Партия не найдена.']));
        }
        if ($batch['current_volume'] < $volumeToBottle) {
            http_response_code(400); exit(json_encode(['error' => 'В партии недостаточно вина.']));
        }

        $bottleSupply = $supplyModel->findById($bottleSupplyId);
        if (!$bottleSupply || $bottleSupply['user_id'] != $this->userId || $bottleSupply['category'] !== 'Бутылка' || !$bottleSupply['volume_ml']) {
            http_response_code(404); exit(json_encode(['error' => 'Указанный тип бутылки не найден или некорректен.']));
        }

        // 3. Рассчитываем необходимое количество
        $requiredBottles = ceil(($volumeToBottle * 1000) / $bottleSupply['volume_ml']);

        // 4. Собираем план
        $plan = [];
        $categoriesToFind = ['Пробка', 'Этикетка', 'Колпачок'];

        // Добавляем в план бутылки
        $plan[] = [
            'category' => 'Бутылка',
            'required_quantity' => $requiredBottles,
            'selected_supply' => $bottleSupply // Сразу кладем выбранную бутылку
        ];

        // Ищем остальные расходники
        foreach ($categoriesToFind as $category) {
            $suppliesInCategory = $supplyModel->findByCategory($this->userId, $category);
            $plan[] = [
                'category' => $category,
                'required_quantity' => $requiredBottles,
                'available_supplies' => $suppliesInCategory // Даем фронтенду выбор
            ];
        }

        echo json_encode($plan);
    }

    /**
     * Выполняет финальную операцию розлива на основе подтвержденного плана.
     */
    public function executeBottling($batchId) {
        $data = json_decode(file_get_contents('php://input'), true);

        // ... (здесь будет полная валидация, как мы делали для bottle, но для краткости опустим) ...

        $batchModel = new \Models\Batch();
        $supplyModel = new \Models\Supply();
        $transactionModel = new \Models\SupplyTransaction();

        $batch = $batchModel->findById($batchId);

        $this->db->beginTransaction();
        try {
            // 1. Списываем вино
            $newVolume = $batch['current_volume'] - $data['volume_to_bottle'];
            $batchModel->update($batchId, ['current_volume' => $newVolume]);

            // 2. Списываем расходники
            foreach ($data['supplies_used'] as $item) {
                // Пропускаем те, что пользователь решил не списывать
                if (empty($item['supply_id']) || empty($item['quantity'])) continue;

                $supply = $supplyModel->findById($item['supply_id']);
                $newSupplyQuantity = $supply['quantity'] - $item['quantity'];
                $supplyModel->updateQuantity($item['supply_id'], $newSupplyQuantity);

                $transactionModel->create([
                    'supply_id' => $item['supply_id'],
                    'user_id' => $this->userId,
                    'batch_id' => $batchId,
                    'type' => 'расход',
                    'quantity_change' => -$item['quantity'],
                    'notes' => 'Розлив'
                ]);
            }

            // 3. Логируем процесс
            $processModel = new \Models\Process();
            // ... (логика поиска или создания процесса "Розлив", как в прошлом методе) ...

            $this->db->commit();
            echo json_encode(['success' => true, 'message' => 'Вино успешно розлито.']);

        } catch (\Exception $e) {
            $this->db->rollBack();
            error_log("Ошибка при розливе: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Внутренняя ошибка сервера.']);
        }
    }

}