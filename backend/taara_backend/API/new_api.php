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
        if (array_key_exists('get_monthly_donation', $payload)) {
            $month = $payload['get_monthly_donation']['month'];
            $year = $payload['get_monthly_donation']['year'];

            $this->db->where("MONTH(f.received_date)", $month);
            $this->db->where("YEAR(f.received_date)", $year);
            $this->db->where("f.status", 2);
            $this->db->join("tbl_cash_donations cd", "cd.fund_id = f.fund_id", "LEFT");
            $totalCashDonations = $this->db->getValue('tbl_funds f', 'SUM(cd.amount)') ?? 0;

            echo json_encode([
                'status' => 'success',
                'data' => $totalCashDonations,
                'method' => 'GET'
            ]);
        } else  if (array_key_exists('get_pet_transfer_request', $payload)) {
            $user_id = $payload['get_pet_transfer_request'];

            $this->db->where("user_id", $user_id);
            $this->db->orderBy("id", "DESC");
            $query = $this->db->getOne('tbl_pet_transfer');

            echo json_encode([
                'status' => 'success',
                'data' => $query,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_monthly_rescue', $payload)) {
            $month = $payload['get_monthly_rescue']['month'];
            $year = $payload['get_monthly_rescue']['year'];

            $this->db->where("MONTH(report_date)", $month);
            $this->db->where("YEAR(report_date)", $year);
            $this->db->where("is_deleted", 0);
            $total_rescue = $this->db->get('tbl_rescue_report');

            echo json_encode([
                'status' => 'success',
                'data' => count($total_rescue),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_monthly_adoption', $payload)) {
            $month = $payload['get_monthly_adoption']['month'];
            $year = $payload['get_monthly_adoption']['year'];

            $this->db->where("MONTH(af.updated_at)", $month);
            $this->db->where("YEAR(af.updated_at)", $year);
            $this->db->where("af.adoption_status", 4);
            $this->db->where("ai.is_deleted", 1);
            $this->db->join('tbl_animal_info ai', 'ai.animal_id = af.animal_id', 'left');
            $total_adopted = $this->db->get('tbl_adoption_form af');

            echo json_encode([
                'status' => 'success',
                'data' => count($total_adopted),
                'method' => 'GET'
            ]);
        } else if (array_key_exists("get_monthly_donation_by_year", $payload)) {
            $year = $payload['get_monthly_donation_by_year']['year'];
            $query = $this->db->rawQuery("
            SELECT all_dates.year, all_dates.month, IFNULL(SUM(cd.amount), 0) AS total_donation
            FROM (
                SELECT year, month FROM
                (SELECT (SELECT YEAR(MIN(received_date)) FROM tbl_funds) + a AS year FROM
                (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b) years,
                (SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
                        UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) months
            ) AS all_dates
            LEFT JOIN tbl_funds AS f 
            ON all_dates.year = YEAR(f.received_date) 
            AND all_dates.month = MONTH(f.received_date) 
            AND f.is_deleted = 0
            AND f.status = 2
            LEFT JOIN tbl_cash_donations AS cd 
            ON cd.fund_id = f.fund_id
            WHERE all_dates.year = ?
            GROUP BY all_dates.year, all_dates.month
            ORDER BY all_dates.year, all_dates.month;
            ", [$year]);

            echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
        } else if (array_key_exists("public_user_id", $payload)) {
            $user_id = $payload['public_user_id'];

            $columns = [
                'u.user_id',
                'u.user_type',
                'u.first_name',
                'u.middle_name',
                'u.last_name',
                'u.suffix',
                'u.Bio',
                'u.birth_date',
                'u.email_address',
                'u.phone_number',
                'u.civil_status',
                'u.occupation',
                'u.street',
                'u.brgy_name',
                'u.city_municipality',
                'u.province',
                'u.sex',
                'u.username',
                'u.date_created',
                'u.is_activated',
                'f.image_path AS image_path'
            ];

            $this->db->where('u.user_id', $user_id);
            $this->db->where('u.user_type', 1);
            $this->db->join('tbl_files f', 'u.image_id = f.id', 'left');
            $query = $this->db->getOne('tbl_users u', null, $columns);

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
        if (isset($payload['add_schedule'])) {
            $data = $payload['add_schedule'];

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
        } else if (isset($payload['submit_pet_transfer'])) {
            $image = $payload['submit_pet_transfer']['new_image'];
            $data = $payload['submit_pet_transfer'];

            if ($image) {
                // 1. Save the image
                $this->db->insert('tbl_files', ['image_path' => $image]);
                $image_id = $this->db->getInsertId();

                // 2. Cleanup: remove 'new_image' from data before insert
                unset($data['new_image']);

                // 3. Set image ID reference
                $data['image_of_owner_and_pet'] = $image_id;
                $data['status'] = 1;

                // 4. Insert to tbl_pet_transfer
                $update = $this->db->insert('tbl_pet_transfer', $data);

                if ($update) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Pet transfer form submitted successfully',
                        'method' => 'POST'
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Failed to submit Pet transfer form',
                        'method' => 'POST'
                    ]);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'No image provided',
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
            $id = $payload['soft_delete_schedule'];

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
        } else if (isset($payload['update_public_user_details'])) {
            $user_id = $payload['update_public_user_details']['user_id'];
            $new_image = $payload['update_public_user_details']['new_image'] ?? '';
            $image_id = '';

            if ($new_image) {
                $this->db->insert('tbl_files', ['image_path' => $new_image]);
                $image_id = $this->db->getInsertId();
                $payload['update_public_user_details']['image_id'] = $image_id; // <-- inject image_id to update data
            }

            // Remove 'new_image' from update array if you don't want to store it
            unset($payload['update_public_user_details']['new_image']);

            $this->db->where('user_id', $user_id);
            $update = $this->db->update('tbl_users', $payload['update_public_user_details']);

            if ($update) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'User data updated successfully',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update User data',
                    'method' => 'PUT'
                ]);
            }
        } else if (isset($payload['update_publicuser_email_address'])) {
            $user_id = $payload['update_publicuser_email_address']['user_id'];
            $email_address = $payload['update_publicuser_email_address']['new_email_address'];

            $this->db->where('user_id', $user_id);
            $update = $this->db->update('tbl_users', ['email_address' => $email_address]);

            if ($update) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Email address updated successfully',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update Email address',
                    'method' => 'PUT'
                ]);
            }
        } else if (isset($payload['update_password'])) {
            $user_id = $payload['update_password']['user_id'];
            $new_password = $payload['update_password']['new_password'];
            $hashedPassword = password_hash($new_password, PASSWORD_DEFAULT);

            $update_values = [
                'password' => $hashedPassword,
            ];
            $this->db->where('user_id', $user_id);
            $update = $this->db->update('tbl_users', $update_values);

            if ($update) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Password updated successfully',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update Password',
                    'method' => 'PUT'
                ]);
            }
        } else if (isset($payload['update_public_user_image'])) {
            $image = $payload['update_public_user_image']['new_image'];
            $user_id = $payload['update_public_user_image']['user_id'];
            $image_id = '';
            if ($image) {
                $this->db->insert('tbl_files', ['image_path' => $image]);
                $image_id = $this->db->getInsertId();

                $update_values = ['image_id' => $image_id];
                $this->db->where('user_id', $user_id);
                $update = $this->db->update('tbl_users', $update_values);

                if ($update) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'User image updated successfully',
                        'method' => 'PUT'
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Failed to update user image',
                        'method' => 'PUT'
                    ]);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'No image provided',
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
