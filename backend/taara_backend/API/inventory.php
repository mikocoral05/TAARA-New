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
        if (array_key_exists('get_inventory_list', $payload)) {
            $category = $payload['get_inventory_list'];
            $today = date('Y-m-d');

            // Join the group name from the group table
            $this->db->join("tbl_inventory_group ig", "ig.id = tbl_inventory.group_name", "LEFT");

            $this->db->where("tbl_inventory.category", $category);
            $this->db->where("tbl_inventory.expiration_date", $today, ">=");
            $this->db->where("tbl_inventory.is_deleted", "1");

            // Select all inventory fields, but replace group_name with actual name from group table
            $query = $this->db->get("tbl_inventory", null, "tbl_inventory.*, CASE 
            WHEN ig.is_deleted = '1' OR ig.is_deleted IS NULL THEN ig.group_name 
            ELSE '' 
            END AS group_name
            ");

            echo json_encode([
                'status' => 'success',
                'data' => $query,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_inventory_expired_list', $payload)) {
            $category = $payload['get_inventory_expired_list'];

            $today = date('Y-m-d');

            $this->db->where("category", $category);
            $this->db->where("expiration_date", $today, "<"); // this is the correct way to do `>=`
            $this->db->where("is_deleted", "1");
            $query = $this->db->get("tbl_inventory");

            echo json_encode([
                'status' => 'success',
                'data' => $query,
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

            // Required fields - adapt based on your table schema
            $insertData = [
                'item_name'       => $data['item_name'] ?? null,
                'category'        => $data['category'] ?? null,
                'quantity'        => $data['quantity'] ?? null,
                'unit'            => $data['unit'] ?? null,
                'expiration_date' => $data['expiration_date'] ?? null,
                'group_name'      => $data['group_name'] ?? null,
                'date_received'   => $data['date_received'] ?? date('Y-m-d'),
                'description'   => $data['description'] ?? '',
                'notes'   => $data['notes'] ?? '',
            ];

            $insert = $this->db->insert('tbl_inventory', $insertData);

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Inventory list successfully added',
                    'method' => 'POST'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to create inventory list',
                    'method' => 'POST'
                ]);
            }
        } else if (isset($payload['add_group_name'])) {
            $data = $payload['add_group_name'];

            // Required fields - adapt based on your table schema
            $insertData = [
                'group_name'   => $data['group_name'] ?? null,
                'category'     => $data['category'] ?? null,
            ];

            $insert = $this->db->insert('tbl_inventory_group', $insertData);

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Inventory list successfully added',
                    'method' => 'POST'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to create inventory list',
                    'method' => 'POST'
                ]);
            }
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
            $id = $payload['soft_delete_inventory_data'];
            $table = $payload['table'];

            $ids = is_array($id) ? $id : explode(',', $id);


            // Whitelist allowed tables for safety
            $allowed_tables = ['tbl_inventory', 'tbl_inventory_group'];
            if (!in_array($table, $allowed_tables)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid table name']);
                return;
            }

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 0,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update($table, $update_values);

            if ($updated) {
                echo json_encode(['status' => 'success', 'message' => 'Records soft-deleted successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to soft delete records', 'method' => 'PUT']);
            }
        } else if (isset($payload['edit_inventory_list'])) {
            $data = $payload['edit_inventory_list'];
            $id = $data['id'];

            // Sanitize and validate as needed
            $updateData = [
                'item_name'       => $data['item_name'] ?? null,
                'category'        => $data['category'] ?? null,
                'quantity'        => $data['quantity'] ?? null,
                'unit'            => $data['unit'] ?? null,
                'expiration_date' => $data['expiration_date'] ?? null,
                'group_name'      => $data['group_name'] ?? null,
                'date_received'   => $data['date_received'] ?? date('Y-m-d'),
                'description'   => $data['description'] ?? '',
                'notes'   => $data['notes'] ?? '',
                'date_updated'   => date('Y-m-d'),
            ];

            $this->db->where('id', $id);
            $update = $this->db->update('tbl_inventory', $updateData);

            if ($update) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Inventory list successfully updated',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update inventory list',
                    'method' => 'PUT'
                ]);
            }
            // return;
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
