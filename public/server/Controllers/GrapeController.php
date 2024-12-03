<?php
// controllers/GrapeController.php

namespace Controllers;

use Models\Grape;

class GrapeController extends BaseController
{
    // Получить все закупки текущего пользователя
    public function index()
    {
        $grapeModel = new Grape();
        $grapes = $grapeModel->getAllByUser($this->userId);

        echo json_encode($grapes);
    }

    // Создать новую закупку
    public function store()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        // Валидация данных
        if (!isset($data['sort'], $data['date_purchased'], $data['quantity'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать сорт, дату закупки и количество']);
            exit;
        }

        $grapeModel = new Grape();

        $grapeId = $grapeModel->create([
            'user_id' => $this->userId,
            'sort' => trim($data['sort']),
            'date_purchased' => $data['date_purchased'],
            'quantity' => (float)$data['quantity'],
            'cost' => isset($data['cost']) ? (float)$data['cost'] : null,
            'supplier' => isset($data['supplier']) ? trim($data['supplier']) : null,
            'notes' => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        echo json_encode(['message' => 'Закупка добавлена', 'grape_id' => $grapeId]);
    }

    // Получить информацию о конкретной закупке
    public function show($id)
    {
        $grapeModel = new Grape();
        $grape = $grapeModel->findById($id);

        if ($grape && $grape['user_id'] == $this->userId) {
            echo json_encode($grape);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Закупка не найдена']);
        }
    }

    // Обновить данные закупки
    public function update($id)
    {
        $grapeModel = new Grape();
        $grape = $grapeModel->findById($id);

        if (!$grape || $grape['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Закупка не найдена']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $updateData = [];
        if (isset($data['sort'])) {
            $updateData['sort'] = trim($data['sort']);
        }
        if (isset($data['date_purchased'])) {
            $updateData['date_purchased'] = $data['date_purchased'];
        }
        if (isset($data['quantity'])) {
            $updateData['quantity'] = (float)$data['quantity'];
        }
        if (isset($data['cost'])) {
            $updateData['cost'] = (float)$data['cost'];
        }
        if (isset($data['supplier'])) {
            $updateData['supplier'] = trim($data['supplier']);
        }
        if (isset($data['notes'])) {
            $updateData['notes'] = trim($data['notes']);
        }

        $grapeModel->update($id, $updateData);

        echo json_encode(['message' => 'Данные закупки обновлены']);
    }

    // Удалить закупку
    public function destroy($id)
    {
        $grapeModel = new Grape();
        $grape = $grapeModel->findById($id);

        if (!$grape || $grape['user_id'] != $this->userId) {
            http_response_code(404);
            echo json_encode(['error' => 'Закупка не найдена']);
            exit;
        }

        $grapeModel->delete($id);

        echo json_encode(['message' => 'Закупка удалена']);
    }
}