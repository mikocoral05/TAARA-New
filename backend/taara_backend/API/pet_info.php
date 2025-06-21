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
        $this->db = new MysqliDB('localhost', 'mike', 'mike123', 'capstone');
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
            $data = $payload['save_animal_list']['animalData'];
            $user_id = $payload['save_animal_list']['user_id'];
            $user_type = $payload['save_animal_list']['user_type'];
            $user_name = $payload['save_animal_list']['user_name'];

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
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Create pet record',
                    'module' => 'Pet Info',
                ];
                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'New Pet added',
                    'message'      => 'A new pet was added by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);

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


    public function httpPut($payload)
    {
        if (isset($payload['soft_delete_animal_info'])) {
            $id = $payload['soft_delete_animal_info']['arrayId'];
            $user_id = $payload['soft_delete_animal_info']['user_id'];
            $user_type = $payload['soft_delete_animal_info']['user_type'];
            $user_name = $payload['soft_delete_animal_info']['user_name'];

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
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Archive pet record',
                    'module' => 'Pet Info',
                ];
                $this->db->insert("tbl_logs", $logs);


                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Archive a Pet record',
                    'message'      => 'A Pet record was archive by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);

                echo json_encode(['status' => 'success', 'message' => 'Records Archive successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to Archive records', 'method' => 'PUT']);
            }
        } else if (isset($payload['edit_animal_info'])) {
            $obj = $payload['edit_animal_info']['animal_data'];
            $animal_name = $obj['name'];
            $user_id = $payload['edit_animal_info']['user_id'];
            $user_type = $payload['edit_animal_info']['user_type'];
            $user_name = $payload['edit_animal_info']['user_name'];

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
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            $animal_id = $obj['animal_id'];

            $this->db->where('animal_id', $animal_id);
            $updated = $this->db->update('tbl_animal_info', $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Update pet record name ' . $animal_name,
                    'module' => 'Pet Info',
                ];

                $this->db->insert("tbl_logs", $logs);


                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Update Pet record',
                    'message'      => 'A Pet record was updated by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);


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
        } else if (isset($payload['update_image'])) {
            $imgs = $payload['update_image'];
            $id = $payload['id'];
            $existing_primary_id = $payload['existing_id'] ?? [];

            $file_ids = [];

            foreach ($imgs as $img) {
                $insertData = ['image_path' => $img];  // Replace 'file_url' with your actual column name
                $this->db->insert('tbl_files', $insertData);
                $insert_id = $this->db->getInsertId();
                if ($insert_id) {
                    $file_ids[] = $insert_id;
                }
            }

            $update_values = [
                'image_gallery' => json_encode(array_merge($file_ids, $existing_primary_id)),
                'primary_image' => $file_ids[0] ?? ($existing_primary_id[0] ?? null),
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            $this->db->where('animal_id', $id);
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
        } else if (isset($payload['update_health_status'])) {
            $obj = $payload['update_health_status']['obj'];
            $user_id = $payload['update_health_status']['user_id'];
            $user_type = $payload['update_health_status']['user_type'];
            $user_name = $payload['update_health_status']['user_name'];

            $update_values = [
                'health_status' => $obj['health_status'] ?? null,
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            $animal_id = $obj['animal_id'];
            $animal_name = $obj['name'];

            $this->db->where('animal_id', $animal_id);
            $updated = $this->db->update('tbl_animal_info', $update_values);

            $map = [
                1 => 'Ready for Adoption',
                2 => 'Under Rehabilitation',
                3 => 'Under Medication',
                4 => 'Deceased'
            ];


            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => $animal_name . ' was move to ' . $map[$obj['health_status']],
                    'module' => 'Pet Info',
                ];

                $this->db->insert("tbl_logs", $logs);


                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Update Pet record',
                    'message'      => $animal_name . ' was move to ' . $map[$obj['health_status']] . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);


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
