<?php
// config/config.php

$dbConfig = [
    'host' => 'localhost',
    'dbname' => 'cq62098_vinodel',
    'user' => 'cq62098_vinodel',
    'password' => 'q1w2e3r4t5',
];

try {
    $db = new PDO(
        'mysql:host='.$dbConfig['host'].';dbname='.$dbConfig['dbname'].';charset=utf8',
        $dbConfig['user'],
        $dbConfig['password']
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Ошибка подключения: ' . $e->getMessage());
}