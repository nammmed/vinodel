<?php
// models/Batch.php

namespace Models;

class Batch extends BaseModel
{
    public $id;
    public $user_id;
    public $name;
    public $is_blend;
    public $initial_volume;
    public $current_volume;
    public $status;
    public $notes;
    public $created_at;

    public function __construct()
    {
        parent::__construct();
    }

    // Найти партию по ID
    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM batches WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // Получить все партии пользователя
    public function getAllByUser($userId)
    {
        $stmt = $this->db->prepare('SELECT * FROM batches WHERE user_id = :user_id AND current_volume > 0');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Создать новую партию
    public function create($data)
    {
        $stmt = $this->db->prepare('
            INSERT INTO batches (user_id, name, is_blend, initial_volume, current_volume, status, notes, created_at)
            VALUES (:user_id, :name, :is_blend, :initial_volume, :current_volume, :status, :notes, NOW())
        ');
        $stmt->execute([
            'user_id' => $data['user_id'],
            'name' => $data['name'],
            'is_blend' => $data['is_blend'],
            'initial_volume' => $data['initial_volume'],
            'current_volume' => $data['current_volume'],
            'status' => $data['status'],
            'notes' => $data['notes'],
        ]);
        return $this->db->lastInsertId();
    }

    // Обновить партию
    public function update($id, $data)
    {
        $fields = [];
        $params = ['id' => $id];

        if (isset($data['name'])) {
            $fields[] = 'name = :name';
            $params['name'] = $data['name'];
        }
        if (isset($data['is_blend'])) {
            $fields[] = 'is_blend = :is_blend';
            $params['is_blend'] = $data['is_blend'];
        }
        if (isset($data['initial_volume'])) {
            $fields[] = 'initial_volume = :initial_volume';
            $params['initial_volume'] = $data['initial_volume'];
        }
        if (isset($data['current_volume'])) {
            $fields[] = 'current_volume = :current_volume';
            $params['current_volume'] = $data['current_volume'];
        }
        if (isset($data['status'])) {
            $fields[] = 'status = :status';
            $params['status'] = $data['status'];
        }
        if (isset($data['notes'])) {
            $fields[] = 'notes = :notes';
            $params['notes'] = $data['notes'];
        }

        if ($fields) {
            $sql = 'UPDATE batches SET ' . implode(', ', $fields) . ' WHERE id = :id';
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
        }
    }

    // Удалить партию
    public function delete($id)
    {
        $stmt = $this->db->prepare('DELETE FROM batches WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    /**
     * Находит все моносортовые (не купажи) партии указанного сорта у пользователя.
     * @param string $grapeSort Название сорта винограда.
     * @param int $userId ID пользователя.
     * @return array Массив партий.
     */
    public function findMonoSortBatches($grapeSortId, $userId)
    {
        $stmt = $this->db->prepare("
            SELECT b.id, b.name, b.current_volume
            FROM batches b
            -- Присоединяем компоненты, чтобы найти связь с закупкой винограда
            JOIN batch_components bc ON b.id = bc.batch_id
            -- Присоединяем саму закупку винограда, чтобы узнать его сорт
            JOIN grapes g ON bc.component_id = g.id AND bc.component_type = 'grape'
            WHERE b.user_id = :user_id
              -- Убеждаемся, что это моносортовая партия (не купаж)
              AND b.is_blend = 0
              -- У которой еще есть объем
              AND b.current_volume > 0
              -- И фильтруем по ID нужного нам сорта
              AND g.grape_sort_id = :grape_sort_id
        ");
        $stmt->execute([
            'user_id' => $userId,
            'grape_sort_id' => $grapeSortId
        ]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}