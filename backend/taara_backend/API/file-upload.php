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

    public function httpPost($payload)
    {
        if (isset($_FILES['files'])) {
            $files = $_FILES['files'];

            // 📌 Get passed parameters
            $record_id = $_POST['record_id'] ?? null;
            $table = $_POST['table'] ?? null;
            $id_column = $_POST['id_column'] ?? null;
            $column_to_update = $_POST['column_to_update'] ?? null;

            // Basic validation (🛡️ prevent SQL injection with a whitelist or strict rules)
            $allowedTables = ['tbl_animal_info', 'tbl_user', 'tbl_announcements', 'tbl_rescue_report']; // Add as needed
            if (!in_array($table, $allowedTables) || !$record_id || !$id_column) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid table or parameters'
                ]);
                return;
            }

            $allowedColumns = [
                // 'tbl_animal_info' => ['image_id'],
                'tbl_adoption_form' => ['valid_id'],
                'tbl_announcements' => ['img_id'],
                'tbl_rescue_report' => ['img_id']
            ];

            if (!isset($allowedColumns[$table]) || !in_array($column_to_update, $allowedColumns[$table])) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid column name'
                ]);
                return;
            }


            $uploadDir = '../files/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $insertedIds = [];

            foreach ($files['tmp_name'] as $index => $tmpName) {
                if (!is_uploaded_file($tmpName)) continue;

                $originalName = $files['name'][$index];
                $ext = pathinfo($originalName, PATHINFO_EXTENSION);
                $uniqueFilename = 'file_' . time() . '_' . uniqid() . '.' . $ext;
                $uploadPath = $uploadDir . $uniqueFilename;

                if (move_uploaded_file($tmpName, $uploadPath)) {
                    $insertData = ['image_path' => $uniqueFilename];
                    $this->db->insert('tbl_files', $insertData);
                    $id = $this->db->getInsertId();
                    if ($id) $insertedIds[] = $id;
                }
            }

            if (!empty($insertedIds) && $record_id && $table && $id_column) {
                $update_values = [
                    $column_to_update => count($insertedIds) === 1 ? (string)$insertedIds[0] : json_encode($insertedIds),
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                $this->db->where($id_column, $record_id);
                $this->db->update($table, $update_values);
            }

            echo json_encode([
                'status' => 'success',
                'message' => 'Upload done',
                'inserted_ids' => $insertedIds
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'No files received'
            ]);
        }
    }
}

/* END OF CLASS */



$request_method = $_SERVER['REQUEST_METHOD'];


$api = new API;


$api->httpPost($_POST); // ✅ This works for normal form data
