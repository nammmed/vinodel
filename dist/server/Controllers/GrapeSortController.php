<?php
namespace Controllers;
use Models\BaseModel;

class GrapeSortController extends BaseController {
    public function index() {
        $stmt = $this->db->query('SELECT id, name FROM grape_sorts ORDER BY name ASC');
        $sorts = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        echo json_encode($sorts);
    }
}