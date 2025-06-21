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

    public function httpPost($payload)
    {
        if (isset($_FILES['files'])) {
            $files = $_FILES['files'];
            $animal_id = $_POST['animal_id'] ?? null; // get animal_id from the form
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

                    $insertData = [
                        'image_path' => $pathForDB,
                        'type' => $files['type'][$index],
                        'size' => $files['size'][$index],
                    ];

                    $this->db->insert('tbl_files', $insertData);
                    $id = $this->db->getInsertId();
                    if ($id) {
                        $insertedIds[] = $id;
                    }
                }

                // ✅ Update tbl_animal_info *once* if animal_id is set and images were uploaded
                if ($animal_id && !empty($insertedIds)) {
                    $update_values = [
                        'primary_image' => $insertedIds[0],
                        'image_gallery' => json_encode($insertedIds),
                        'updated_at' => date('Y-m-d H:i:s')
                    ];

                    $this->db->where('animal_id', $animal_id);
                    $this->db->update('tbl_animal_info', $update_values);
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
}

/* END OF CLASS */


$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];


$api = new API;



if ($request_method === 'GET') {
    $api->httpGet($_GET);
} elseif ($request_method === 'POST') {
    $api->httpPost($_POST); // ✅ This works for normal form data
} elseif ($request_method === 'PUT') {
    $received_data = json_decode(file_get_contents('php://input'), true);
    $api->httpPut($received_data);
} elseif ($request_method === 'DELETE') {
    $received_data = json_decode(file_get_contents('php://input'), true);
    $api->httpDelete($received_data);
}
