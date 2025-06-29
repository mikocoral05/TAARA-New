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

        if (array_key_exists('get_announcement', $payload)) {

            $this->db->where("a.is_deleted", 0);

            $select = "
                a.*,
                u.user_id,
                u.user_type,
                u.first_name,
                u.last_name,
                f.image_path,
                CASE 
                    WHEN u.user_type = 3 THEN (SELECT position_title FROM tbl_official_position op WHERE op.id = u.roles)
                    WHEN u.user_type = 2 THEN (SELECT position_title FROM tbl_volunteer_position vp WHERE vp.id = u.roles)
                    ELSE NULL
                END AS position_title
            ";

            $this->db->join('tbl_users u', 'u.user_id = a.created_by', 'LEFT');
            $this->db->join('tbl_files f', 'a.img_id = f.id', 'LEFT');
            $result = $this->db->get('tbl_announcements a', null, $select);

            echo json_encode([
                'status' => 'success',
                'data' => $result,
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
        if (isset($payload['add_announcement'])) {
            $data = $payload['add_announcement']['data'];
            $user_id = $payload['add_announcement']['user_id'];
            $user_type = $payload['add_announcement']['user_id'];
            $user_name = $payload['add_announcement']['user_name'];
            $new_image = $data['new_image'] ?? '';

            $image_id = '';

            if ($new_image) {
                $this->db->insert('tbl_files', ['image_path' => $new_image]);
                $image_id = $this->db->getInsertId();
            }

            $insertData = [
                'title'               => $data['title'] ?? null,
                'content'            => $data['content'] ?? null,
                'is_pinned'              => $data['is_pinned'] ?? 0,
                'created_by'              => $data['created_by'] ?? 84,
            ];

            if ($image_id) {
                $insertData['img_id'] = $image_id;
            }


            $insert = $this->db->insert('tbl_announcements', $insertData);
            $id = $this->db->getInsertId();

            if ($insert) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Add New Announcement ',
                    'module' => 'Announcement',
                ];
                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => -1, // Example: -1 = all public_user, -2 = all management, -3 = all user
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'New Announcement',
                    'message'      =>  $data['title'],
                    'type'         => 1, // 1 = announcement, 2 = notification
                    'related_url'  => '/public/announcementsPage?id=' . $id,
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);

                $notif = [
                    'for_user'     => -2, // Example: -1 = all public_user, -2 = all management, -3 = all user
                    'created_by'    => $user_id, // Assuming the one triggering the notification is the updater
                    'title'        => 'New Announcement',
                    'message'      => 'A new announcement was  created by ' . $user_name . '.',
                    'type'         => 1, // 1 = announcement, 2 = notification
                    'related_url'  => '/public/announcementsPage?id=' . $id,
                    'is_read'      => json_encode([]), // 0 = unread
                ];
                $this->db->insert("tbl_notification", $notif);

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Announcement info successfully added',
                    'method' => 'POST',
                    'id' => $id
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to save announcement info',
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
        if (isset($payload['soft_delete_announcement'])) {
            $id = $payload['soft_delete_announcement']['arrayId'];
            $user_id = $payload['soft_delete_announcement']['user_id'];
            $user_type = $payload['soft_delete_announcement']['user_type'];
            $user_name = $payload['soft_delete_announcement']['user_name'];


            $ids = is_array($id) ? $id : explode(',', $id);

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update('tbl_announcements', $update_values);

            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Archive a announcement ',
                    'module' => 'Announcement',
                ];

                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Archive a Announcement',
                    'message'      => 'An announcement was archive by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);

                echo json_encode(['status' => 'success', 'message' => 'Records Archive successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to Archive records', 'method' => 'PUT']);
            }
        } else if (isset($payload['edit_announcement'])) {
            $obj = $payload['edit_announcement']['data'];
            $user_id = $payload['edit_announcement']['user_id'];
            $user_type = $payload['edit_announcement']['user_type'];
            $user_name = $payload['edit_announcement']['user_name'];
            $new_image = $obj['new_image'] ?? '';
            $image_id = '';

            // Insert new image if provided
            if ($new_image) {
                $this->db->insert('tbl_files', ['image_path' => $new_image]);
                $image_id = $this->db->getInsertId();
            }

            // Build update array
            $update_values = [
                'title' => $obj['title'] ?? '',
                'content' => $obj['content'] ?? '',
                'is_pinned' => $obj['is_pinned'] ?? null,
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            // Conditionally include img_id
            if ($image_id) {
                $update_values['img_id'] = $image_id;
            }

            // Remove unused field
            unset($obj['new_image']);

            // Perform update
            $id = $obj['id'];
            $this->db->where('id', $id);
            $updated = $this->db->update('tbl_announcements', $update_values);


            if ($updated) {
                $logs = [
                    'user_id' => $user_id,
                    'user_type' => $user_type,
                    'action' => 'Edit announcement ',
                    'module' => 'Announcement',
                ];

                $this->db->insert("tbl_logs", $logs);

                $notif = [
                    'for_user'     => -2, // all management 
                    'created_by'   => $user_id,
                    'title'        => 'Announcement Update',
                    'message'      => 'An announcement was edited by ' . $user_name . '.',
                    'type'         => 2, // 1 = announcement, 2 = notification
                    'related_url'  => '',
                    'is_read'      => json_encode([]),
                ];


                $this->db->insert("tbl_notification", $notif);

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Announcement info updated successfully',
                    'method' => 'PUT'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update announcement info',
                    'method' => 'PUT'
                ]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Missing Announcement info in the payload']);
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
