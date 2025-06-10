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
        if (array_key_exists('get_schedule', $payload)) {

            $this->db->where("p.is_deleted", 0);
            $this->db->join("tbl_users u", "p.added_by = u.user_id", "LEFT");
            $this->db->join("tbl_animal_info a", "a.animal_id = p.animal_id", "LEFT");
            $this->db->join("tbl_files f", "f.id = a.primary_image", "LEFT");
            $data = $this->db->get("tbl_animal_schedule p", null, "p.*, u.first_name, a.name,f.image_path");

            echo json_encode([
                'status' => 'success',
                'data' => $data,
                'method' => 'GET'
            ]);
        } else  if (array_key_exists('get_animal_option', $payload)) {

            $this->db->where("is_deleted", 1);
            $data = $this->db->get("tbl_animal_info", null, "animal_id,name");

            echo json_encode([
                'status' => 'success',
                'data' => $data,
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
        if (isset($payload['add_schedule'])) {
            $data = $payload['add_schedule']['obj'];
            $user_id = $payload['add_schedule']['user_id'];
            $user_type = $payload['add_schedule']['user_type'];

            $insertData = [
                'animal_id'            => $data['animal_id'] ?? null,
                'schedule_name'               => $data['schedule_name'] ?? null,
                'dose_number'              => $data['dose_number'] ?? null,
                'dose_taken'      => $data['dose_taken'] ?? null,
                'scheduled_date'          => $data['scheduled_date'] ?? null,
                'next_due_interval'          => $data['next_due_interval'] ?? null,
                'next_due_date'                => $data['next_due_date'] ?? null,
                'amount'             => $data['amount'] ?? null,
                'notes'             => $data['notes'] ?? null,
                'added_by'   => $data['added_by'] ?? null,
            ];

            $insert = $this->db->insert('tbl_animal_schedule', $insertData);

            if ($insert) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Add New Schedule',
                    'module' => 'Vet Schedule',
                ];

                $this->db->insert("tbl_logs", $logs);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'New Schedule successfully added',
                    'method' => 'POST',
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to new schedule',
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
        if (isset($payload['soft_delete_schedule'])) {
            $id = $payload['soft_delete_schedule']['arrayId'];
            $user_id = $payload['soft_delete_schedule']['user_id'];
            $user_type = $payload['soft_delete_schedule']['user_type'];

            $ids = is_array($id) ? $id : explode(',', $id);

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update('tbl_animal_schedule', $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Update Schedule',
                    'module' => 'Vet Schedule',
                ];

                $this->db->insert("tbl_logs", $logs);
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
