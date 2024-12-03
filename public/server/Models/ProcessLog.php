<?php
// models/ProcessLog.php

namespace Models;

class ProcessLog extends BaseModel
{
    public $id;
    public $batch_id;
    public $process_id;
    public $start_date;
    public $end_date;
    public $notes;

    public function __construct()
    {
        parent::__construct();
    }

    // Получить логи процессов для партии
    public function getLogsByBatch($batchId)
    {
        $stmt = $this->db->prepare('SELECT * FROM process_logs WHERE batch_id = :batch_id');
        $stmt->execute(['batch_id' => $batchId]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Создать новый лог процесса
    public function create($data)
    {
        $stmt = $this->db->prepare('
            INSERT INTO process_logs (batch_id, process_id, start_date, end_date, notes)
            VALUES (:batch_id, :process_id, :start_date, :end_date, :notes)
        ');
        $stmt->execute([
            'batch_id' => $data['batch_id'],
            'process_id' => $data['process_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'notes' => $data['notes'],
        ]);
        return $this->db->lastInsertId();
    }

    // Удалить лог процесса
    public function delete($id)
    {
        $stmt = $this->db->prepare('DELETE FROM process_logs WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    // Найти лог процесса по ID
    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM process_logs WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

}