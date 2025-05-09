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

        if (array_key_exists('get_rescue_report', $payload)) {

            $this->db->where("rr.is_deleted", 0);

            $select = "
                rr.*,
                u.user_id,
                CASE 
                    WHEN rr.reporter_type = 1 THEN CONCAT(u.first_name,' ',u.last_name) 
                    WHEN rr.reporter_type = 2 THEN rr.name
                    ELSE NULL
                END AS name,
                CASE 
                    WHEN rr.reporter_type = 1 THEN u.phone_number 
                    WHEN rr.reporter_type = 2 THEN rr.phone_number
                    ELSE NULL
                END AS phone_number,
                u.last_name,
                f.image_path,
                CASE 
                    WHEN u.user_type = 3 THEN (SELECT position_title FROM tbl_official_position op WHERE op.id = u.roles)
                    WHEN u.user_type = 2 THEN (SELECT position_title FROM tbl_volunteer_position vp WHERE vp.id = u.roles)
                    ELSE NULL
                END AS position_title
            ";

            $this->db->join('tbl_users u', 'u.user_id = rr.reporter_id', 'LEFT');
            $this->db->join('tbl_files f', 'rr.img_id = f.id', 'LEFT');
            $result = $this->db->get('tbl_rescue_report rr', null, $select);

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
        if (isset($payload['add_rescue_report'])) {
            $data = $payload['add_rescue_report'];

            $insertData = [
                'reporter_type'               => $data['reporter_type'] ?? 2,
                'phone_number'            => $data['phone_number'] ?? null,
                'name'              => $data['name'] ?? '',
                'reporter_id'              => $data['reporter_id'] ?? null,
                'animal_type'              => $data['animal_type'] ?? 'Dog',
                'description'              => $data['description'] ?? '',
                'location'              => $data['location'] ?? '',
                'latitude'              => $data['latitude'] ?? null,
                'longitude'              => $data['longitude'] ?? null,
                'status'              => $data['status'] ?? 'pending',
                'rescue_status'              => $data['rescue_status'] ?? 1,
            ];

            $insert = $this->db->insert('tbl_rescue_report', $insertData);
            $id = $this->db->getInsertId();

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Rescue Report info successfully added',
                    'method' => 'POST',
                    'id' => $id
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to save Rescue Report info',
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
        if (isset($payload['soft_delete_rescue_report'])) {
            $id = $payload['soft_delete_rescue_report'];

            $ids = is_array($id) ? $id : explode(',', $id);

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update('tbl_rescue_report', $update_values);

            if ($updated) {
                echo json_encode(['status' => 'success', 'message' => 'Records soft-deleted successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to soft delete records', 'method' => 'PUT']);
            }
        } else if (isset($payload['edit_rescue_report'])) {
            $obj = $payload['edit_rescue_report'];

            $update_values = [
                'phone_number'            => $obj['phone_number'] ?? null,
                'name'              => $obj['name'] ?? '',
                'animal_type'              => $obj['animal_type'] ?? 'Dog',
                'description'              => $obj['description'] ?? '',
                'location'              => $obj['location'] ?? '',
                'latitude'              => $obj['latitude'] ?? null,
                'longitude'              => $obj['longitude'] ?? null,
                'status'              => $obj['status'] ?? 'pending',
                'rescue_status'              => $obj['rescue_status'] ?? 1,
            ];

            $id = $obj['id'];

            $this->db->where('id', $id);
            $updated = $this->db->update('tbl_rescue_report', $update_values);

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
