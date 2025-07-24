<?php
namespace Controllers;
use Models\Supply;
use Models\SupplyTransaction;

class SupplyController extends BaseController {
    // Получить все расходники пользователя
    public function index() {
        $supplyModel = new Supply();
        echo json_encode($supplyModel->getAllByUser($this->userId));
    }

    // Создать новую позицию на складе
    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        $data['user_id'] = $this->userId;

        $supplyModel = new Supply();
        $newId = $supplyModel->create($data);
        echo json_encode(['success' => true, 'id' => $newId]);
    }

    // Зарегистрировать приход (закупку)
    public function addStock($supplyId) {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['quantity']) || !is_numeric($data['quantity']) || $data['quantity'] <= 0) {
            http_response_code(400); exit(json_encode(['error' => 'Некорректное количество.']));
        }

        $supplyModel = new Supply();
        $supply = $supplyModel->findById($supplyId);

        if (!$supply || $supply['user_id'] != $this->userId) {
            http_response_code(404); exit;
        }

        $this->db->beginTransaction();
        try {
            // 1. Создаем транзакцию прихода
            $transactionModel = new SupplyTransaction();
            $transactionModel->create([
                'supply_id' => $supplyId,
                'user_id' => $this->userId,
                'type' => 'приход',
                'quantity_change' => $data['quantity'],
                'notes' => $data['notes'] ?? 'Закупка',
            ]);
            // 2. Увеличиваем остаток на складе
            $newQuantity = $supply['quantity'] + $data['quantity'];
            $supplyModel->updateQuantity($supplyId, $newQuantity);

            $this->db->commit();
            echo json_encode(['success' => true, 'new_quantity' => $newQuantity]);
        } catch (\Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}