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
        if (array_key_exists('get_if_volunteer', $payload)) {
            $id = $payload['get_if_volunteer'];

            $column = ['application_status'];
            $this->db->where("user_id", $id);
            $this->db->orderBy("id", "desc");
            $query = $this->db->get("tbl_volunteer_form", 1, $column);

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
        if (array_key_exists("volunteer_request", $payload)) {
            $id = isset($payload['volunteer_request']['user_data']['user_id']) ? (int)$payload['volunteer_request']['user_data']['user_id'] : 0;
            $user_data = (array) $payload['volunteer_request']['user_data'];
            $form_data = (array) $payload['volunteer_request']['form_data'];

            $response = [
                'status' => 'error',
                'message' => 'Unknown error',
                'method' => 'POST'
            ];

            if ($id > 0) {
                $query_compar = $this->db->rawQuery("SELECT * FROM tbl_volunteer_form WHERE user_id = $id");
                if (count($query_compar) == 0) {

                    $copied_data = $user_data;
                    unset($copied_data['user_id']);
                    $this->db->where('user_id', $id);
                    $this->db->update('tbl_users', $copied_data);

                    if ($this->db->insert('tbl_volunteer_form', $form_data)) {
                        $response = [
                            'status' => 'success',
                            'message' => 'Registration successful. Please wait for approval',
                            'method' => 'POST'
                        ];
                    } else {
                        $response['message'] = 'Failed to insert volunteer form.';
                    }
                } else {
                    $response = [
                        'status' => 'success',
                        'message' => 'You have already submitted!',
                        'method' => 'POST'
                    ];
                }
            } else {
                if ($this->db->insert('tbl_users', $user_data)) {
                    $id = $this->db->getInsertId();
                    $form_data['user_id'] = $id;  // ensure form links to new user
                    if ($this->db->insert('tbl_volunteer_form', $form_data)) {
                        $response = [
                            'status' => 'success',
                            'message' => 'Registration successful. Please wait for approval',
                            'method' => 'POST'
                        ];
                    } else {
                        $response['message'] = 'Failed to insert volunteer form.';
                    }
                } else {
                    $response['message'] = 'Failed to insert user data.';
                }
            }

            echo json_encode($response);
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
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Missing soft_delete_inventory_data in the payload']);
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
