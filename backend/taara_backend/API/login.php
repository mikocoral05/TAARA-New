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
        if (array_key_exists('login', $payload)) {
            $username_or_email = $payload['login']['username'];
            $password = $payload['login']['password'];

            $this->db->where("u.is_deleted", 1);
            $this->db->where("u.is_activated", 1);
            $this->db->where("(u.username = ? OR u.email_address = ?)", [$username_or_email, $username_or_email]);
            $this->db->join("tbl_files f", "f.id = u.image_id", "LEFT");

            $user = $this->db->getOne("tbl_users u", null, "u.*, f.image_path");

            if ($user && password_verify($password, $user['password'])) {
                $position_title = null;

                if ($user['roles_type'] == 1) {
                    $this->db->where("id", $user['roles']);
                    $position = $this->db->getOne("tbl_official_position", "position_title, id as admin_id");
                    $position_title = $position['position_title'];
                    $user['admin_id'] = $position['admin_id'];
                } else if ($user['roles_type'] == 2) {
                    $this->db->where("id", $user['roles']);
                    $position = $this->db->getOne("tbl_volunteer_position", "position_title, id as volunteer_id");
                    $position_title = $position['position_title'];
                    $user['volunteer_id'] = $position['volunteer_id'];
                }

                $user['position_title'] = $position_title;
                $logs = [
                    'user_id' => $user['user_id'],
                    'user_type' => $user['user_type'],
                    'action' => 'User logged in',
                    'module' => 'Login',
                ];
                $this->db->insert("tbl_logs", $logs);
                echo json_encode([
                    'status' => 'success',
                    'data' => $user,
                    'method' => 'GET'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid credentials',
                    'method' => 'GET'
                ]);
            }
        } else if (array_key_exists('get_animal_option', $payload)) {

            $this->db->where("is_deleted", 1);
            $data = $this->db->get("tbl_animal_info", null, "animal_id,name");

            echo json_encode([
                'status' => 'success',
                'data' => $data,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('check_phone_number', $payload)) {
            $phone_number = $payload['check_phone_number'];
            $this->db->where("phone_number", $phone_number);
            $data = $this->db->get("tbl_users", null);

            echo json_encode([
                'status' => 'success',
                'data' => count($data),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('check_email_address', $payload)) {
            $email_address = $payload['check_email_address'];
            $this->db->where("email_address", $email_address);
            $data = $this->db->get("tbl_users", null);

            echo json_encode([
                'status' => 'success',
                'data' => count($data),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('check_username', $payload)) {
            $username = $payload['check_username'];
            $this->db->where("username", $username);
            $data = $this->db->get("tbl_users", null);

            echo json_encode([
                'status' => 'success',
                'data' => count($data),
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
        } else if (isset($payload['register_user'])) {
            $data = $payload['register_user'];
            $password = $payload['register_user']['password'];
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $data['is_activated'] = 1;
            $data['password'] = $hashedPassword;
            $insert = $this->db->insert('tbl_users', $data);

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Registration successfully!',
                    'method' => 'POST',
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to register',
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
        if (isset($payload['change_password'])) {
            $password = trim($payload['change_password']['password']);
            $toWhere = trim($payload['change_password']['username']);
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Fetch user first
            $this->db->where("phone_number", $toWhere);
            $this->db->orWhere("email_address", $toWhere);
            $user = $this->db->getOne("tbl_users", "user_id,user_type");

            if ($user) {
                $update_values = ['password' => $hashedPassword];

                $this->db->where("user_id", $user['user_id']); // safer to use ID than ambiguous phone/email
                $updated = $this->db->update('tbl_users', $update_values);
                if ($updated) {
                    $logs = [
                        'user_id' => $user['user_id'],
                        'user_type' => $user['user_type'],
                        'action' => 'User Change password',
                        'module' => 'Login (Forgot password)',
                    ];

                    $this->db->insert("tbl_logs", $logs);
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Password updated successfully',
                        'updated_id' => $user['user_id'],
                        'method' => 'PUT'
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Failed to update password',
                        'method' => 'PUT'
                    ]);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'User not found',
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
