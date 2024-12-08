<?php
// controllers/BaseController.php

namespace Controllers;

class BaseController
{
    protected $db;
    protected $userId;

    public function __construct()
    {
        global $db;
        $this->db = $db;
        //проверяем авторизацию при создании контроллеров
        $userController = new UserController();
        $this->userId = $userController->checkAuth();
    }
}