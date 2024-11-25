<?php
// models/Measurement.php

namespace Models;

class Measurement extends BaseModel
{
    public $id;
    public $process_log_id;
    public $date;
    public $type;
    public $value;
    public $unit;
    public $notes;

    public function __construct()
    {
        parent::__construct();
    }

    // Получить замеры по логу процесса
    public function getMeasurementsByProcessLog($processLogId)
    {
        $stmt = $this->db->prepare('SELECT * FROM measurements WHERE process_log_id = :process_log_id');
        $stmt->execute(['process_log_id' => $processLogId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Создать новый замер
    public function create($data)
    {
        $stmt = $this->db->prepare('
            INSERT INTO measurements (process_log_id, date, type, value, unit, notes)
            VALUES (:process_log_id, :date, :type, :value, :unit, :notes)
        ');
        $stmt->execute([
            'process_log_id' => $data['process_log_id'],
            'date' => $data['date'],
            'type' => $data['type'],
            'value' => $data['value'],
            'unit' => $data['unit'],
            'notes' => $data['notes'],
        ]);
        return $this->db->lastInsertId();
    }

    // Удалить замер
    public function delete($id)
    {
        $stmt = $this->db->prepare('DELETE FROM measurements WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    // Найти замер по ID
    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM measurements WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

}