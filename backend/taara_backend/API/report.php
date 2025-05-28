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
        if (isset($payload["get_expenses"])) {
            $month = $payload['get_expenses']['month'];
            $year = $payload['get_expenses']['year'];
            $day = $payload['get_expenses']['day'];

            $this->db->where("DAY(`expense_date`) = ?", [$day]);
            $this->db->where("MONTH(`expense_date`) = ?", [$month]);
            $this->db->where("YEAR(`expense_date`) = ?", [$year]);
            $this->db->where('is_deleted', 0);
            $query = $this->db->get("tbl_expenses");

            echo json_encode([
                'status' => 'success',
                'data' => $query,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_budget_allocation', $payload)) {
            $this->db->where('is_deleted', 0);
            $query = $this->db->get("tbl_budget_allocation");
            // Respond with success and the query data
            echo json_encode([
                'status' => 'success',
                'data' => $query,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_expenses_summary', $payload)) {
            $month = str_pad($payload['get_expenses_summary']['month'], 2, '0', STR_PAD_LEFT);
            $year = $payload['get_expenses_summary']['year'];

            $this->db->where('expense_date', "$year-$month%", 'LIKE');
            $this->db->where('is_deleted', 0);
            $totalAmount = $this->db->getValue("tbl_expenses", "SUM(amount)");

            echo json_encode([
                'status' => 'success',
                'data' => ['total' => $totalAmount],
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_total_balance', $payload)) {
            $month = str_pad($payload['get_total_balance']['month'], 2, '0', STR_PAD_LEFT);
            $year = $payload['get_total_balance']['year'];
            $likeDate = "$year-$month%";

            // Get total donations
            $this->db->join('tbl_cash_donations tbl2', 'tbl1.fund_id = tbl2.fund_id', 'LEFT');
            $this->db->where('tbl1.received_date', $likeDate, 'LIKE');
            $this->db->where('tbl1.is_deleted', 0);
            $totalCashDonations = $this->db->getValue('tbl_funds tbl1', 'SUM(tbl2.amount)');

            // Get total expenses up to selected date
            $this->db->where('expense_date', "$year-$month-31", '<=');
            $this->db->where('is_deleted', 0);
            $totalExpenses = $this->db->getValue('tbl_expenses', 'SUM(amount)');

            // Calculate balance
            $finalBalance = floatval($totalCashDonations) - floatval($totalExpenses);

            echo json_encode([
                'status' => 'success',
                'data' => [
                    'donations' => $totalCashDonations ?: 0,
                    'expenses' => $totalExpenses ?: 0,
                    'balance' => $finalBalance
                ],
                'method' => 'GET'
            ]);
        } else if (array_key_exists("get_monthly_funds_and_expenses", $payload)) {
            $month = $payload['get_monthly_funds_and_expenses']['month'];
            $year = $payload['get_monthly_funds_and_expenses']['year'];

            $this->db->where("MONTH(`expense_date`) = ?", [$month]);
            $this->db->where("YEAR(`expense_date`) = ?", [$year]);
            $this->db->where('is_deleted', 0);
            $query = $this->db->get("tbl_expenses");

            echo json_encode(array(
                'status' => 'success',
                'data' => $query,
                'method' => 'GET'
            ));
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
        if (isset($payload['add_budget_allocation'])) {
            $data = $payload['add_budget_allocation'];

            $insert = $this->db->insert('tbl_budget_allocation', $data);

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Budget allocation successfully added',
                    'method' => 'POST'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to create budget allocation list',
                    'method' => 'POST'
                ]);
            }
        } else if (isset($payload['add_expense'])) {
            $data = $payload['add_expense'];

            $insert = $this->db->insert('tbl_expenses', $data);

            if ($insert) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Expense list successfully added',
                    'method' => 'POST'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to create Add expense list',
                    'method' => 'POST'
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing add_inventory_list data in the payload',
                'method' => 'POST'
            ]);
        }
    }

    public function httpPut($payload)
    {
        if (array_key_exists('update_buget_allocation', $payload)) {
            // Extract the user data
            $id = $payload['update_buget_allocation']['id'];
            $data = $payload['update_buget_allocation']['data'];

            $this->db->where('id', $id);
            $update_success = $this->db->update('tbl_budget_allocation', $data);

            // Return a response based on whether the update was successful
            if ($update_success) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Budget allocation updated successfully.',
                    'method' => 'PUT',
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update Budget allocation.',
                    'method' => 'PUT',
                ]);
            }
        } else if (array_key_exists('update_expense', $payload)) {
            // Extract the user data
            $id = $payload['update_expense']['id'];
            $data = $payload['update_expense']['data'];

            $this->db->where('id', $id);
            $update_success = $this->db->update('tbl_expenses', $data);

            // Return a response based on whether the update was successful
            if ($update_success) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Expense updated successfully.',
                    'method' => 'PUT',
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update Expense.',
                    'method' => 'PUT',
                ]);
            }
        } else if (array_key_exists('soft_delete_budget_expenses', $payload)) {
            // Extract the user data
            $id = $payload['soft_delete_budget_expenses'];
            $table = $payload['table'];

            $ids = is_array($id) ? $id : explode(',', $id);


            $allowed_tables = ['tbl_expenses', 'tbl_budget_allocation'];
            if (!in_array($table, $allowed_tables)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid table name']);
                return;
            }

            // Set the update values here in the backend
            $update_values = [
                'is_deleted' => 1,
                'deleted_at' => date('Y-m-d H:i:s')
            ];

            // Update records matching the IDs
            $this->db->where('id', $ids, 'IN');
            $updated = $this->db->update($table, $update_values);

            if ($updated) {
                echo json_encode(['status' => 'success', 'message' => 'Records soft-deleted successfully', 'method' => 'PUT']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to soft delete records', 'method' => 'PUT']);
            }
        } else {
            // Handle the case where 'updateUser' key is missing
            echo json_encode(['status' => 'error', 'message' => 'Missing updateUser key in the payload']);
        }
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
