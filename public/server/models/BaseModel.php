<?php
// models/BaseModel.php

namespace Models;

class BaseModel
{
    protected $db;

    public function __construct()
    {
        global $db; // Берем $db из глобальной области видимости
        $this->db = $db;
    }
}