<?php
// models/BatchComponent.php

namespace Models;

class BatchComponent extends BaseModel
{
    public $id;
    public $batch_id;
    public $component_type;
    public $component_id;
    public $percentage;
    public $volume;
    public $notes;

    public function __construct()
    {
        parent::__construct();
    }

    // Получить компоненты для партии
    public function getComponentsByBatch($batchId)
    {
        $stmt = $this->db->prepare('SELECT * FROM batch_components WHERE batch_id = :batch_id');
        $stmt->execute(['batch_id' => $batchId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Добавить компонент к партии
    public function create($data)
    {
        $stmt = $this->db->prepare('
            INSERT INTO batch_components (batch_id, component_type, component_id, percentage, volume, notes)
            VALUES (:batch_id, :component_type, :component_id, :percentage, :volume, :notes)
        ');
        $stmt->execute([
            'batch_id' => $data['batch_id'],
            'component_type' => $data['component_type'],
            'component_id' => $data['component_id'],
            'percentage' => $data['percentage'],
            'volume' => $data['volume'],
            'notes' => $data['notes'],
        ]);
        return $this->db->lastInsertId();
    }

    // Удалить компонент из партии
    public function delete($id)
    {
        $stmt = $this->db->prepare('DELETE FROM batch_components WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    // Найти компонент по ID
    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM batch_components WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}