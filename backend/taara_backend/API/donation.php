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
            $this->db->join('tbl_files tbl4', 'tbl1.file_id = tbl4.id', 'LEFT');

            $this->db->where("tbl1.donation_type", $type);
            $this->db->where("tbl1.is_deleted", 0);
            $this->db->where("tbl1.status", 2);

            // Specific columns you want to select
            $columns = "tbl1.*, tbl2.*, tbl3.first_name as donor_name,tbl4.image_path";
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
            $table = $payload['add_donation']['donation_type'] == 'cash' ? 'tbl_cash_donations' : 'tbl_material_donations';

            $insertData = [
                'donor_id'         => $data['donor_id'] ?? null,
                'donor_name'         => $data['donor_name'] ?? null,
                'donation_type'    => $data['donation_type'],
                'allocated_for'      => $data['allocated_for'] ?? null,
                'received_date'      => $data['received_date'] ?? date('Y-m-d'),
                'anonymous'          => $data['anonymous'] ?? null,
                'created_by'          => $data['created_by'] ?? null,
            ];

            $insertMain = $this->db->insert('tbl_funds', $insertData);
            $id = $this->db->getInsertId();

            $insertData2 = [];

            if ($data['donation_type'] === 'cash') {
                $insertData2 = [
                    'fund_id'        => $id,
                    'amount'         => $data['amount'] ?? 0,
                    'method'         => $data['method'] ?? null,
                    'reference_code' => $data['reference_code'] ?? null,
                    'notes'          => $data['notes'] ?? null,
                ];
            } else {
                $insertData2 = [
                    'fund_id'        => $id,
                    'item_name'      => $data['item_name'],
                    'quantity'       => $data['quantity'] ?? null,
                    'unit'           => $data['unit'] ?? null,
                    'estimated_value' => $data['estimated_value'] ?? null,
                    'item_condition'  => $data['item_condition'] ?? 1,
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
        if (isset($payload['soft_delete_donation'])) {
            $id = $payload['soft_delete_donation'];

            $ids = is_array($id) ? $id : explode(',', $id);

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('fund_id', $ids, 'IN');
            $updated = $this->db->update('tbl_funds', $update_values);

            if ($updated) {
                echo json_encode(['status' => 'success', 'message' => 'Records soft-deleted successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to soft delete records', 'method' => 'PUT']);
            }
        } else if (isset($payload['edit_donation'])) {
            $obj = $payload['edit_donation'];
            $fund_id = $payload['edit_donation']['fund_id'];
            $table = $payload['edit_donation']['donation_type'] == 'cash' ? 'tbl_cash_donations' : 'tbl_material_donations';
            $new_img =  $obj['new_image'] ?? '';
            $last_insert_id = "";
            if (!empty($new_img)) {
                $this->db->insert('tbl_files', ['image_path' => $new_img]);
                $last_insert_id = $this->db->getInsertId();
            }

            $updateData = [
                'donor_name'         => $obj['donor_name'] ?? null,
                'allocated_for'      => $obj['allocated_for'] ?? null,
                'received_date'      => $obj['received_date'] ?? null,
                'anonymous'          => $obj['anonymous'] ?? null,
                'status'             => $obj['status'] ?? 1,
                'updated_at' => date('Y-m-d H:i:s')

            ];

            if (!empty($last_insert_id)) {
                $updateData['file_id'] = $last_insert_id;
            }

            $this->db->where('fund_id', $fund_id);
            $this->db->update('tbl_funds', $updateData);

            $uppateArr = [];

            if ($obj['donation_type'] === 'cash') {
                $uppateArr = [
                    'amount'         => $obj['amount'],
                    'method'         => $obj['method'] ?? null,
                    'reference_code' => $obj['reference_code'] ?? null,
                    'notes'          => $obj['notes'] ?? null,
                ];
            } else {
                $uppateArr = [
                    'item_name'      => $obj['item_name'],
                    'quantity'       => $obj['quantity'] ?? null,
                    'unit'           => $obj['unit'] ?? null,
                    'estimated_value' => $obj['estimated_value'] ?? null,
                    'item_condition'  => $obj['item_condition'] ?? 1,
                    'notes'          => $obj['notes'] ?? null,
                ];
            }


            $this->db->where('fund_id', $fund_id);
            $updated = $this->db->update($table, $uppateArr);



            if ($updated) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Donation info updated successfully',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update Donation info',
                    'method' => 'PUT'
                ]);
            }
        } else if (isset($payload['update_image'])) {
            $array_link = $payload['update_image']['array_link'];
            $fund_id = $payload['update_image']['id'];

            // Get the first value of the array
            $first_link = is_array($array_link) ? reset($array_link) : null;

            $this->db->insert('tbl_files', ['image_path'     => $first_link]);
            $id = $this->db->getInsertId();

            $update_values = [
                'file_id'     => $id,
                'updated_at'  => date('Y-m-d H:i:s') // Correct timestamp format
            ];


            $this->db->where('fund_id', $fund_id);
            $updated = $this->db->update('tbl_funds', $update_values);

            if ($updated) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Donation updated successfully',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update Donation info',
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
