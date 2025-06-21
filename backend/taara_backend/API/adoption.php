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
        if (array_key_exists('get_pet_adoption_list', $payload)) {
            $status = $payload['get_pet_adoption_list'] ?? 0; // default to 0 if not provided

            if ($status !== 0 && $status !== '0') {
                $this->db->where("status", $status);
            }

            $this->db->where("f.is_deleted", 0);
            $this->db->join("tbl_users u", 'f.user_id = u.user_id', 'left');
            $this->db->join("tbl_files ff", 'ff.id = f.valid_id', 'left');
            $this->db->join("tbl_animal_info a", 'a.animal_id = f.animal_id', 'left');
            $query = $this->db->get('tbl_adoption_form f', null, 'f.*,a.name,a.animal_id,u.first_name,u.last_name,u.phone_number,ff.image_path');

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

            if ($this->db->insert('tbl_adoption_form', $data)) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Add New Pet Adoption info',
                    'module' => 'Pet Adoption',
                ];
                $this->db->insert("tbl_logs", $logs);

                //notif
                $notif = [
                    'for_user'     => -2, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'Add New Pet Adoption Request',
                    'message'      => 'Your Pet Adoption request has been',
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
        if (array_key_exists('update_pet_adoption', $payload)) {
            $data = $payload['update_pet_adoption']['obj'];
            $user_id = $payload['update_pet_adoption']['user_id'];
            $user_type = $payload['update_pet_adoption']['user_type'];
            $user_name = $payload['update_pet_adoption']['user_name'];
            $id = $data['id'];
            $public_user_id = $data['user_id'];
            $update = [
                'status' => $data['status'],
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            if ($data['status'] == 2) {
                $update['adoption_status'] = 2;
            }

            $map = [2 => 'Approve', 3 => 'Disapprove'];
            $this->db->where('id', $id);
            $updated = $this->db->update('tbl_adoption_form', $update);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => $map[$data['status']] . ' Pet Adoption',
                    'module' => 'Pet Adoption',
                ];
                $this->db->insert("tbl_logs", $logs);


                $notif = [
                    'for_user'     => $public_user_id, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => $map[$data['status']] . ' Pet Adoption Request',
                    'message'      => 'Your Pet Adoption request has been ' . $map[$data['status']],
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);


                $notif = [
                    'for_user'     => -2, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => $map[$data['status']] . ' Pet Adoption Request',
                    'message'      => 'A Pet Adoption request was ' . $map[$data['status']] . ' by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);

                echo json_encode(['status' => 'success', 'message' => 'Records updated successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to updated records', 'method' => 'PUT']);
            }
        } else if (array_key_exists('update_pet_adoption_ready_pickup', $payload)) {
            $data = $payload['update_pet_adoption_ready_pickup']['obj'];
            $user_id = $payload['update_pet_adoption_ready_pickup']['user_id'];
            $user_type = $payload['update_pet_adoption_ready_pickup']['user_type'];
            $user_name = $payload['update_pet_adoption_ready_pickup']['user_name'];
            $id = $data['id'];
            $public_user_id = $data['user_id'];
            $update = [
                'adoption_status' => $data['adoption_status'],
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            $this->db->where('id', $id);
            $updated = $this->db->update('tbl_adoption_form', $update);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' =>  'Update Ready for pickup Pet Adoption',
                    'module' => 'Pet Adoption',
                ];
                $this->db->insert("tbl_logs", $logs);


                $notif = [
                    'for_user'     => $public_user_id, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'Pet Adoption Ready for pickup',
                    'message'      => 'Your Pet Adoption request is ready to pickup',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);


                $notif = [
                    'for_user'     => -2, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'Pet Adoption Ready for Pickup',
                    'message'      => 'A Pet Adoption request was updated by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);

                echo json_encode(['status' => 'success', 'message' => 'Records updated successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to updated records', 'method' => 'PUT']);
            }
        } else if (array_key_exists('update_pet_adoption_received', $payload)) {
            $data = $payload['update_pet_adoption_received']['obj'];
            $user_id = $payload['update_pet_adoption_received']['user_id'];
            $user_type = $payload['update_pet_adoption_received']['user_type'];
            $user_name = $payload['update_pet_adoption_received']['user_name'];
            $id = $data['id'];
            $public_user_id = $data['user_id'];
            $update = [
                'adoption_status' => $data['adoption_status'],
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            $this->db->where('id', $id);
            $updated = $this->db->update('tbl_adoption_form', $update);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' =>  'Update Received Pet Adoption',
                    'module' => 'Pet Adoption',
                ];
                $this->db->insert("tbl_logs", $logs);


                $notif = [
                    'for_user'     => $public_user_id, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'Pet Adoption Received',
                    'message'      => 'Your have received you pet.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);


                $notif = [
                    'for_user'     => -2, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'Pet Adoption Received',
                    'message'      => 'A Pet Adoption request was updated by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);

                echo json_encode(['status' => 'success', 'message' => 'Records updated successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to updated records', 'method' => 'PUT']);
            }
        } else   if (array_key_exists('delete_pet_adotpion', $payload)) {
            $id = $payload['delete_pet_adotpion']['arrayId'];
            $user_id = $payload['delete_pet_adotpion']['user_id'];
            $user_type = $payload['delete_pet_adotpion']['user_type'];
            $user_name = $payload['delete_pet_adotpion']['user_name'];
            $ids = is_array($id) ? $id : explode(',', $id);

            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update('tbl_adoption_form', $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Archive Pet Adoption list',
                    'module' => 'Pet Adoption',
                ];

                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Archive Pet Adoption',
                    'message'      => 'An Pet adoption request was archive by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


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
