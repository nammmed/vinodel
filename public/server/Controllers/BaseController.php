<?php
// controllers/BaseController.php

namespace Controllers;

class BaseController
{
    protected $userId;

    public function __construct()
    {
        //проверяем авторизацию при создании контроллеров
        $userController = new UserController();
        $this->userId = $userController->checkAuth();
    }
}