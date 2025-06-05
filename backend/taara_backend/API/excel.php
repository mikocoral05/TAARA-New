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

        if (array_key_exists('get_animal_list', $payload)) {
            $category = $payload['get_animal_list'];

            $this->db->join("tbl_files f", "f.id = tbl_animal_info.primary_image", "LEFT");
            $this->db->where("is_deleted", 1);
            $this->db->where("health_status", $category);

            // ✅ Add column selection with alias
            $animalRows = $this->db->get("tbl_animal_info", null, "tbl_animal_info.*, f.image_path AS primary_image");


            foreach ($animalRows as &$animal) {
                $galleryIds = json_decode($animal['image_gallery'], true);

                if (is_array($galleryIds) && count($galleryIds)) {
                    $this->db->where('id', $galleryIds, 'IN');
                    $files = $this->db->get('tbl_files');

                    $fileObjects = array_map(function ($file) {
                        return [
                            'name' => $file['image_path'],
                            'type' => $file['type'],
                            'size' => $file['size'],
                            'id' => $file['id']
                        ];
                    }, $files);

                    $animal['file'] = $fileObjects; // ✅ renamed key
                } else {
                    $animal['file'] = []; // ✅ renamed key
                }

                // Optional: remove the original image_gallery if you want
                unset($animal['image_gallery']);
            }


            echo json_encode([
                'status' => 'success',
                'data' => $animalRows,
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
        if (isset($payload['save_animal_list'])) {
            $data = $payload['save_animal_list'];

            $insertData = [
                'name'               => $data['name'] ?? null,
                'species'            => $data['species'] ?? null,
                'breed'              => $data['breed'] ?? null,
                'date_of_birth'      => $data['date_of_birth'] ?? null,
                'fur_color'          => $data['fur_color'] ?? null,
                'eye_color'          => $data['eye_color'] ?? null,
                'sex'                => $data['sex'] ?? null,
                'weight'             => $data['weight'] ?? null,
                'height'             => $data['height'] ?? null,
                'temperament'        => $data['temperament'] ?? null,
                'skills'             => $data['skills'] ?? null,
                'favorite_food'      => $data['favorite_food'] ?? null,
                'health_status'      => $data['health_status'] ?? null,
                'medical_needs'      => $data['medical_needs'] ?? null,
                'spayed_neutered'    => $data['spayed_neutered'] ?? null,
                'vaccination_status' => $data['vaccination_status'] ?? null,
                'rescue_status'      => $data['rescue_status'] ?? null,
                'story_background'   => $data['story_background'] ?? null,
            ];

            $insert = $this->db->insert('tbl_animal_info', $insertData);
            $id = $this->db->getInsertId();

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Animal info successfully added',
                    'method' => 'POST',
                    'id' => $id
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to save animal info',
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
