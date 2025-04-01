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
        if (isset($_GET['user_id'])) {
            $this->db->where('user_id', $_GET['user_id']);
            $user = $this->db->get('tbl_users_new');
            unset($user[0]['password']);

            echo json_encode(array(
                'status' => 'success',
                'data' => $user[0],
                'method' => 'GET'
            ));
        } else if (isset($_GET['email_address'])) {
            $this->db->where('email_address', $_GET['email_address']);
            $email_check = $this->db->get('tbl_users_new');

            if ($email_check === []) {
                echo json_encode(array(
                    'status' => 'success',
                    'message' => 'Email is Available',
                    'method' => 'GET'
                ));
            } else {
                echo json_encode(array(
                    'status' => 'fail',
                    'message' => 'Email is already taken',
                    'method' => 'GET'
                ));
            }
        }
    }
    public function httpPost($payload)
    {
        $payload = (array) $payload;

        //FOR SIGNUP
        if (isset($payload['last_name'])) {
            $payload['date_added'] = date('Y-m-d');
            $password = password_hash($payload['password'], PASSWORD_DEFAULT);
            $payload['password'] = $password;
            $payload['user_id'] = $this->db->insert('tbl_users_new', $payload);

            echo json_encode(array(
                'status' => 'success',
                'data' => $payload,
                'method' => 'POST'
            ));

            //FOR LOGIN
        } else if (isset($payload['email_address'])) {
            $this->db->where('email_address', $payload['email_address']);
            $attempt = $this->db->get('tbl_users_new');


            if ($attempt === []) {
                echo json_encode(array(
                    'status' => 'fail',
                    'message' => 'Email address not found',
                    'method' => 'POST'
                ));
            } else {
                if (password_verify($payload['password'], $attempt[0]['password'])) {
                    unset($attempt[0]['password']);
                    echo json_encode(array(
                        'status' => 'success',
                        'data' => $attempt[0],
                        'method' => 'POST'
                    ));
                } else {
                    echo json_encode(array(
                        'status' => 'fail',
                        'message' => 'Incorrect password!',
                        'method' => 'POST'
                    ));
                }
            }
        }
    }

    public function httpPut($payload)
    {
        $payload = (array) $payload;

        //UPDATE USER INFO
        if (isset($payload['user_id'])) {
            $this->db->where('user_id', $payload['user_id']);

            if (isset($payload['password'])) {
                $password = password_hash($payload['password'], PASSWORD_DEFAULT);
                $payload['password'] = $password;
            }

            $user = $this->db->update('tbl_users_new', $payload);

            echo json_encode(array(
                'status' => 'success',
                'data' => $payload,
                'method' => 'PUT'
            ));

            //FORGOT PASSWORD
        } else if (isset($payload['reset_password'])) {

            $password = password_hash($payload['reset_password'], PASSWORD_DEFAULT);

            $this->db->where('email_address', $payload['email_address']);
            $user = $this->db->update('tbl_users_new', array('password' => $password));

            echo json_encode(array(
                'status' => 'success',
                'message' => 'Password has been reset',
                'method' => 'POST'
            ));
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
