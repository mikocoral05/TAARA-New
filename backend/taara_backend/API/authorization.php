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
        if (isset($payload["get_user_by_type"])) {
            $type = $payload['get_user_by_type'];

            // Define columns to fetch
            $columns = [
                'tbl_users.user_id',
                'tbl_users.user_type',
                'tbl_users.image_path',
                'tbl_users.first_name',
                'tbl_users.middle_name',
                'tbl_users.last_name',
                'tbl_users.suffix',
                'tbl_users.Bio',
                'tbl_users.birth_date',
                'tbl_users.email_address',
                'tbl_users.phone_number',
                'tbl_users.civil_status',
                'tbl_users.occupation',
                'tbl_users.street',
                'tbl_users.brgy_name',
                'tbl_users.city_municipality',
                'tbl_users.province',
                'tbl_users.sex',
                'tbl_users.date_created',
                'tbl_users.date_archieve'
            ];

            // Add tbl_official_position columns if the type is 3
            if ($type == 3) {
                $columns[] = 'tbl_official_position.position_title';
                $columns[] = 'tbl_official_position.position_description';
                $this->db->join('tbl_official_position', 'tbl_users.roles = tbl_official_position.id', 'left');
            }
            if ($type == 2) {
                $columns[] = 'tbl_volunteer_position.position_title';
                $columns[] = 'tbl_volunteer_position.position_description';
                $this->db->join('tbl_volunteer_position', 'tbl_users.roles = tbl_volunteer_position.id', 'left');
            }

            // Perform the query with the selected columns and join
            $this->db->where('tbl_users.user_type', $type);
            $query = $this->db->get("tbl_users", null, $columns);

            // Respond with success and the query data
            echo json_encode([
                'status' => 'success',
                'data' => $query,
                'method' => 'GET'
            ]);
        } else {
            // Return error if 'get_user_by_type' is not provided
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing parameter: get_user_by_type'
            ]);
        }
    }


    public function httpPost($payload)
    {
        $datas = json_encode($payload);
        $ref_id = json_decode($datas, true);
    }
    public function httpPut($payload)
    {
        $datas = json_encode($payload);
        $ref_id = json_decode($datas, true);
    }
    public function httpDelete($payload)
    {
        $datas = json_encode($payload);
        $arr = json_decode($datas, true);
        $del = idate("U");
    }
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
