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

            // Define columns to fetch
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
                'tbl_users.password',
            ];

            // Add tbl_official_position columns if the type is 3
            if ($type == 3) {
                $columns[] = 'tbl_official_position.position_title';
                $columns[] = 'tbl_official_position.position_description';
                $columns[] = 'page_access';
                $this->db->join('tbl_official_position', 'tbl_users.roles = tbl_official_position.id', 'left');
            }
            if ($type == 2) {
                $columns[] = 'tbl_volunteer_position.position_title';
                $columns[] = 'tbl_volunteer_position.position_description';
                $columns[] = 'page_access';
                $this->db->join('tbl_volunteer_position', 'tbl_users.roles = tbl_volunteer_position.id', 'left');
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
            $user_data = $payload['updateUser'];

            // Ensure user_id is provided
            if (!isset($user_data['user_id'])) {
                echo json_encode(['status' => 'error', 'message' => 'Missing user_id']);
                return;
            }

            // Prepare the array to hold the fields that will be updated
            $update_values = [];

            // Define the allowed fields for update (columns that can be updated)
            $allowed_fields = [
                'user_type',
                'image_path',
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
                'page_access',
            ];

            // Loop through the allowed fields and check if they exist in the user data
            foreach ($allowed_fields as $field) {
                if (array_key_exists($field, $user_data) && $user_data[$field] !== null) {
                    // Only add fields that exist in the payload and are not null
                    $update_values[$field] = $user_data[$field];
                }
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
            $id = $payload['soft_delete_user'];

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
                echo json_encode(['status' => 'success', 'message' => 'User delete successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to soft delete user', 'method' => 'PUT']);
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
