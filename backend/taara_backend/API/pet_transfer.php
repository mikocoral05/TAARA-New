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
        $this->db = new MysqliDB('localhost', 'mike', 'mike123', 'capstone');
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
            $data = $payload['add_petList_request']['obj'];
            $user_id = $payload['add_petList_request']['user_id'];
            $user_type = $payload['add_petList_request']['user_type'];

            if ($this->db->insert('tbl_pet_transfer', $data)) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Add New Pet Transfer info',
                    'module' => 'Pet Transfer',
                ];
                $this->db->insert("tbl_logs", $logs);

                //notif
                $notif = [
                    'for_user'     => -2, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'Add New Pet Transfer Request',
                    'message'      => 'Your pet transfer request has been',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);

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
        if (array_key_exists('update_pet_transfer', $payload)) {
            $data = $payload['update_pet_transfer']['obj'];
            $user_id = $payload['update_pet_transfer']['user_id'];
            $user_type = $payload['update_pet_transfer']['user_type'];
            $mode = $payload['update_pet_transfer']['mode'];
            $id = $data['id'];
            $this->db->where('id', $id);
            $updated = $this->db->update('tbl_pet_transfer', $data);

            if ($updated) {
                //logs
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => $mode . ' Pet Transfer info',
                    'module' => 'Pet Transfer',
                ];
                $this->db->insert("tbl_logs", $logs);

                //notif
                if ($mode != 'Edit') {

                    $notif = [
                        'for_user'     => $data['user_id'], // Example: -1 = all public_user, -2 = all management
                        'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                        'title'        => $mode . ' Pet Transfer Request',
                        'message'      => 'Your pet transfer request has been ' . $mode,
                        'type'         => 2, // 1 = announcement, 2 = notification
                        'related_url'  => '/public/pet-transfer',
                        'is_read'      => json_encode([]), // 0 = unread
                    ];
                    $this->db->insert("tbl_notification", $notif);
                }



                echo json_encode(['status' => 'success', 'message' => 'Records updated successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to updated records', 'method' => 'PUT']);
            }
        } else   if (array_key_exists('delete_pet_transfer', $payload)) {
            $id = $payload['delete_pet_transfer']['arrayId'];
            $user_id = $payload['delete_pet_transfer']['user_id'];
            $user_type = $payload['delete_pet_transfer']['user_type'];
            $ids = is_array($id) ? $id : explode(',', $id);

            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update('tbl_pet_transfer', $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Archive Pet Transfer list',
                    'module' => 'Pet Transfer',
                ];

                $this->db->insert("tbl_logs", $logs);
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
