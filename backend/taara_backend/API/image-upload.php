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

    public function httpGet($payload) {}
    public function httpPost($payload)
    {
        if (isset($_FILES['files'])) {
            $files = $_FILES['files'];
            $keys = $_POST['__key'] ?? []; // optional linking keys
            $uploadDir = '../files/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $insertedIds = [];

            foreach ($files['tmp_name'] as $index => $tmpName) {
                if (!is_uploaded_file($tmpName)) continue;

                $originalName = $files['name'][$index];
                $ext = pathinfo($originalName, PATHINFO_EXTENSION);
                $uniqueFilename = 'animal_' . time() . '_' . uniqid() . '.' . $ext;
                $uploadPath = $uploadDir . $uniqueFilename;

                if (move_uploaded_file($tmpName, $uploadPath)) {
                    $pathForDB = $uniqueFilename; // or full path if needed
                    $key = $keys[$index] ?? null;

                    $insertData = [
                        'image_path' => $pathForDB,
                    ];

                    $id = $this->db->insert('tbl_files', $insertData);
                    if ($id) {
                        $insertedIds[] = $id;
                    }
                }
            }

            if (!empty($insertedIds)) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Files uploaded and saved',
                    'inserted_ids' => $insertedIds
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'No files were successfully uploaded'
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'No files received'
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
