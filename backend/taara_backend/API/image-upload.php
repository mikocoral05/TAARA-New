<?php


// Tells the browser to allow code from any origin to access

header("Access-Control-Allow-Origin: *");

// Tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode (Request.credentials) is include

header("Access-Control-Allow-Credentials: true");

// Specifies one or more methods allowed when accessing a resource in response to a preflight request

header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");

// Used in response to a preflight request which includes the Access-Control-Request-Headers to indicate which HTTP headers can be used during the actual request

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
        $datas = json_encode($payload);
        $ref_id = json_decode($datas, true);
    }
    public function httpPost($payload)
    {
        $datas = json_encode($payload);
        $arr = json_decode($datas, true);
        var_export($payload);
        if (array_key_exists("user_image", $arr)) {
            $id = $arr['user_id'];
            $query_compar = $this->db->rawQuery("SELECT * FROM tbl_user_image  WHERE user_id = $id ");

            $array_of_insert = array(
                "user_id" => $arr["user_id"],
                "user_image" => $arr["user_image"],
                "id" => $arr["id"],
            );
            if (Count($query_compar) == 0) {
                $this->db->insert('tbl_user_image', $array_of_insert);
                // $query = $this->db->rawQuery("SELECT * FROM tbl_users");
                // echo json_encode(('Welcome to KA-TAARA!'));
                // echo json_encode( "Welcome KA-TAARA!");
            } else {
                $data = array(
                    // 'user_id' => $id,
                    'user_image' => $arr['user_image'],

                );
                $this->db->where('user_id', $id);
                if ($this->db->update('tbl_user_image', $data))
                    echo $this->db->count . ' records were updated';
                else
                    echo 'update failed: ' . $this->db->getLastError();
            }
        }
    }
    public function httpPut($payload)
    {
        // $this->db->update();
        $datas = json_encode($payload);
        $arr = json_decode($datas, true);
        // update function

    }
    public function httpDelete($payload)
    {
        // $this->db->delete();
        echo json_encode(array('method' => 'DFLETE'));
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
