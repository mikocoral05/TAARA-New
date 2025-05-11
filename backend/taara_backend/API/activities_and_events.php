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

        if (array_key_exists('get_activities_and_events', $payload)) {

            $this->db->where("is_deleted", 0);
            $data = $this->db->get("tbl_activities_and_events");

            // foreach ($animalRows as &$animal) {
            //     $galleryIds = json_decode($animal['image_gallery'], true);

            //     if (is_array($galleryIds) && count($galleryIds)) {
            //         $this->db->where('id', $galleryIds, 'IN');
            //         $files = $this->db->get('tbl_files');

            //         $paths = array_column($files, 'image_path');
            //         $animal['image_gallery'] = $paths;
            //     } else {
            //         $animal['image_gallery'] = [];
            //     }
            // }

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
        if (isset($payload['save_activities_and_events'])) {
            $data = $payload['save_activities_and_events'];

            $insertData = [
                'title'               => $data['title'] ?? null,
                'details'            => $data['details'] ?? null,
                'date'              => $data['date'] ?? null,
                'time'      => $data['time'] ?? null,
                'duration'          => $data['duration'] ?? null,
                'days'          => $data['days'] ?? null,
                'bgcolor'                => $data['bgcolor'] ?? null,
                'icon'             => $data['icon'] ?? null,
            ];

            $insert = $this->db->insert('tbl_activities_and_events', $insertData);
            $id = $this->db->getInsertId();

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Activities and Events successfully added',
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
