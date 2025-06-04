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
        if (array_key_exists('get_pet_transfer_list', $payload)) {
            $status = $payload['get_pet_transfer_list'] ?? 0; // default to 0 if not provided

            if ($status !== 0 && $status !== '0') {
                $this->db->where("status", $status);
            }

            $this->db->where("f.is_deleted", 0);
            $this->db->join("tbl_users u ", 'f.user_id = u.user_id', 'left');
            $query = $this->db->get('tbl_pet_transfer f', null, '
            f.*,
            CASE 
                WHEN f.user_id IS NOT NULL THEN u.first_name 
                ELSE f.owner_first_name 
            END AS owner_first_name,
               CASE 
                WHEN f.user_id IS NOT NULL THEN u.middle_name 
                ELSE f.owner_middle_name 
            END AS owner_middle_name,
               CASE 
                WHEN f.user_id IS NOT NULL THEN u.last_name 
                ELSE f.owner_last_name 
            END AS owner_last_name
            ');

            echo json_encode([
                'status' => 'success',
                'data' => $query,
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
        if (array_key_exists("add_petList_request", $payload)) {
            $data = $payload['add_petList_request'];

            if ($this->db->insert('tbl_pet_transfer', $data)) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Successfully add Pet request List',
                    'method' => 'POST'
                ]);
            } else {
                echo json_encode([
                    'status' => 'failed',
                    'message' => 'Cannot add Pet request List',
                    'method' => 'POST'
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing Pet request List data in the payload',
                'method' => 'POST'
            ]);
        }
    }

    public function httpPut($payload)
    {
        if (array_key_exists('update_wishlist', $payload)) {
            $id = $payload['update_wishlist']['data']['id'];
            $status = $payload['update_wishlist']['data']['status'] ?? '';
            $table = $payload['update_wishlist']['table'];
            if ($status) {
                $update_values = [
                    'is_priority' => $status,
                ];
            } else {
                $update_values = $payload['update_wishlist']['data'];
            }

            $this->db->where('id', $id);
            $updated = $this->db->update($table, $update_values);

            if ($updated) {
                echo json_encode(['status' => 'success', 'message' => 'Records updated successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to updated records', 'method' => 'PUT']);
            }
        } else   if (array_key_exists('delete_wishlist', $payload)) {
            $id = $payload['delete_wishlist']['id'];
            $table = $payload['delete_wishlist']['table'];
            $ids = is_array($id) ? $id : explode(',', $id);

            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update($table, $update_values);

            if ($updated) {
                echo json_encode(['status' => 'success', 'message' => 'Records delete successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to delete records', 'method' => 'PUT']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Missing updated data in the payload']);
        }
    }


    public function httpDelete($payload)
    {
        $datas = json_encode($payload);
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
