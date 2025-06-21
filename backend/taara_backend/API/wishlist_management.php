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
        if (array_key_exists('get_wishlist', $payload)) {
            $table = $payload['get_wishlist'];
            $this->db->where("is_deleted", 0);
            $query = $this->db->get($table);

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
        if (array_key_exists("add_wishlist", $payload)) {
            $table = $payload['add_wishlist']['obj']['table']; // Extract table name
            $data = $payload['add_wishlist']['obj'];
            $user_id = $payload['add_wishlist']['user_id'];
            $user_type = $payload['add_wishlist']['user_type'];
            $user_name = $payload['add_wishlist']['user_name'];
            unset($data['table']); // Remove table key from data before insert

            if ($this->db->insert($table, $data)) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Add New Wishlist',
                    'module' => 'Wishlist',
                ];

                $this->db->insert("tbl_logs", $logs);



                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Add New Wishlist',
                    'message'      => 'A new Wishlist was added by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);

                echo json_encode([
                    'status' => 'success',
                    'message' => 'successfully add wishlist',
                    'method' => 'POST'
                ]);
            } else {
                echo json_encode([
                    'status' => 'failed',
                    'message' => 'cannot add wishlist',
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
        if (array_key_exists('update_wishlist', $payload)) {
            $id = $payload['update_wishlist']['data']['id'];
            $status = $payload['update_wishlist']['data']['status'] ?? '';
            $table = $payload['update_wishlist']['table'];
            $user_id = $payload['update_wishlist']['user_id'];
            $user_type = $payload['update_wishlist']['user_type'];
            $user_name = $payload['update_wishlist']['user_name'];
            if (isset($payload['update_wishlist']['data']['status'])) {
                $update_values = [
                    'is_priority' => $status,
                ];
            } else {
                $update_values = $payload['update_wishlist']['data'];
            }

            $this->db->where('id', $id);
            $updated = $this->db->update($table, $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Update Wishlist list',
                    'module' => 'Wishlist',
                ];

                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Update New Wishlist',
                    'message'      => 'A  Wishlist was updated by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);


                echo json_encode(['status' => 'success', 'message' => 'Records updated successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to updated records', 'method' => 'PUT']);
            }
        } else   if (array_key_exists('delete_wishlist', $payload)) {
            $id = $payload['delete_wishlist']['id'];
            $table = $payload['delete_wishlist']['table'];
            $user_id = $payload['delete_wishlist']['user_id'];
            $user_type = $payload['delete_wishlist']['user_type'];
            $user_name = $payload['delete_wishlist']['user_name'];
            $ids = is_array($id) ? $id : explode(',', $id);

            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update($table, $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Archive Wishlist list',
                    'module' => 'Wishlist',
                ];

                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Archive Wishlist list',
                    'message'      => 'A  Wishlist was archive by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);

                echo json_encode(['status' => 'success', 'message' => 'Record archive successfully', 'method' => 'PUT']);
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
