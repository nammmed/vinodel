<?php
namespace Models;

class SupplyTransaction extends BaseModel {
    public function create($data) {
        $stmt = $this->db->prepare('
            INSERT INTO supply_transactions (supply_id, user_id, batch_id, type, quantity_change, notes, transaction_date) 
            VALUES (:supply_id, :user_id, :batch_id, :type, :quantity_change, :notes, NOW())
        ');
        $stmt->execute([
            'supply_id' => $data['supply_id'],
            'user_id' => $data['user_id'],
            'batch_id' => $data['batch_id'] ?? null,
            'type' => $data['type'],
            'quantity_change' => $data['quantity_change'],
            'notes' => $data['notes'] ?? null,
        ]);
        return $this->db->lastInsertId();
    }
}