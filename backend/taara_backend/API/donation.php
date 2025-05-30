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

        if (array_key_exists('get_donation', $payload)) {
            $type = $payload['get_donation'];

            if ($type == 'cash') {
                $this->db->join('tbl_cash_donations tbl2', 'tbl1.fund_id = tbl2.fund_id', 'LEFT');
            } else {
                $this->db->join('tbl_material_donations tbl2', 'tbl1.fund_id = tbl2.fund_id', 'LEFT');
            }

            $this->db->join('tbl_users tbl3', 'tbl1.donor_id = tbl3.user_id', 'LEFT');

            $this->db->where("tbl1.donation_type", $type);
            $this->db->where("tbl1.is_deleted", 0);

            // Specific columns you want to select
            $columns = "tbl1.*, tbl2.*, tbl3.first_name as donor_name";
            $data = $this->db->get("tbl_funds tbl1", null, $columns);

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
        if (isset($payload['add_donation'])) {
            $data = $payload['add_donation'];
            $table = $payload['donation_type'] == 'cash' ? 'tbl_cash_donations' : 'tbl_material_donations';

            $insertData = [
                'donor_name'         => $data['donor_name'] ?? null,
                'donation_type	'    => $data['donation_type'],
                'allocated_for'      => $data['allocated_for'] ?? null,
                'received_date'      => $data['received_date'] ?? null,
                'anonymous'          => $data['anonymous'] ?? null,
            ];

            $insertMain = $this->db->insert('tbl_funds', $insertData);
            $id = $this->db->getInsertId();

            $insertData2 = [];

            if ($payload['donation_type'] === 'cash') {
                $insertData2 = [
                    'fund_id'        => $id,
                    'amount'         => $data['amount'],
                    'method'         => $data['method'] ?? null,
                    'reference_code' => $data['reference_code'] ?? null,
                    'received_by'    => $data['received_by'] ?? null,
                    'notes'          => $data['notes'] ?? null,
                ];
            } else {
                $insertData2 = [
                    'fund_id'        => $id,
                    'item_name'      => $data['item_name'],
                    'quantity'       => $data['quantity'] ?? null,
                    'unit'           => $data['unit'] ?? null,
                    'estimated_value' => $data['estimated_value'] ?? null,
                    'received_by'     => $data['received_by'] ?? null,
                    'item_condition'  => $data['item_condition'] ?? null,
                    'notes'          => $data['notes'] ?? null,
                ];
            }


            $this->db->insert($table, $insertData2);


            if ($insertMain) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Donation info successfully added',
                    'method' => 'POST',
                    'id' => $id
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to save Donation info',
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
