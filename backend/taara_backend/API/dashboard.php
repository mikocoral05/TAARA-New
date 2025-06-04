<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
require_once('../MysqliDb.php');

class API
{
    public function __construct()
    {
        $this->db = new MysqliDB('localhost', 'root', '', 'capstone');
    }

    public function httpGet($payload)
    {
        if (array_key_exists('get_user_sum', $payload)) {

            $this->db->where("is_deleted", 1);
            $this->db->where("is_activated", 1);
            $query = $this->db->get("tbl_users");

            echo json_encode([
                'status' => 'success',
                'count' => count($query),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_count_animals', $payload)) {

            $this->db->where("is_deleted", 1);
            $query = $this->db->get("tbl_animal_info");

            echo json_encode([
                'status' => 'success',
                'count' => count($query),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_inventory_summary', $payload)) {

            $this->db->where("is_deleted", 1);
            $this->db->groupBy('category');
            $results = $this->db->get('tbl_inventory', null, ['category', 'COUNT(*) as total_count']);

            echo json_encode([
                'status' => 'success',
                'data' => $results,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_inventory_list_summary', $payload)) {
            $category = $payload['get_inventory_list_summary'];
            $today = date('Y-m-d');

            // Not expired: quantity & unique group count
            $this->db->where("category", $category);
            $this->db->where("expiration_date", $today, ">=");
            $this->db->where("is_deleted", "1");
            $notExpired = $this->db->getOne("tbl_inventory", "SUM(quantity) as total_quantity, COUNT(DISTINCT group_name) as unique_group_count");

            // Expired: count of expired items
            $this->db->where("category", $category);
            $this->db->where("expiration_date", $today, "<");
            $this->db->where("is_deleted", "1");
            $expiredCount = $this->db->getValue("tbl_inventory", "COUNT(*)");

            // Group count from tbl_inventory_group
            $this->db->where("category", $category);
            $groupCount = $this->db->getValue("tbl_inventory_group", "COUNT(DISTINCT group_name)");

            echo json_encode([
                'status' => 'success',
                'data' => [
                    'total_quantity' => $notExpired['total_quantity'],
                    'unique_group_count' => $notExpired['unique_group_count'],
                    'expired_count' => $expiredCount,
                    'group_name_count' => $groupCount
                ],
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_inventory_group', $payload)) {
            $category = $payload['get_inventory_group'];
            $today = date('Y-m-d');

            // First get all groups for that category
            $this->db->where("category", $category);
            $this->db->where("is_deleted", "1");
            $groups = $this->db->get("tbl_inventory_group");

            $result = [];

            foreach ($groups as $index => $group) {
                $this->db->where("category", $category);
                $this->db->where("group_name", $group['id']);
                $this->db->where("expiration_date", $today, ">=");

                $count = $this->db->getValue("tbl_inventory", "COUNT(*)");

                $result[] = [
                    'id'         => $index + 1,
                    'group_name' => $group['group_name'],
                    'category'   => $group['category'],
                    'count'      => $count
                ];
            }

            echo json_encode([
                'status' => 'success',
                'data'   => $result,
                'method' => 'GET'
            ]);
        } else {
            // Return error if 'get_user_by_type' is not provided
            echo json_encode([
                'status' => 'failed',
                'message' => 'A error occured while performing action!'
            ]);
        }
    }


    public function httpPost($payload)
    {
        if (isset($payload['add_inventory_list'])) {
            $data = $payload['add_inventory_list'];
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing add_inventory_list data in the payload',
                'method' => 'POST'
            ]);
        }
    }

    public function httpPut($payload)
    {
        if (isset($payload['soft_delete_inventory_data'])) {
            //
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Missing soft_delete_inventory_data in the payload']);
        }
    }


    public function httpDelete($payload)
    {
        $datas = json_encode($payload);
        $arr = json_decode($datas, true);
        $del = idate("U");
    }
}

/* END OF CLASS */


$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];


$api = new API;


if ($request_method == 'GET') {
    $api->httpGet($_GET);
}

if ($request_method == 'POST') {
    $api->httpPost($received_data);
}

if ($request_method == 'PUT') {
    $api->httpPut($received_data);
}

if ($request_method == 'DELETE') {
    $api->httpDelete($received_data);
}
