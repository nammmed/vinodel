<?php
// models/Process.php

namespace Models;

class Process extends BaseModel
{
    public $id;
    public $name;
    public $description;

    public function __construct()
    {
        parent::__construct();
    }

    // Получить процесс по ID
    public function findById($id)
    {
        $stmt = $this->db->prepare('SELECT * FROM processes WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // Получить все процессы
    public function getAll()
    {
        $stmt = $this->db->query('SELECT * FROM processes');
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Создать новый процесс
    public function create($data)
    {
        $stmt = $this->db->prepare('INSERT INTO processes (name, description) VALUES (:name, :description)');
        $stmt->execute([
            'name' => $data['name'],
            'description' => $data['description'],
        ]);
        return $this->db->lastInsertId();
    }

    // Обновить процесс
    public function update($id, $data)
    {
        $fields = [];
        $params = ['id' => $id];

        if (isset($data['name'])) {
            $fields[] = 'name = :name';
            $params['name'] = $data['name'];
        }
        if (isset($data['description'])) {
            $fields[] = 'description = :description';
            $params['description'] = $data['description'];
        }

        if ($fields) {
            $sql = 'UPDATE processes SET ' . implode(', ', $fields) . ' WHERE id = :id';
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
        }
    }

    // Удалить процесс
    public function delete($id)
    {
        $stmt = $this->db->prepare('DELETE FROM processes WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    public function findByName($name)
    {
        $stmt = $this->db->prepare('SELECT * FROM processes WHERE name = :name');
        $stmt->execute(['name' => $name]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}