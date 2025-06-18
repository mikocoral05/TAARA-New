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

        if (array_key_exists('get_activities_and_events', $payload)) {

            $this->db->where("ae.is_deleted", 0);
            $this->db->join("tbl_files f", 'f.id = ae.image_id', 'left');
            $data = $this->db->get("tbl_activities_and_events ae", null, 'ae.*,f.image_path');


            echo json_encode([
                'status' => 'success',
                'data' => $data,
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
        if (isset($payload['save_activities_and_events'])) {
            $data = $payload['save_activities_and_events']['data'];
            $user_id = $payload['save_activities_and_events']['user_id'];
            $user_type = $payload['save_activities_and_events']['user_type'];

            $new_image = $data['new_image'] ?? '';
            $image_id = '';

            // Insert new image if provided
            if ($new_image) {
                $this->db->insert('tbl_files', ['image_path' => $new_image]);
                $image_id = $this->db->getInsertId();
            }
            $insertData = [
                'title'               => $data['title'] ?? null,
                'details'            => $data['details'] ?? null,
                'date'              => $data['date'] ?? null,
                'time'      => $data['time'] ?? null,
                'duration'          => $data['duration'] ?? null,
                'days'          => $data['days'] ?? null,
                'bgcolor'                => $data['bgcolor'] ?? null,
                'icon'             => $data['icon'] ?? null,
            ];
            // Conditionally include img_id
            if ($image_id) {
                $insertData['image_id'] = $image_id;
            }

            $insert = $this->db->insert('tbl_activities_and_events', $insertData);
            $id = $this->db->getInsertId();

            if ($insert) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Add New Event',
                    'module' => 'Activities and Events',
                ];

                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => -3, // Example: -1 = all public_user, -2 = all management
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'New Event',
                    'message'      =>  $data['title'],
                    'type'         => 1, // 1 = announcement, 2 = notification
                    'related_url'  => '/public/activitiesAndEvents?id=' . $id,
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);



                echo json_encode([
                    'status' => 'success',
                    'message' => 'Activities and Events successfully added',
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
        if (isset($payload['soft_delete_activities_and_events'])) {
            $id = $payload['soft_delete_activities_and_events']['arrayId'];
            $user_id = $payload['soft_delete_activities_and_events']['user_id'];
            $user_type = $payload['soft_delete_activities_and_events']['user_type'];

            $ids = is_array($id) ? $id : explode(',', $id);

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update('tbl_activities_and_events', $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Archive Activities Events',
                    'module' => 'Activities and Events',
                ];

                $this->db->insert("tbl_logs", $logs);
                echo json_encode(['status' => 'success', 'message' => 'Records Archive successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to Archive records', 'method' => 'PUT']);
            }
        } else if (isset($payload['edit_activities_and_events'])) {
            $obj = $payload['edit_activities_and_events']['data'];
            $user_id = $payload['edit_activities_and_events']['user_id'];
            $user_type = $payload['edit_activities_and_events']['user_type'];

            $new_image = $obj['new_image'] ?? '';
            $image_id = '';

            // Insert new image if provided
            if ($new_image) {
                $this->db->insert('tbl_files', ['image_path' => $new_image]);
                $image_id = $this->db->getInsertId();
            }

            $update_values = [
                'title'      =>  $obj['title'] ?? null,
                'details'    =>  $obj['details'] ?? null,
                'date'       =>  $obj['date'] ?? null,
                'time'       =>  $obj['time'] ?? null,
                'duration'   =>  $obj['duration'] ?? null,
                'days'       =>  $obj['days'] ?? null,
                'bgcolor'    =>  $obj['bgcolor'] ?? null,
                'icon'       =>  $obj['icon'] ?? null,
                'updated_at' =>  $obj['updated_at'] ?? date('Y-m-d H:i:s'),
            ];


            // Conditionally include img_id
            if ($image_id) {
                $update_values['image_id'] = $image_id;
            }

            $id = $obj['id'];

            $this->db->where('id', $id);
            $updated = $this->db->update('tbl_activities_and_events', $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Update Activities Events ' .  $obj['title'],
                    'module' => 'Activities and Events',
                ];

                $this->db->insert("tbl_logs", $logs);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Activities and Events info updated successfully',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update Activities and Events info',
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
