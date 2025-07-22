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

        // Проверка корректности данных
        if (!isset($data['grape_sort_id'], $data['date_purchased'], $data['quantity'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Необходимо указать сорт, дату закупки и количество']);
            exit;
        }

        $sort = trim($data['sort']);
        $datePurchased = $data['date_purchased'];
        $quantity = (float)$data['quantity'];

        // Дополнительная валидация
        if ($sort === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Сорт не может быть пустым']);
            exit;
        }

        if (!strtotime($datePurchased)) {
            http_response_code(400);
            echo json_encode(['error' => 'Некорректная дата закупки']);
            exit;
        }

        if ($quantity <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Количество должно быть положительным числом']);
            exit;
        }

        // Опциональная валидация для поля cost
        if (isset($data['cost']) && (!is_numeric($data['cost']) || $data['cost'] < 0)) {
            http_response_code(400);
            echo json_encode(['error' => 'Стоимость должна быть неотрицательным числом']);
            exit;
        }

        $grapeModel = new Grape();

        try {
            $grapeId = $grapeModel->create([
                'user_id' => $this->userId,
                'grape_sort_id' => (int)$data['grape_sort_id'],
                'date_purchased' => $datePurchased,
                'quantity' => $quantity,
                'cost' => isset($data['cost']) ? (float)$data['cost'] : null,
                'supplier' => isset($data['supplier']) ? trim($data['supplier']) : null,
                'notes' => isset($data['notes']) ? trim($data['notes']) : null,
            ]);

            echo json_encode(['message' => 'Закупка добавлена', 'grape_id' => $grapeId]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
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
        if (isset($data['grape_sort_id'])) {
            $updateData['grape_sort_id'] = (int)$data['grape_sort_id'];
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

        if (isset($updateData['sort']) && $updateData['sort'] === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Сорт не может быть пустым']);
            exit;
        }

        if (isset($updateData['date_purchased']) && !strtotime($updateData['date_purchased'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Некорректная дата закупки']);
            exit;
        }

        if (isset($updateData['quantity']) && $updateData['quantity'] <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Количество должно быть положительным числом']);
            exit;
        }

        if (isset($updateData['cost']) && (!is_numeric($updateData['cost']) || $updateData['cost'] < 0)) {
            http_response_code(400);
            echo json_encode(['error' => 'Стоимость должна быть неотрицательным числом']);
            exit;
        }

        try {
            $grapeModel->update($id, $updateData);
            echo json_encode(['message' => 'Данные закупки обновлены']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
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

        try {
            $grapeModel->delete($id);
            echo json_encode(['message' => 'Закупка удалена']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}