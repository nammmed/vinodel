<?php
// models/GrapeSort.php

namespace Models;

class GrapeSort extends BaseModel
{
    /**
     * Проверяет существование сорта по его ID.
     * @param int $id ID сорта.
     * @return bool True, если сорт существует, иначе false.
     */
    public function exists($id)
    {
        $stmt = $this->db->prepare('SELECT 1 FROM grape_sorts WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetchColumn() !== false;
    }
}