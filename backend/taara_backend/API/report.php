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
        if (isset($payload["get_animal_list"])) {
            $year = $payload['get_animal_list']['year'];
            $month = $payload['get_animal_list']['month'];
            $operation = $payload['get_animal_list']['operation'];
            $health_status = $payload['get_animal_list']['health_status'];

            $allowed_operations = ['=', '<', '<=', '>', '>='];
            if (!in_array($operation, $allowed_operations)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
                exit;
            }

            $where = "YEAR(date_rescued) $operation ? AND MONTH(date_rescued) $operation ? AND is_deleted = 1 AND health_status = $health_status";
            $params = [$year, $month];

            $results = $this->db->rawQuery("SELECT * FROM tbl_animal_info WHERE $where", $params);

            echo json_encode([
                'status' => 'success',
                'data' => count($results),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_total_adopted', $payload)) {

            $year = $payload['get_total_adopted']['year'];
            $month = $payload['get_total_adopted']['month'];
            $operation = $payload['get_total_adopted']['operation'];

            $allowed_operations = ['=', '<', '<=', '>', '>='];
            if (!in_array($operation, $allowed_operations)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
                exit;
            }

            $where = "YEAR(updated_at) $operation ? AND MONTH(updated_at) $operation ?  AND adoption_status = 4";
            $params = [$year, $month];

            $results = $this->db->rawQuery("SELECT * FROM tbl_adoption_form WHERE $where", $params);

            echo json_encode([
                'status' => 'success',
                'data' => count($results),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_pet_available', $payload)) {

            $year = $payload['get_pet_available']['year'];
            $month = $payload['get_pet_available']['month'];
            $operation = $payload['get_pet_available']['operation'];

            $allowed_operations = ['=', '<', '<=', '>', '>='];
            if (!in_array($operation, $allowed_operations)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
                exit;
            }

            $where = "YEAR(date_rescued) $operation ? AND MONTH(date_rescued) $operation ? AND is_deleted = 1 AND health_status != 4";
            $params = [$year, $month];

            $results = $this->db->rawQuery("SELECT * FROM tbl_animal_info WHERE $where", $params);

            echo json_encode([
                'status' => 'success',
                'data' => count($results),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_overall_rescue', $payload)) {

            $year = $payload['get_overall_rescue']['year'];      // e.g., 2024
            $month = $payload['get_overall_rescue']['month'];    // e.g., 5
            $operation = $payload['get_overall_rescue']['operation']; // '=', '<=', '>='

            $allowed_operations = ['=', '<', '<=', '>', '>='];
            if (!in_array($operation, $allowed_operations)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
                exit;
            }

            $where = "YEAR(date_rescued) $operation ? AND MONTH(date_rescued) $operation ? AND is_deleted = 1";
            $params = [$year, $month];

            $results = $this->db->rawQuery("SELECT * FROM tbl_animal_info WHERE $where", $params);

            echo json_encode([
                'status' => 'success',
                'data' => count($results),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_classification', $payload)) {

            $year = $payload['get_classification']['year'];
            $month = $payload['get_classification']['month'];
            $operation = $payload['get_classification']['operation'];

            $allowed_operations = ['=', '<', '<=', '>', '>='];
            if (!in_array($operation, $allowed_operations)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
                exit;
            }

            // Base WHERE clause except classification
            $whereBase = "YEAR(date_rescued) $operation ? AND MONTH(date_rescued) $operation ? AND is_deleted = 1 ";

            // Params for base filters
            $paramsBase = [$year, $month];

            // Query 1: classification = 'stray'
            $whereStray = $whereBase . " AND classification = 'stray'";
            $resultsStray = $this->db->rawQuery("SELECT * FROM tbl_animal_info WHERE $whereStray", $paramsBase);

            // Query 2: classification = 'surrendered'
            $whereSurrendered = $whereBase . " AND classification = 'surrendered'";
            $resultsSurrendered = $this->db->rawQuery("SELECT * FROM tbl_animal_info WHERE $whereSurrendered", $paramsBase);

            echo json_encode([
                'status' => 'success',
                'data1' => count($resultsStray),
                'data2' => count($resultsSurrendered),
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_frequent_location', $payload)) {
            $topLocations = $this->db->rawQuery("
            SELECT location, latitude, longitude, COUNT(*) AS total_reports
            FROM tbl_rescue_report
            GROUP BY latitude, longitude
            ORDER BY total_reports DESC
            LIMIT 10
            ");

            echo json_encode([
                'status' => 'success',
                'data' => $topLocations,
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_monthly_rescue', $payload)) {
            $year = isset($payload['get_monthly_rescue']) ? intval($payload['get_monthly_rescue']) : date('Y');

            // Query DB
            $this->db->where('is_deleted', 1);
            $this->db->where('YEAR(date_rescued)', $year);
            $this->db->groupBy('MONTH(date_rescued)');
            $this->db->orderBy('MONTH(date_rescued)', 'ASC');

            $query = $this->db->get('tbl_animal_info', null, [
                'COUNT(*) as count',
                'MONTH(date_rescued) as month'
            ]);

            // Initialize array with 0 counts for each month
            $monthlyCounts = array_fill(1, 12, 0);

            // Replace counts with actual data
            foreach ($query as $row) {
                $monthlyCounts[intval($row['month'])] = intval($row['count']);
            }

            // Reset array keys to 0-based index for JSON output
            $monthlyCounts = array_values($monthlyCounts);

            echo json_encode([
                'status' => 'success',
                'year' => $year,
                'data' => $monthlyCounts, // [2, 2, 2, 1, ...]
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_monthly_pet_available', $payload)) {
            $year = isset($payload['get_monthly_pet_available']) ? intval($payload['get_monthly_pet_available']) : date('Y');

            $this->db->where('is_deleted', 1);
            $this->db->where('health_status', 4, '!=');
            $this->db->where('YEAR(date_rescued)', $year);
            $this->db->groupBy('MONTH(date_rescued)');
            $this->db->orderBy('MONTH(date_rescued)', 'ASC');

            $query = $this->db->get('tbl_animal_info', null, [
                'COUNT(*) as count',
                'MONTH(date_rescued) as month'
            ]);

            // Initialize array with 0 counts for each month
            $monthlyCounts = array_fill(1, 12, 0);

            // Replace counts with actual data
            foreach ($query as $row) {
                $monthlyCounts[intval($row['month'])] = intval($row['count']);
            }

            // Reset array keys to 0-based index for JSON output
            $monthlyCounts = array_values($monthlyCounts);

            echo json_encode([
                'status' => 'success',
                'year' => $year,
                'data' => $monthlyCounts, // [2, 2, 2, 1, ...]
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_monthly_adopted', $payload)) {
            $year = isset($payload['get_monthly_adopted']) ? intval($payload['get_monthly_adopted']) : date('Y');

            $this->db->where('adoption_status', 8);
            $this->db->where('health_status', 4, '!=');
            $this->db->where('YEAR(updated_at)', $year);
            $this->db->groupBy('MONTH(updated_at)');
            $this->db->orderBy('MONTH(updated_at)', 'ASC');

            $query = $this->db->get('tbl_adoption_form', null, [
                'COUNT(*) as count',
                'MONTH(updated_at) as month'
            ]);

            // Initialize array with 0 counts for each month
            $monthlyCounts = array_fill(1, 12, 0);

            // Replace counts with actual data
            foreach ($query as $row) {
                $monthlyCounts[intval($row['month'])] = intval($row['count']);
            }

            // Reset array keys to 0-based index for JSON output
            $monthlyCounts = array_values($monthlyCounts);

            echo json_encode([
                'status' => 'success',
                'year' => $year,
                'data' => $monthlyCounts, // [2, 2, 2, 1, ...]
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_monthly_deceased', $payload)) {
            $year = isset($payload['get_monthly_deceased']) ? intval($payload['get_monthly_deceased']) : date('Y');

            $this->db->where('is_deleted', 1);
            $this->db->where('health_status', 4);
            $this->db->where('YEAR(deceased_date)', $year);
            $this->db->groupBy('MONTH(deceased_date)');
            $this->db->orderBy('MONTH(deceased_date)', 'ASC');
            $query = $this->db->get('tbl_animal_info', null, [
                'COUNT(*) as count',
                'MONTH(deceased_date) as month'
            ]);

            // Initialize array with 0 counts for each month
            $monthlyCounts = array_fill(1, 12, 0);

            // Replace counts with actual data
            foreach ($query as $row) {
                $monthlyCounts[intval($row['month'])] = intval($row['count']);
            }

            // Reset array keys to 0-based index for JSON output
            $monthlyCounts = array_values($monthlyCounts);

            echo json_encode([
                'status' => 'success',
                'year' => $year,
                'data' => $monthlyCounts, // [2, 2, 2, 1, ...]
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_monthly_donation', $payload)) {
            $year = isset($payload['get_monthly_donation']) ? intval($payload['get_monthly_donation']) : date('Y');

            // Apply filters
            $this->db->where('f.is_deleted', 0);
            $this->db->where('f.donation_type', 'cash');
            $this->db->where('YEAR(f.received_date)', $year);

            // Group and sort by month
            $this->db->groupBy('MONTH(f.received_date)');
            $this->db->orderBy('MONTH(f.received_date)', 'ASC');

            // Join donations table
            $this->db->join('tbl_cash_donations cd', 'f.fund_id = cd.fund_id', 'LEFT');

            // Select total amount per month instead of count
            $query = $this->db->get('tbl_funds f', null, [
                'SUM(cd.amount) as total',
                'MONTH(f.received_date) as month'
            ]);

            // Initialize array with 0 totals for each month
            $monthlyTotals = array_fill(1, 12, 0.0);

            // Populate with actual totals
            foreach ($query as $row) {
                $monthlyTotals[intval($row['month'])] = floatval($row['total']);
            }

            // Reset array keys to 0-based index
            $monthlyTotals = array_values($monthlyTotals);

            // Return response
            echo json_encode([
                'status' => 'success',
                'year' => $year,
                'data' => $monthlyTotals, // Example: [0, 200.00, 150.00, 0, ...]
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_monthly_expense', $payload)) {
            $year = isset($payload['get_monthly_expense']) ? intval($payload['get_monthly_expense']) : date('Y');

            // Apply filters
            $this->db->where('is_deleted', 0);
            $this->db->where('YEAR(expense_date)', $year);

            // Group and sort by month
            $this->db->groupBy('MONTH(expense_date)');
            $this->db->orderBy('MONTH(expense_date)', 'ASC');


            // Select total amount per month instead of count
            $query = $this->db->get('tbl_expenses', null, [
                'SUM(amount) as total',
                'MONTH(expense_date) as month'
            ]);

            // Initialize array with 0 totals for each month
            $monthlyTotals = array_fill(1, 12, 0.0);

            // Populate with actual totals
            foreach ($query as $row) {
                $monthlyTotals[intval($row['month'])] = floatval($row['total']);
            }

            // Reset array keys to 0-based index
            $monthlyTotals = array_values($monthlyTotals);

            // Return response
            echo json_encode([
                'status' => 'success',
                'year' => $year,
                'data' => $monthlyTotals, // Example: [0, 200.00, 150.00, 0, ...]
                'method' => 'GET'
            ]);
        } else if (array_key_exists('get_expense_summary', $payload)) {
            $year = $payload['get_expense_summary']['year'];
            $month = str_pad($payload['get_expense_summary']['month'], 2, '0', STR_PAD_LEFT);
            $operation = $payload['get_expense_summary']['operation'];

            // Get total donations for the selected month (still using LIKE to match month)
            $this->db->join('tbl_cash_donations tbl2', 'tbl1.fund_id = tbl2.fund_id', 'LEFT');
            $this->db->where('YEAR(tbl1.received_date)', $year);
            $this->db->where('MONTH(tbl1.received_date)', $month);

            $this->db->where('tbl1.is_deleted', 0);
            $totalCashDonations = $this->db->getValue('tbl_funds tbl1', 'SUM(tbl2.amount)');

            // Get total expenses up to (or for) the selected date, using the dynamic operation
            $this->db->where('MONTH(expense_date)', $month);
            $this->db->where('YEAR(expense_date)', $year);
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
        } else if (array_key_exists('get_monthly_balance', $payload)) {
            $year = isset($payload['get_monthly_balance']['year']) ? intval($payload['get_monthly_balance']['year']) : date('Y');

            // --- Get Monthly Donations ---
            $this->db->where('f.is_deleted', 0);
            $this->db->where('f.donation_type', 'cash');
            $this->db->where('YEAR(f.received_date)', $year);
            $this->db->groupBy('MONTH(f.received_date)');
            $this->db->orderBy('MONTH(f.received_date)', 'ASC');
            $this->db->join('tbl_cash_donations cd', 'f.fund_id = cd.fund_id', 'LEFT');

            $donationsQuery = $this->db->get('tbl_funds f', null, [
                'SUM(cd.amount) as total',
                'MONTH(f.received_date) as month'
            ]);

            $monthlyDonations = array_fill(1, 12, 0.0);
            foreach ($donationsQuery as $row) {
                $monthlyDonations[intval($row['month'])] = floatval($row['total']);
            }

            // --- Get Monthly Expenses ---
            $this->db->where('is_deleted', 0);
            $this->db->where('YEAR(expense_date)', $year);
            $this->db->groupBy('MONTH(expense_date)');
            $this->db->orderBy('MONTH(expense_date)', 'ASC');

            $expensesQuery = $this->db->get('tbl_expenses', null, [
                'SUM(amount) as total',
                'MONTH(expense_date) as month'
            ]);

            $monthlyExpenses = array_fill(1, 12, 0.0);
            foreach ($expensesQuery as $row) {
                $monthlyExpenses[intval($row['month'])] = floatval($row['total']);
            }

            // --- Calculate Monthly Balance (Donations - Expenses Only) ---
            $monthlyBalances = [];
            for ($i = 1; $i <= 12; $i++) {
                $balance = $monthlyDonations[$i] - $monthlyExpenses[$i];
                $monthlyBalances[] = $balance;
            }

            // --- Output JSON ---
            echo json_encode([
                'status' => 'success',
                'year' => $year,
                'data' => $monthlyBalances, // Example: [500, -200, 0, 1000, ...]
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
