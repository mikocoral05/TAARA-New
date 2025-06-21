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
            $user_name = $payload['add_schedule']['user_name'];

            $insertData = [
                'animal_id'            => $data['animal_id'] ?? null,
                'schedule_name'               => $data['schedule_name'] ?? null,
                'dose_number'              => $data['dose_number'] ?? null,
                'dose_taken'      => $data['dose_taken'] ?? null,
                'scheduled_date'          => $data['scheduled_date'] ?? null,
                'next_due_interval'          => $data['next_due_interval'] ?? null,
                'next_due_date'                => $data['next_due_date'] ?? null,
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


                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Add New Schedule',
                    'message'      => 'A new schedule was added by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);

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


    public function httpPut($payload) {}


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
