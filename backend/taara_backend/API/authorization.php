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
        if (isset($payload["get_user_by_type"])) {
            $type = $payload['get_user_by_type'];

            $columns = [
                'tbl_users.user_id',
                'tbl_users.user_type',
                'f.image_path',
                'tbl_users.first_name',
                'tbl_users.middle_name',
                'tbl_users.last_name',
                'tbl_users.suffix',
                'tbl_users.Bio',
                'tbl_users.birth_date',
                'tbl_users.email_address',
                'tbl_users.phone_number',
                'tbl_users.civil_status',
                'tbl_users.occupation',
                'tbl_users.street',
                'tbl_users.brgy_name',
                'tbl_users.city_municipality',
                'tbl_users.province',
                'tbl_users.sex',
                'tbl_users.date_created',
                'tbl_users.username',
                'tbl_users.is_activated',
            ];

            if ($type == 3) {
                $columns[] = 'tbl_official_position.position_title';
                $columns[] = 'tbl_official_position.position_description';
                $columns[] = 'page_access';
                $this->db->groupBy("tbl_users.roles");
                $this->db->join('tbl_official_position', 'tbl_users.roles = tbl_official_position.id', 'left');
            }
            if ($type == 2) {
                $columns[] = 'tbl_volunteer_position.position_title';
                $columns[] = 'tbl_volunteer_position.position_description';
                $columns[] = 'ff.application_status';
                $columns[] = 'ff.id volunteer_id';
                $columns[] = 'page_access';
                $this->db->join('tbl_volunteer_position', 'tbl_users.roles = tbl_volunteer_position.id', 'left');
                $this->db->join('tbl_volunteer_form ff', 'tbl_users.user_id = ff.user_id', 'left');
            }

            // Perform the query with the selected columns and join
            $this->db->where('tbl_users.user_type', $type);
            $this->db->where('tbl_users.is_deleted', 1);
            $this->db->join('tbl_files f', 'f.id = tbl_users.image_id', 'LEFT');
            $query = $this->db->get("tbl_users", null, $columns);

            // Respond with success and the query data
            echo json_encode([
                'status' => 'success',
                'data' => $query,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_page_access', $payload)) {
            $query = $this->db->get("tbl_pages");
            // Respond with success and the query data
            echo json_encode([
                'status' => 'success',
                'data' => $query,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_pending_volunteer', $payload)) {
            $this->db->where("u.is_deleted", 1);
            $this->db->where("f.application_status", 1);
            $this->db->join("tbl_volunteer_form f", 'f.user_id = u.user_id', "left");

            $result = $this->db->get('tbl_users u');
            $count = count($result); // 👈 Count the number of records

            echo json_encode([
                'status' => 'success',
                'count' => $count,        // ✅ Include the count here
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
        $datas = json_encode($payload);
        $ref_id = json_decode($datas, true);
    }

    public function httpPut($payload)
    {
        if (array_key_exists('updateUser', $payload)) {
            // Extract the user data
            $user_data = $payload['updateUser']['clone'];
            $user_id = $payload['updateUser']['user_id'];
            $user_type = $payload['updateUser']['user_type'];
            $password = $user_data['password'] ?? '';

            // Ensure user_id is provided
            if (!isset($user_data['user_id'])) {
                echo json_encode(['status' => 'error', 'message' => 'Missing user_id']);
                return;
            }

            $update_values = [];

            $allowed_fields = [
                'user_type',
                // 'image_path',
                'first_name',
                'middle_name',
                'last_name',
                'suffix',
                'Bio',
                'birth_date',
                'email_address',
                'phone_number',
                'civil_status',
                'occupation',
                'street',
                'brgy_name',
                'city_municipality',
                'province',
                'sex',
                'date_created',
                'date_archieve',
                'username',
                'password',
            ];

            // Loop through the allowed fields and check if they exist in the user data
            foreach ($allowed_fields as $field) {
                if (array_key_exists($field, $user_data) && $user_data[$field] !== null) {
                    // Only add fields that exist in the payload and are not null
                    $update_values[$field] = $user_data[$field];
                }
            }

            // Encrypt and set password if it's not empty
            if (!empty($password)) {
                $update_values['password'] = password_hash($password, PASSWORD_DEFAULT);
            }

            // Check if we have any fields to update
            if (empty($update_values)) {
                echo json_encode(['status' => 'error', 'message' => 'No valid fields to update']);
                return;
            }

            // Perform the database update based on user_id
            $this->db->where('user_id', $user_data['user_id']);
            $update_success = $this->db->update('tbl_users', $update_values);

            // Return a response based on whether the update was successful
            if ($update_success) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Update User info',
                    'module' => 'User Management',
                ];

                $this->db->insert("tbl_logs", $logs);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'User information updated successfully.',
                    'method' => 'PUT',
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update user information.',
                    'method' => 'PUT',
                ]);
            }
        } else if (isset($payload['soft_delete_user'])) {
            $id = $payload['soft_delete_user']['arrayId'];
            $user_id = $payload['soft_delete_user']['user_id'];
            $user_type = $payload['soft_delete_user']['user_type'];

            $ids = is_array($id) ? $id : explode(',', $id);

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 0,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('user_id', $ids, 'IN');
            $updated = $this->db->update('tbl_users', $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Deactivate Account',
                    'module' => 'User Management',
                ];

                $this->db->insert("tbl_logs", $logs);
                echo json_encode(['status' => 'success', 'message' => 'User delete successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to soft delete user', 'method' => 'PUT']);
            }
        } else if (isset($payload['activate_or_deactivate'])) {
            $user_id = $payload['activate_or_deactivate']['user_id'];
            $user_type = $payload['activate_or_deactivate']['user_type'];
            $user_id_to_update = $payload['activate_or_deactivate']['rowUserId'];
            $val = $payload['activate_or_deactivate']['val'];

            $update_values = [
                'is_activated' => $val,
            ];

            // Update records matching the IDs
            $this->db->where('user_id', $user_id_to_update);
            $updated = $this->db->update('tbl_users', $update_values);

            $state = $val == 0 ? 'Deactivate' : 'Activate';
            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => $state . ' a User',
                    'module' => 'User Management',
                ];

                $this->db->insert("tbl_logs", $logs);
                echo json_encode(['status' => 'success', 'message' => 'User ' . $state . ' successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to  ' . $state . 'user', 'method' => 'PUT']);
            }
        } else if (isset($payload['approve_disapprove_volunteer'])) {
            $user_id = $payload['approve_disapprove_volunteer']['user_id'];
            $user_type = $payload['approve_disapprove_volunteer']['user_type'];
            $val_user_id = $payload['approve_disapprove_volunteer']['val_user_id'];
            $volunteer_id = $payload['approve_disapprove_volunteer']['volunteer_id'];
            $val = $payload['approve_disapprove_volunteer']['val'];

            $update_values = [
                'application_status' => $val,
            ];

            // Update records matching the IDs
            $this->db->where('id', $volunteer_id);
            $updated = $this->db->update('tbl_volunteer_form', $update_values);

            $state = $val == 2 ? 'Approve' : 'Disapprove';

            if ($val == 2) {
                $this->db->where('user_id', $val_user_id);
                $updated = $this->db->update('tbl_users', ['user_type' => 2, 'roles_type' => 2]);
            }
            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => $state . ' a Volunteer',
                    'module' => 'User Management',
                ];

                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => $val_user_id, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'Volunteer Request' . $state,
                    'message' => $state === 'Approved'
                        ? 'A volunteer request has been approved. You may now assign roles or tasks.'
                        : ($state === 'Disapproved'
                            ? 'A volunteer request has been disapproved. No further action is needed.'
                            : 'A new volunteer request has been submitted and is pending review.'),
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '/public/volunteer-form',
                    'is_read'      => json_encode([]), // 0 = unread
                ];


                $this->db->insert("tbl_notification", $notif);

                echo json_encode(['status' => 'success', 'message' => 'Volunteer ' . $state . ' successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to  ' . $state . 'user', 'method' => 'PUT']);
            }
        } else {
            // Handle the case where 'updateUser' key is missing
            echo json_encode(['status' => 'error', 'message' => 'Missing updateUser key in the payload']);
        }
    }


    public function httpDelete($payload) {}
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
