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

        if (array_key_exists('get_announcement', $payload)) {

            $this->db->where("a.is_deleted", 0);

            $select = "
                a.*,
                u.user_id,
                u.user_type,
                u.first_name,
                u.last_name,
                CASE 
                    WHEN u.user_type = 3 THEN (SELECT position_title FROM tbl_official_position op WHERE op.id = u.roles)
                    WHEN u.user_type = 2 THEN (SELECT position_title FROM tbl_volunteer_position vp WHERE vp.id = u.roles)
                    ELSE NULL
                END AS position_title
            ";

            $this->db->join('tbl_users u', 'u.user_id = a.created_by', 'LEFT');
            $result = $this->db->get('tbl_announcements a', null, $select);

            echo json_encode([
                'status' => 'success',
                'data' => $result,
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
        if (isset($payload['save_animal_list'])) {
            $data = $payload['save_animal_list'];

            $insertData = [
                'name'               => $data['name'] ?? null,
                'species'            => $data['species'] ?? null,
                'breed'              => $data['breed'] ?? null,
                'date_of_birth'      => $data['date_of_birth'] ?? null,
                'fur_color'          => $data['fur_color'] ?? null,
                'eye_color'          => $data['eye_color'] ?? null,
                'sex'                => $data['sex'] ?? null,
                'weight'             => $data['weight'] ?? null,
                'height'             => $data['height'] ?? null,
                'temperament'        => $data['temperament'] ?? null,
                'skills'             => $data['skills'] ?? null,
                'favorite_food'      => $data['favorite_food'] ?? null,
                'health_status'      => $data['health_status'] ?? null,
                'medical_needs'      => $data['medical_needs'] ?? null,
                'spayed_neutered'    => $data['spayed_neutered'] ?? null,
                'vaccination_status' => $data['vaccination_status'] ?? null,
                'rescue_status'      => $data['rescue_status'] ?? null,
                'story_background'   => $data['story_background'] ?? null,
            ];

            $insert = $this->db->insert('tbl_animal_info', $insertData);
            $id = $this->db->getInsertId();

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Animal info successfully added',
                    'method' => 'POST',
                    'id' => $id
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to save animal info',
                    'method' => 'POST'
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing Data in the payload',
                'method' => 'POST'
            ]);
        }
    }


    public function httpPut($payload)
    {
        if (isset($payload['soft_delete_animal_info'])) {
            $id = $payload['soft_delete_animal_info'];

            $ids = is_array($id) ? $id : explode(',', $id);

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 0,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('animal_id', $ids, 'IN');
            $updated = $this->db->update('tbl_animal_info', $update_values);

            if ($updated) {
                echo json_encode(['status' => 'success', 'message' => 'Records soft-deleted successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to soft delete records', 'method' => 'PUT']);
            }
        } else if (isset($payload['edit_animal_info'])) {
            $obj = $payload['edit_animal_info'];

            $update_values = [
                'name' => $obj['name'] ?? null,
                'species' => $obj['species'] ?? null,
                'breed' => $obj['breed'] ?? null,
                'fur_color' => $obj['fur_color'] ?? null,
                'eye_color' => $obj['eye_color'] ?? null,
                'date_of_birth' => $obj['date_of_birth'] ?? null,
                'weight' => $obj['weight'] ?? null,
                'height' => $obj['height'] ?? null,
                'sex' => $obj['sex'] ?? null,
                'spayed_neutered' => $obj['spayed_neutered'] ?? null,
                'vaccination_status' => $obj['vaccination_status'] ?? null,
                'temperament' => $obj['temperament'] ?? null, // stored as JSON string
                'skills' => $obj['skills'] ?? null,           // stored as JSON string
                'favorite_food' => $obj['favorite_food'] ?? null,
                'story_background' => $obj['story_background'] ?? null,
                'rescue_status' => $obj['rescue_status'] ?? null,
                'health_status' => $obj['health_status'] ?? null,
                'medical_needs' => $obj['medical_needs'] ?? null,
                'date_rescued' => $obj['date_rescued'] ?? null,
                'primary_image' => $obj['primary_image'] ?? 0,
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            $animal_id = $obj['animal_id'];

            $this->db->where('animal_id', $animal_id);
            $updated = $this->db->update('tbl_animal_info', $update_values);

            if ($updated) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Animal info updated successfully',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update animal info',
                    'method' => 'PUT'
                ]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Missing Animal info in the payload']);
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
