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
    $datas = json_encode($payload);
    $ref_id = json_decode($datas, true);

    if (array_key_exists("featured", $ref_id)) {
      $answer = $ref_id["featured"];

      $query = $this->db->rawQuery("SELECT * FROM tbl_animals_info WHERE  featured = '$answer' ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("year_donation_cash", $ref_id)) {
      $this->db->where("YEAR(f.created_at)", date('Y'));
      $this->db->where("f.is_deleted", 0);
      $this->db->where("f.status", 2);
      $this->db->join("tbl_cash_donations c", "f.fund_id = c.fund_id", "LEFT");
      $max = $this->db->getValue("tbl_funds f", "MAX(c.amount)");
      echo json_encode(array('status' => 'success', 'data' => $max, 'method' => 'GET'));
    } else if (array_key_exists("mont_donation_cash", $ref_id)) {
      $this->db->where("MONTH(f.created_at)", date('n')); // ✔️ 'n' = numeric month (1 to 12)
      $this->db->where("f.is_deleted", 0);
      $this->db->join("tbl_cash_donations c", "f.fund_id = c.fund_id", "LEFT");
      $this->db->where("f.status", 2);
      $max = $this->db->getValue("tbl_funds f", "MAX(c.amount)");
      echo json_encode(array('status' => 'success', 'data' => $max, 'method' => 'GET'));
    } else if (array_key_exists("all_animals", $ref_id)) {
      $this->db->join("tbl_files f", "f.id = tbl_animal_info.primary_image", "LEFT");
      $this->db->where("is_deleted", 1);

      // ✅ Add column selection with alias
      $animalRows = $this->db->get("tbl_animal_info", null, "tbl_animal_info.*, f.image_path AS primary_image");

      foreach ($animalRows as &$animal) {
        $galleryIds = json_decode($animal['image_gallery'], true);

        if (is_array($galleryIds) && count($galleryIds)) {
          $this->db->where('id', $galleryIds, 'IN');
          $files = $this->db->get('tbl_files');

          $paths = array_column($files, 'image_path');
          $animal['image_gallery'] = $paths;
        } else {
          $animal['image_gallery'] = [];
        }
      }


      echo json_encode([
        'status' => 'success',
        'data' => $animalRows,
        'method' => 'GET'
      ]);
    } else if (array_key_exists("get_user_by_type", $ref_id)) {
      $cols = array('animal_id', 'animal_name', 'animal_type', 'age', 'breed', 'eye_color', 'fur_color', 'weight', 'height', 'length', 'sex', 'size', 'animal_image', 'favorite_food', 'care_start_date', 'current_state');
      $query = $this->db->get("tbl_animals_info", null, $cols);
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("all_users", $ref_id)) {
      $month = $ref_id['month'];
      $year = $ref_id['year'];
      $query = $this->db->rawQuery("SELECT SUM(count) AS total_count FROM (
        SELECT COUNT(*) AS count FROM tbl_volunteer_account WHERE YEAR(date_created) < $year OR (YEAR(date_created) = $year AND MONTH(date_created) < $month)
        UNION ALL
        SELECT COUNT(*) AS count FROM tbl_users WHERE YEAR(date_created) < $year OR (YEAR(date_created) = $year AND MONTH(date_created) < $month)
        UNION ALL
        SELECT COUNT(*) AS count FROM tbl_officials_account WHERE YEAR(date_created) < $year OR (YEAR(date_created) = $year AND MONTH(date_created) < $month)
    ) AS subquery;


      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("all_animals_management", $ref_id)) {
      // $animal_state = $ref_id["all_animals_management"];
      // WHERE current_state = '$animal_state'
      $query = $this->db->rawQuery("SELECT animal_id,animal_name,animal_type,animal_image,fur_color,breed,behaviour,good_with,age,sex,size,weight,height,length,favorite_meats,favorite_fruits,favorite_vegetables,favorite_treats_snacks ,health,current_state,story FROM tbl_animals_info ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("animal_public_display", $ref_id)) {
      $query = $this->db->rawQuery("SELECT * FROM tbl_animals_info ORDER BY RAND() LIMIT 12");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("more_animal_for_adoption", $ref_id)) {
      $query = $this->db->rawQuery("SELECT * FROM tbl_animals_info ORDER BY RAND() LIMIT 6");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("SearchAnimalByName", $ref_id)) {
      $animal_name = $ref_id['SearchAnimalByName'];
      $query = $this->db->rawQuery("SELECT * FROM tbl_animals_info WHERE animal_name LIKE '$animal_name%' ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("system_activity", $ref_id)) {
      $system_activity = $ref_id['system_activity'];
      $query = $this->db->rawQuery("SELECT * FROM tbl_system_activity WHERE user_id = $system_activity ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_all_animals_not_adopted", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.animal_id, tb1.animal_name, tb1.animal_image
      FROM tbl_animals_info tb1
      WHERE NOT EXISTS (SELECT 1 FROM tbl_adopted_animals tb2 WHERE tb1.animal_id = tb2.animal_id);
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_wishlist_medicine", $ref_id)) {
      $query = $this->db->get("tbl_wishlist_medicine ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_wishlist_food", $ref_id)) {
      $query = $this->db->get("tbl_wishlist_food ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_wishlist_supplies", $ref_id)) {
      $query = $this->db->get("tbl_wishlist_supplies ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("getAllAnimalsAdopted", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.id,tb1.adopter_id,  tb2.animal_id,tb2.animal_name,tb2.animal_image,
      COALESCE(tb3.first_name, tb1.adopter_name) AS adopter_name, COALESCE(tb3.city_municipality, tb1.adopter_city_municipality) AS adopter_city_municipality, COALESCE(tb3.birth_date, tb1.adopter_birth_date) AS adopter_birth_date,COALESCE(tb3.sex, tb1.adopter_sex) AS adopter_sex,COALESCE(tb3.phone_number, tb1.adopter_phone_number) AS adopter_phone_number,tb1.date_adopted,tb1.time_adopted
      FROM tbl_adopted_animals tb1
      LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
      LEFT JOIN tbl_users tb3 ON tb1.adopter_id = tb3.user_id;
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_animals_adopted", $ref_id)) {
      $month = $ref_id['month'];
      $year = $ref_id['year'];

      $query = $this->db->rawQuery("SELECT tb1.id,tb1.adopter_id,  tb2.animal_id,tb2.animal_name,tb2.animal_image,
      COALESCE(tb3.first_name, tb1.adopter_name) AS adopter_name, COALESCE(tb3.city_municipality, tb1.adopter_city_municipality) AS adopter_city_municipality, COALESCE(tb3.birth_date, tb1.adopter_birth_date) AS adopter_birth_date,COALESCE(tb3.sex, tb1.adopter_sex) AS adopter_sex,COALESCE(tb3.phone_number, tb1.adopter_phone_number) AS adopter_phone_number,tb1.date_adopted,tb1.time_adopted
      FROM tbl_adopted_animals tb1
      LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
      LEFT JOIN tbl_users tb3 ON tb1.adopter_id = tb3.user_id WHERE YEAR(date_adopted) = $year AND MONTH(date_adopted) = $month;
      ");

      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_month_donation", $ref_id)) {
      $month = $ref_id['month'];
      $year = $ref_id['year'];
      $this->db->where('MONTH(donation_date)', $month);
      $this->db->where('YEAR(donation_date)', $year);
      $this->db->where('donation_status', 2);
      $query = $this->db->get("tbl_donations");

      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_list_of_medicine", $ref_id)) {

      $query = $this->db->get("tbl_inventory_medicine");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_list_of_vaccine", $ref_id)) {
      $query = $this->db->get("tbl_inventory_vaccine");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_list_of_vitamin", $ref_id)) {
      $query = $this->db->get("tbl_inventory_vitamin");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_group_name", $ref_id)) {
      $query = $this->db->get("tbl_inventory_medicine_groups");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_group_name_vaccine", $ref_id)) {
      $query = $this->db->get("tbl_inventory_vaccine_groups");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_group_name_vitamin", $ref_id)) {
      $query = $this->db->get("tbl_inventory_vitamin_groups");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_food_inventory", $ref_id)) {
      $query = $this->db->get("tbl_foods_inventory");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_wishlist_priority", $ref_id)) {
      $query = $this->db->rawQuery("SELECT wishlist_medicine_name AS name FROM tbl_wishlist_medicine WHERE highlight_important = 1
      UNION ALL
      SELECT wishlist_food_name AS name FROM tbl_wishlist_food WHERE  highlight_important = 1
      UNION ALL
      SELECT wishlist_supplies_name AS name
      FROM tbl_wishlist_supplies WHERE  highlight_important = 1");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("budget_allocation_data", $ref_id)) {
      $month = $ref_id['month'];
      $year = $ref_id['year'];
      $query = $this->db->rawQuery("SELECT  tbl2.budget_allocation_id, tbl2.item_name, tbl2.percentage,
      IFNULL(SUM(tbl1.expense_total), 0) as accumulated_expenses
    FROM tbl_budget_allocation AS tbl2
    LEFT JOIN tbl_expenses AS tbl1 ON tbl2.item_name = tbl1.expense_type AND MONTH(tbl1.date) = $month AND YEAR(tbl1.date) = $year
    GROUP BY tbl2.item_name;

    ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_all_animal_stray", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.id,tb1.reporter_id,  tb2.animal_id,tb2.animal_name,tb2.animal_image,
      COALESCE(tb3.first_name, tb1.reporter_name) AS reporter_name, COALESCE(tb3.city_municipality, tb1.reporter_municipality) AS reporter_municipality, COALESCE(tb3.birth_date, tb1.reporter_birth_date) AS reporter_birth_date,COALESCE(tb3.sex, tb1.reporter_sex) AS reporter_sex,COALESCE(tb3.phone_number, tb1.reporter_phone_number) AS reporter_phone_number,tb1.rescue_date,tb1.rescue_time
      FROM tbl_rescued_animals tb1
      LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
      LEFT JOIN tbl_users tb3 ON tb1.reporter_id = tb3.user_id;");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_rescued_animal", $ref_id)) {
      $month = $ref_id['month'];
      $year = $ref_id['year'];
      $this->db->where('deleted_at', 0);
      $this->db->where('state_upon_rescue', 0, '!=');
      $this->db->where('MONTH(care_start_date)', $month);
      $this->db->where('YEAR(care_start_date)', $year);
      $query = $this->db->get("tbl_animals_info");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_monthly_rescued_animal", $ref_id)) {
      $year = $ref_id['get_monthly_rescued_animal'];
      $query = $this->db->rawQuery("SELECT months.month, IFNULL(COUNT(ai.updated_at), 0) AS Number_of_Rescues
      FROM (
         SELECT 1 AS month
         UNION ALL SELECT 2
         UNION ALL SELECT 3
         UNION ALL SELECT 4
         UNION ALL SELECT 5
         UNION ALL SELECT 6
         UNION ALL SELECT 7
         UNION ALL SELECT 8
         UNION ALL SELECT 9
         UNION ALL SELECT 10
         UNION ALL SELECT 11
         UNION ALL SELECT 12
      ) AS months
      LEFT JOIN tbl_rescue_report as ai
      ON months.month = MONTH(ai.updated_at)
      AND YEAR(ai.updated_at) = $year
      GROUP BY months.month;

    ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_monthly_adoption", $ref_id)) {
      $year = $ref_id['get_monthly_adoption'];
      $query = $this->db->rawQuery("SELECT months.month, IFNULL(COUNT(af.updated_at), 0) AS Number_of_Adoption
          FROM (
            SELECT 1 AS month
            UNION ALL SELECT 2
            UNION ALL SELECT 3
            UNION ALL SELECT 4
            UNION ALL SELECT 5
            UNION ALL SELECT 6
            UNION ALL SELECT 7
            UNION ALL SELECT 8
            UNION ALL SELECT 9
            UNION ALL SELECT 10
            UNION ALL SELECT 11
            UNION ALL SELECT 12
          ) AS months
          LEFT JOIN tbl_adoption_form as af
          ON months.month = MONTH(af.updated_at)
          AND YEAR(af.updated_at) = $year AND af.adoption_status = 4
          GROUP BY months.month;

    ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_all_animal_not_stray", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.animal_id, tb1.animal_name, tb1.animal_image
      FROM tbl_animals_info tb1
      WHERE NOT EXISTS (SELECT 1 FROM tbl_rescued_animals tb2 WHERE tb1.animal_id = tb2.animal_id)");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_specific_animal", $ref_id)) {
      $animal_id = $ref_id["export_specific_animal"];
      $query = $this->db->rawQuery("SELECT animal_id,animal_name,animal_type,fur_color,breed,behaviour,good_with,age,sex,size,weight,height,length,favorite_meats,favorite_fruits,favorite_vegetables,favorite_treats_snacks ,health,current_state,story FROM tbl_animals_info WHERE animal_id = $animal_id ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_rehomed_pets", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.id,  tb2.animal_id,tb2.animal_name,
      COALESCE(tb3.first_name, tb1.adopter_name) AS adopter_name,
      COALESCE(tb3.city_municipality, tb1.adopter_city_municipality) AS adopter_city_municipality,
      COALESCE(tb3.birth_date, tb1.adopter_birth_date) AS adopter_birth_date,
      CASE
          WHEN tb3.user_id IS NULL AND tb1.adopter_sex = 1 THEN 'Male'
          WHEN tb3.user_id IS NULL AND tb1.adopter_sex = 2 THEN 'Female'
          ELSE tb3.sex
      END AS adopter_sex,
      COALESCE(tb3.phone_number, tb1.adopter_phone_number) AS adopter_phone_number,
      tb1.date_adopted,
      tb1.time_adopted
    FROM tbl_adopted_animals tb1
    LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
    LEFT JOIN tbl_users tb3 ON tb1.adopter_id = tb3.user_id;
    ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_wishlist", $ref_id)) {
      $columns = array();
      $tbl_name = '';
      if ($ref_id['export_wishlist'] == 'Medicine') {
        $columns = array('wishlist_medicine_id,wishlist_medicine_name, highlight_important');
        $tbl_name = 'tbl_wishlist_medicine';
      } else if ($ref_id['export_wishlist'] == 'Food') {

        $columns = array('wishlist_food_id,wishlist_food_name, highlight_important');
        $tbl_name = 'tbl_wishlist_food';
      } else {

        $columns = array('wishlist_supplies_id,wishlist_supplies_name, highlight_important');
        $tbl_name = 'tbl_wishlist_supplies';
      }
      $query = $this->db->get($tbl_name, null, $columns);
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_pets_foods", $ref_id)) {
      $columns = array('food_id,food_name, food_type, food_qty,food_qty_type,food_cost,food_total_cost,bought_date');
      $query = $this->db->get("tbl_foods_inventory", null, $columns);
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_medicine", $ref_id)) {
      $query = $this->db->get("tbl_inventory_medicine");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_vaccine", $ref_id)) {
      $query = $this->db->get("tbl_inventory_vaccine");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_vitamin", $ref_id)) {
      $query = $this->db->get("tbl_inventory_vitamin");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_rescued_stray_animals", $ref_id)) {

      $query = $this->db->rawQuery("SELECT tb1.id,tb2.animal_name,
      COALESCE(tb3.first_name, tb1.reporter_name) AS reporter_name, COALESCE(tb3.city_municipality, tb1.reporter_municipality) AS reporter_municipality, COALESCE(tb3.birth_date, tb1.reporter_birth_date) AS reporter_birth_date,COALESCE(tb3.sex, tb1.reporter_sex) AS reporter_sex,COALESCE(tb3.phone_number, tb1.reporter_phone_number) AS reporter_phone_number,tb1.rescue_date,tb1.rescue_time
      FROM tbl_rescued_animals tb1
      LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
      LEFT JOIN tbl_users tb3 ON tb1.reporter_id = tb3.user_id");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_surrendered_animals", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.id,tb2.animal_name,
      COALESCE(tb3.first_name, tb1.surrenderer_name) AS surrenderer_name, COALESCE(tb3.city_municipality, tb1.surrenderer_city_municipality) AS surrenderer_city_municipality, COALESCE(tb3.birth_date, tb1.surrenderer_birth_date) AS surrenderer_birth_date,COALESCE(tb3.sex, tb1.surrenderer_sex) AS surrenderer_sex,COALESCE(tb3.phone_number, tb1.surrenderer_phone_number) AS surrenderer_phone_number,tb1.surrender_date,tb1.surrender_time
      FROM tbl_surrender_animals tb1
      LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
      LEFT JOIN tbl_users tb3 ON tb1.surrenderer_id = tb3.user_id;
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_in_kind_donations", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.donation_in_kind_id, COALESCE(tb2.first_name, tb1.name) AS name, tb1.donation_type, tb1.qty, tb1.qty_type,COALESCE(CONCAT(tb2.street,' ',tb2.brgy_name,' ', tb2.city_municipality,' ',tb2.province), tb1.address) AS address,COALESCE(tb1.phone_number,tb2.phone_number) AS phone_number,tb1.date,tb1.time FROM tbl_donation_in_kind tb1 LEFT JOIN tbl_users tb2 ON tb1.donator_id = tb2.user_id");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_donation_tracker", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.donation_id,   CASE WHEN tb3.id IS NULL THEN CONCAT(tb2.first_name,' ', tb2.last_name)
      ELSE CONCAT(tb3.walk_in_name)
      END AS walk_in_name,  tb1.donation_amount,

      CASE
          WHEN tb3.id IS NULL THEN CONCAT(tb2.street, ' ', tb2.brgy_name, ', ', tb2.city_municipality, ' ', tb2.province)
          ELSE CONCAT(tb3.walk_in_address)
      END AS walk_in_address,

      CASE
          WHEN tb3.id IS NULL THEN 'No'
          ELSE 'Yes'
      END AS is_walk_in ,tb1.donation_date,tb1.donation_time
    FROM tbl_donations tb1
    LEFT JOIN tbl_users tb2 ON tb1.donators_id = tb2.user_id
    LEFT JOIN tbl_walk_in_donations tb3 ON tb1.walk_in_id = tb3.id
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_deceased_animals", $ref_id)) {

      $query = $this->db->rawQuery("SELECT tb2.id, tb1.animal_name, tb1.breed,tb1.age,tb1.size,tb1.sex,tb1.fur_color ,tb2.deceased_date,tb2.deceased_time
      FROM tbl_animals_info tb1
      LEFT JOIN tbl_deceased_animals tb2
      ON tb1.animal_id = tb2.animal_id
      WHERE tb1.animal_id = tb2.animal_id
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("specificAnimalId", $ref_id)) {
      $id = $payload['specificAnimalId'];

      $this->db->join("tbl_files f", "f.id = ai.primary_image", "LEFT");
      $this->db->where("is_deleted", 1);
      $this->db->where("animal_id", $id);

      // Fetch a single record
      $animal = $this->db->getOne("tbl_animal_info ai", "ai.*, f.image_path AS primary_image");

      if ($animal) {
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

          $animal['file'] = $fileObjects;
        } else {
          $animal['file'] = [];
        }

        unset($animal['image_gallery']);
      }

      echo json_encode([
        'status' => 'success',
        'data' => $animal, // directly return the single animal object
        'method' => 'GET'
      ]);
    } else if (array_key_exists("get_random_animal", $ref_id)) {

      // Get total number of rows (filtered by is_deleted = 1)
      $this->db->where("is_deleted", 1);
      $total = $this->db->getValue("tbl_animal_info", "count(*)");

      // Compute a safe random offset
      $offset = rand(0, max(0, $total - 6));

      // Join primary image
      $this->db->join("tbl_files f", "f.id = tbl_animal_info.primary_image", "LEFT");
      $this->db->where("is_deleted", 1);

      // Get 6 animals using limit + offset (faster than RAND() for large tables)
      $animalRows = $this->db->get("tbl_animal_info", [$offset, 6], "tbl_animal_info.*, f.image_path AS primary_image");

      // Map image_gallery to file data
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
              'id'   => $file['id']
            ];
          }, $files);

          $animal['file'] = $fileObjects;
        } else {
          $animal['file'] = [];
        }

        unset($animal['image_gallery']);
      }

      // Output JSON
      echo json_encode([
        'status' => 'success',
        'data' => $animalRows,
        'method' => 'GET'
      ]);
    } else if (array_key_exists("animalImageId", $ref_id)) {
      $animal_id = $ref_id['animalImageId'];
      $img = $this->db->rawQuery("SELECT * FROM tbl_animal_image where animal_id = $animal_id");
      echo json_encode(array('status' => 'success', 'image' => $img, 'method' => 'GET'));
    } else if (array_key_exists("get_activities_and_event", $ref_id)) {
      // $animal_id = $ref_id['animalId'];
      $query1 = $this->db->rawQuery("SELECT * FROM tbl_activities_and_events ");
      $query2 = $this->db->rawQuery("SELECT * FROM tbl_activities_and_events_image ");
      echo json_encode(array('status' => 'success', 'data' => $query1, 'image' => $query2, 'method' => 'GET'));
    } else if (array_key_exists("activities_and_event_specific", $ref_id)) {
      $id = $ref_id['activities_and_event_specific'];
      $query1 = $this->db->rawQuery("SELECT * FROM tbl_activities_and_events where activities_events_id = '$id'");
      $query2 = $this->db->rawQuery("SELECT * FROM tbl_activities_and_events_image where activities_events_id = '$id'");
      echo json_encode(array('status' => 'success', 'data' => $query1, 'image' => $query2, 'method' => 'GET'));
    } else if (array_key_exists("get_annoucement", $ref_id)) {
      // $id = $ref_id['animalId'];
      $query = $this->db->rawQuery("SELECT * FROM tbl_announcements ORDER BY announcement_id DESC LIMIT 1");
      $queryImage = $this->db->rawQuery("SELECT * FROM tbl_announcements_image
      WHERE announcement_id = (SELECT MAX(announcement_id) FROM tbl_announcements_image)");
      echo json_encode(array('status' => 'success', 'data' => $query, 'image' => $queryImage, 'method' => 'GET'));
    } else if (array_key_exists("get_all_annoucement", $ref_id)) {
      $query = $this->db->rawQuery("SELECT * FROM tbl_announcements ORDER BY announcement_id DESC ");
      $queryImage = $this->db->rawQuery("SELECT * FROM tbl_announcements_image");
      echo json_encode(array('status' => 'success', 'data' => $query, 'image' => $queryImage, 'method' => 'GET'));
    } else if (array_key_exists("get_rescue_report", $ref_id)) {
      $query = $this->db->rawQuery("SELECT * FROM tbl_reports WHERE report_status = 2 ORDER BY report_id DESC ");
      $queryImage = $this->db->rawQuery("SELECT * FROM tbl_reports_images");
      echo json_encode(array('status' => 'success', 'data' => $query, 'image' => $queryImage, 'method' => 'GET'));
    } else if (array_key_exists("get_rescue_request", $ref_id)) {
      $query = $this->db->rawQuery("SELECT * FROM tbl_reports WHERE report_status = 1 ORDER BY report_id DESC ");
      $queryImage = $this->db->rawQuery("SELECT * FROM tbl_reports_images");
      echo json_encode(array('status' => 'success', 'data' => $query, 'image' => $queryImage, 'method' => 'GET'));
    } else if (array_key_exists("get_volunteer_request", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1. * ,tb2.image,tb2.first_name, tb2.last_name
      FROM tbl_volunteer_form tb1
      INNER JOIN tbl_users tb2 ON tb1.user_id = tb2.user_id
       WHERE tb1.volunteer_status = 1
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_adoption_request", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.id,tb3.image,tb3.first_name,tb3.last_name,tb2.animal_name,tb1.pickup_or_delivery,tb1.have_other_pet,tb1.pet_number,tb1.behavior_other_animals,tb1.have_vet,tb1.vet_phone_number,tb1.own_or_rent,tb1.have_enough_space,tb1.have_children,tb1.number_of_children,tb1.someone_gonna_takecare_of_pet,tb1.pet_caretaker,tb1.plans_for_pet_when_away,tb1.easily_trigger_by_pet_noise,tb1.convicted_animal_crime,tb1.date,tb1.time
      ,tb1.review_form FROM tbl_form_adoption tb1
      INNER JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
      INNER JOIN tbl_users tb3 ON tb3.user_id = tb1.user_id WHERE tb1.adoption_status = 1
       ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_notification", $ref_id)) {
      // $date = $ref_id['date'];
      $account_date_created = $ref_id['account_date_created'];
      $offset = $ref_id['offset'];
      $query = $this->db->rawQuery("SELECT *
      FROM tbl_notification WHERE date >= '$account_date_created'
      ORDER BY date DESC, time DESC LIMIT 10 OFFSET $offset");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_likes", $ref_id)) {
      $user_id = $ref_id['user_id'];
      $this->db->where('user_id', $user_id);
      $query = $this->db->get("tbl_likes");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("all_id", $ref_id)) {
      // $id = $ref_id['IdId'];
      $cols = array("user_id");
      $users = $this->db->get("tbl_users", null, $cols);
      // var_dump($query);
      echo json_encode(array('status' => 'success', 'data' => $users, 'method' => 'GET'));
    } else if (array_key_exists("allVolunteerForm", $ref_id)) {
      // $user_id = $ref_id['SpecificallVolunteerForm'];
      $query = $this->db->rawQuery("SELECT * FROM tbl_volunteer_form");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("allUser", $ref_id)) {
      // $id = $ref_id['animalId'];
      // $cols = Array ("user_id");
      $users = $this->db->get("tbl_users");
      // var_dump($query);
      echo json_encode(array('status' => 'success', 'data' => $users, 'method' => 'GET'));
    } else if (array_key_exists("all_taara_officials_info", $ref_id)) {
      $cols = $ref_id['all_taara_officials_info'];
      if (is_array($cols)) {
        $users = $this->db->get("tbl_officials_account", null, $cols);
      } else {
        $users = $this->db->get("tbl_officials_account");
      }
      echo json_encode(array('status' => 'success', 'data' => $users, 'method' => 'GET'));
    } else if (array_key_exists("all_volunteers_info", $ref_id)) {
      $cols = $ref_id['all_volunteers_info'];
      if (is_array($cols)) {
        $users = $this->db->get("tbl_volunteer_account", null, $cols);
      } else {
        $users = $this->db->get("tbl_volunteer_account");
      }
      echo json_encode(array('status' => 'success', 'data' => $users, 'method' => 'GET'));
    } else if (array_key_exists("adoption_form_details", $ref_id)) {
      $user_id = $ref_id['adoption_form_details'];
      $this->db->where('user_id', $user_id);
      $query = $this->db->get("tbl_adoption_form ", null, 'adoption_status,animal_id');
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("check_email", $ref_id)) {
      $cols = array('email_address', 'phone_number', 'first_name');
      $this->db->where('email_address', $ref_id['check_email']);
      $query = $this->db->get("tbl_users", null, $cols);

      if (Count($query) >= 1) {
        echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'GET'));
      }
    } else if (array_key_exists("password", $ref_id) && array_key_exists("email_address", $ref_id)) {
      $email = $ref_id['email_address'];
      $password = $ref_id['password'];

      $this->db->where('email_address', $email);
      $this->db->where('password', $password);
      $query = $this->db->get("tbl_users");

      if (count($query) == 1) {
        echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
        return;
      } else {
        echo json_encode(array('status' => 'failed', 'data' => [], 'method' => 'GET'));
      }
    }
    //taara management get querries
    else if (array_key_exists("get_today_funds_and_expenses", $ref_id)) {
      $this->db->where('date', $ref_id['date']);
      $query = $this->db->get("tbl_expenses");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_monthly_funds_and_expenses", $ref_id)) {
      $month = $ref_id['month'];
      $year = $ref_id['year'];
      $query = $this->db->rawQuery("SELECT *
      FROM tbl_expenses
      WHERE MONTH(date) = '$month' AND YEAR(date) = '$year'");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_all_monthly_expenses", $ref_id)) {
      $year = $ref_id['year'];

      $query = $this->db->rawQuery("SELECT all_dates.year, all_dates.month, IFNULL(SUM(expenses.expense_total), 0) AS total_expense
      FROM (
          SELECT year, month FROM
          (SELECT (SELECT YEAR(MIN(date)) FROM tbl_expenses) + a AS year FROM
          (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b) years,
          (SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) months
      ) as all_dates
      LEFT JOIN tbl_expenses AS expenses
      ON all_dates.year = YEAR(expenses.date)
      AND all_dates.month = MONTH(expenses.date)
      WHERE all_dates.year <= YEAR(CURDATE())
      GROUP BY all_dates.year, all_dates.month;

      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_monthly_donation", $ref_id)) {
      $year = $ref_id['year'];
      $query = $this->db->rawQuery("
        SELECT 
          all_dates.year, 
          all_dates.month, 
          IFNULL(SUM(cd.amount), 0) AS month_donation
        FROM (
          SELECT y.year, m.month
          FROM (
            SELECT (SELECT YEAR(MIN(received_date)) FROM tbl_funds) + a AS year
            FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
                  UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
          ) y
          CROSS JOIN (
            SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 
            UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
          ) m
        ) AS all_dates
        LEFT JOIN tbl_funds AS f 
          ON all_dates.year = YEAR(f.received_date) 
          AND all_dates.month = MONTH(f.received_date) 
          AND f.donation_status = 2
        LEFT JOIN tbl_cash_donations AS cd 
          ON cd.fund_id = f.fund_id
        WHERE all_dates.year <= YEAR(CURDATE()) 
        GROUP BY all_dates.year, all_dates.month
        ORDER BY all_dates.year, all_dates.month
      ");


      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_animal_schedule", $ref_id)) {
      $animal_id = $ref_id['get_animal_schedule'];
      $this->db->where('animal_id', $animal_id);
      $query = $this->db->get('tbl_animal_schedule');
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("export_monthly_expenses", $ref_id)) {
      $month = $ref_id['month'];
      $year = $ref_id['year'];
      $this->db->where('MONTH(date)', $month);
      $this->db->where('YEAR(date)', $year);
      $this->db->orderBy('date', 'asc');
      $expenses = $this->db->get('tbl_expenses', null, 'expense_name, expense_type, expense_amount, expense_qty, expense_qty_type, expense_total, date');

      // Second query
      $this->db->where('MONTH(date)', $month);
      $this->db->where('YEAR(date)', $year);
      $total_expense = $this->db->getValue('tbl_expenses', 'SUM(expense_total)');
      // Create a new "expense" for the total
      $total_expense_row = array(
        "expense_name" => "Monthly Expenses Total",
        "expense_total" => (int)$total_expense,
        // Add other fields as necessary...
      );
      array_push($expenses, $total_expense_row);
      echo json_encode(array('status' => 'success', 'data' => $expenses, 'method' => 'GET'));
    } else if (array_key_exists("get_all_animals_deceased", $ref_id)) {

      $query = $this->db->rawQuery("SELECT tb2.id,tb2.animal_id, tb1.animal_name,tb1.animal_image, tb1.breed,tb1.age,tb1.size,tb1.sex,tb1.fur_color, tb2.deceased_date, tb2.deceased_time
      FROM tbl_animals_info tb1
      LEFT JOIN tbl_deceased_animals tb2
      ON tb1.animal_id = tb2.animal_id
      WHERE tb1.animal_id = tb2.animal_id
      ");
      if ($query) {
        echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
      } else {
        echo json_encode(array('status' => 'failed', 'data' => $query, 'method' => 'GET'));
      }
    } else if (array_key_exists("get_all_animals_not_deceased", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.animal_id, tb1.animal_name, tb1.animal_image
      FROM tbl_animals_info tb1
      WHERE NOT EXISTS (SELECT 1 FROM tbl_deceased_animals tb2 WHERE tb1.animal_id = tb2.animal_id);");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("getAllSurrenderedAnimals", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.id,tb1.surrenderer_id,  tb2.animal_id,tb2.animal_name,tb2.animal_image,
      COALESCE(tb3.first_name, tb1.surrenderer_name) AS surrenderer_name, COALESCE(tb3.city_municipality, tb1.surrenderer_city_municipality) AS surrenderer_city_municipality, COALESCE(tb3.birth_date, tb1.surrenderer_birth_date) AS surrenderer_birth_date,COALESCE(tb3.sex, tb1.surrenderer_sex) AS surrenderer_sex,COALESCE(tb3.phone_number, tb1.surrenderer_phone_number) AS surrenderer_phone_number,tb1.surrender_date,tb1.surrender_time
      FROM tbl_surrender_animals tb1
      LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
      LEFT JOIN tbl_users tb3 ON tb1.surrenderer_id = tb3.user_id;
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("getAllNotSurrenderedAnimals", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.animal_id, tb1.animal_name, tb1.animal_image
      FROM tbl_animals_info tb1
      WHERE NOT EXISTS (SELECT 1 FROM tbl_surrender_animals tb2 WHERE tb1.animal_id = tb2.animal_id);
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("public_user_id", $ref_id)) {
      $cols = array("user_id,image,first_name,last_name,birth_date,email_address,phone_number,civil_status,occupation,sex,street,brgy_name,city_municipality,province,account_identifier");
      $this->db->where('user_id', $ref_id['public_user_id']);
      $query = $this->db->get("tbl_users", null, $cols);
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_donation_this_month", $ref_id)) {
      $month = $ref_id['get_donation_this_month'];
      $year = $ref_id['year'];
      $query = $this->db->rawQuery("SELECT t1.donation_id,t1.donation_amount, t2.image, t2.email_address,
      IFNULL(CONCAT(t2.first_name,' ',t2.last_name), t3.walk_in_name) AS name
      FROM tbl_donations AS t1
      LEFT JOIN tbl_users AS t2 ON t1.donators_id = t2.user_id
      LEFT JOIN tbl_walk_in_donations AS t3 ON t1.walk_in_id = t3.id
      WHERE MONTH(t1.donation_date) = $month AND t1.donation_status = 2 AND YEAR(t1.donation_date) = $year;

      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_all_in_kind_donations", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.donation_in_kind_id,tb1.donator_id, COALESCE(tb2.first_name, tb1.name) AS name, tb1.donation_type, tb1.qty, tb1.qty_type,COALESCE(CONCAT(tb2.street,' ',tb2.brgy_name,' ', tb2.city_municipality,' ',tb2.province), tb1.address) AS address,COALESCE(tb2.phone_number, tb1.phone_number) AS phone_number, tb1.date,tb1.time FROM tbl_donation_in_kind tb1 LEFT JOIN tbl_users tb2 ON tb1.donator_id = tb2.user_id");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_pending_in_kind_donations", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.donation_in_kind_id,tb1.donator_id, tb1.donation_type, tb1.qty, tb1.qty_type, tb1.address, tb1.supplies_details,COALESCE(CONCAT(tb2.first_name, ' ', tb2.last_name), tb1.name) AS name
      , tb2.image,tb2.phone_number, tb1.date, tb1.time
            FROM tbl_donation_in_kind tb1
            LEFT JOIN tbl_users tb2
            ON tb1.donator_id = tb2.user_id
            WHERE tb1.donation_in_kind_status = 1
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_donations", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.donation_id,tb3.id AS walk_in_id, tb1.donation_date,tb1.donation_time, tb1.donation_amount,
      CASE WHEN tb3.id IS NULL THEN CONCAT(tb2.first_name,' ', tb2.last_name)
                 ELSE CONCAT(tb3.walk_in_name)
             END AS walk_in_name,
             CASE
                 WHEN tb3.id IS NULL THEN CONCAT(tb2.street, ' ', tb2.brgy_name, ', ', tb2.city_municipality, ' ', tb2.province)
                 ELSE CONCAT(tb3.walk_in_address)
             END AS walk_in_address,

             CASE
                 WHEN tb3.id IS NULL THEN 'No'
                 ELSE 'Yes'
             END AS is_walk_in, COALESCE(tb3.phone_number,tb2.phone_number) AS phone_number
      FROM tbl_donations tb1
      LEFT JOIN tbl_users tb2 ON tb1.donators_id = tb2.user_id
      LEFT JOIN tbl_walk_in_donations tb3 ON tb1.walk_in_id = tb3.id WHERE tb1.donation_status = 2
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("donatorsData", $ref_id)) {

      $this->db->join('tbl_cash_donations tbl2', 'tbl1.fund_id = tbl2.fund_id', 'LEFT');
      $this->db->join('tbl_material_donations tbl3', 'tbl1.fund_id = tbl2.fund_id', 'LEFT');
      $this->db->join('tbl_users tbl4', 'tbl1.donor_id = tbl4.user_id', 'LEFT');
      $this->db->where("tbl1.is_deleted", 0);
      $this->db->where("tbl1.status", 2);
      $this->db->orderBy("tbl1.fund_id", "desc");
      $columns = "tbl1.*, tbl2.*";
      $data = $this->db->get("tbl_funds tbl1", null, $columns);

      echo json_encode([
        'status' => 'success',
        'count' => count($data),
        'method' => 'GET'
      ]);
    } else if (array_key_exists("latest_donators", $ref_id)) {

      $this->db->join('tbl_cash_donations tbl2', 'tbl1.fund_id = tbl2.fund_id', 'LEFT');
      $this->db->join('tbl_material_donations tbl3', 'tbl1.fund_id = tbl2.fund_id', 'LEFT');
      $this->db->join('tbl_users tbl4', 'tbl1.donor_id = tbl4.user_id', 'LEFT');
      $this->db->join('tbl_files tbl5', 'tbl4.image_id = tbl5.id', 'LEFT');
      $this->db->where("tbl1.is_deleted", 0);
      $this->db->where("tbl1.status", 2);
      $this->db->orderBy("RAND()");
      $columns = "tbl1.*, tbl2.*,tbl5.image_path,tbl4.sex,CONCAT(tbl4.first_name,' ',tbl4.last_name) as name";
      $data = $this->db->get("tbl_funds tbl1", 10, $columns);

      echo json_encode([
        'status' => 'success',
        'data' => $data,
        'method' => 'GET'
      ]);
    } else if (array_key_exists("get_donations_this_month", $ref_id)) {
      $month = $ref_id['month'];
      $year = $ref_id['year'];
      $query = $this->db->rawQuery("SELECT tb1.donation_id, tb1.donation_amount,
      CASE WHEN tb3.id IS NULL THEN CONCAT(tb2.first_name,' ', tb2.last_name)
                 ELSE CONCAT(tb3.walk_in_name)
             END AS walk_in_name,
             CASE
                 WHEN tb3.id IS NULL THEN 'No'
                 ELSE 'Yes'
             END AS is_walk_in
      FROM tbl_donations tb1
      LEFT JOIN tbl_users tb2 ON tb1.donators_id = tb2.user_id
      LEFT JOIN tbl_walk_in_donations tb3 ON tb1.walk_in_id = tb3.id WHERE tb1.donation_status = 2 AND MONTH(tb1.donation_date) = $month AND YEAR(tb1.donation_date) = $year
      ");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    } else if (array_key_exists("get_pending_donations", $ref_id)) {
      $query = $this->db->rawQuery("SELECT tb1.donation_id, tb1.donation_date, tb1.donation_time, tb1.donation_amount, tb4.animal_name, tb2.image AS donator_image, tb1.image,
      CASE WHEN tb1.walk_in_id IS NULL THEN CONCAT(tb2.first_name,' ', tb2.last_name)
                 ELSE CONCAT(tb3.walk_in_name)
             END AS name,CASE WHEN tb1.walk_in_id IS NULL THEN CONCAT(tb2.phone_number)
                 ELSE CONCAT(tb3.phone_number)
             END AS phone_number,
             CASE
                 WHEN tb3.id IS NULL THEN CONCAT(tb2.street, ' ', tb2.brgy_name, ', ', tb2.city_municipality, ' ', tb2.province)
                 ELSE CONCAT(tb3.walk_in_address)
             END AS address, tb1.reference
      FROM tbl_donations tb1
      LEFT JOIN tbl_users tb2 ON tb1.donators_id = tb2.user_id
      LEFT JOIN tbl_walk_in_donations tb3 ON tb1.walk_in_id = tb3.id
      LEFT JOIN tbl_animals_info tb4 ON tb1.animal_id = tb4.animal_id
      WHERE tb1.donation_status = 1
      ORDER BY tb1.donation_id DESC
");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'GET'));
    }
  }
  public function httpPost($payload)
  {
    $datas = json_encode($payload);
    $arr = json_decode($datas, true);

    if (array_key_exists("add_user", $arr)) {
      $id = $arr['add_user'];

      $query =  $this->db->insert('tbl_users', $arr["add_user"]);
      if ($query) {
        echo json_encode(array('status' => 'success',  'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_animal_report", $arr)) {
      $first_upload =   $this->db->insert('tbl_reports', $arr['add_animal_report']);
      $report_id = $this->db->getInsertId();
      if ($first_upload) {
        foreach ($arr['image'] as $image) {
          $data = array(
            'report_id' => $report_id,
            'image' => $image
          );

          $this->db->insert('tbl_reports_images', $data);
        }
      }
    } else if (array_key_exists("volunteer_request", $arr)) {
      $id = $arr['volunteer_request']['volunteer_id'];

      $query_compar = $this->db->rawQuery("SELECT * FROM tbl_volunteer_form  WHERE volunteer_id = $id ");
      if (Count($query_compar) == 0) {
        $this->db->insert('tbl_volunteer_form', $arr["volunteer_request"]);
        $query = $this->db->rawQuery("SELECT * FROM tbl_volunteer_form WHERE volunteer_id = $id");
        echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'fail', 'data' => "You submitted already!", 'method' => 'POST'));
      }
    } else if (array_key_exists("submit_adoption_form", $arr)) {
      $adoption_data = $arr["submit_adoption_form"];
      $query = $this->db->insert('tbl_adoption_form', $adoption_data);
      $id = $this->db->getInsertId();

      if ($query) {
        echo json_encode(array('status' => 'success', 'id' => $id,  'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed',  'method' => 'POST'));
      }
    } else if (array_key_exists("addRescuedStrayAnimals", $arr)) {
      $name = $arr['addRescuedStrayAnimals']['animal_name'];
      $this->db->insert('tbl_animals_info', $arr["addRescuedStrayAnimals"]);
      $insert = $this->db->rawQuery("SELECT * FROM tbl_animals_info WHERE animal_name = '$name'");


      if (array_key_exists("report_rescue", $arr)) {
        $name = $arr['report_rescue']['reporter_name'];
        // $this->db->set('report_id', 'LAST_INSERT_ID()', FALSE);
        $this->db->insert('tbl_animal_rescue_reports', $arr["report_rescue"]);
        $insert = $this->db->rawQuery("SELECT * FROM tbl_animal_rescue_reports WHERE reporter_name = '$name'");
        echo json_encode(array('status' => 'success', 'data' => $insert, 'method' => 'POST'));
      }
    } else if (array_key_exists("animal_id", $arr) && array_key_exists("user_id", $arr)) {
      // $animal_id = $arr['animal_id_likes'];
      $user_id = $arr['user_id'];

      $this->db->insert('tbl_likes', $arr);
      $query = $this->db->rawQuery("SELECT * FROM tbl_likes where user_id = $user_id");
      echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'POST'));
    } else if (array_key_exists("supplies_form_details", $arr)) {

      $this->db->insert('tbl_donation_in_kind', $arr['supplies_form_details']);
      echo json_encode(array('status' => 'success',  'method' => 'POST'));
    } else if (array_key_exists("add_medicine_group_name", $arr)) {
      $new_group_name =  $this->db->insert('tbl_inventory_medicine_groups', $arr["add_medicine_group_name"]);
      if ($new_group_name) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('group_id', $latest_id)->getOne("tbl_inventory_medicine_groups");
        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      }
    } else if (array_key_exists("add_budget_allocation", $arr)) {
      $latest_ids = array();

      foreach ($arr["add_budget_allocation"] as $obj) {
        $new_budget_allocation = $this->db->insert('tbl_budget_allocation', $obj);

        if ($new_budget_allocation) {
          $latest_id = $this->db->getInsertId();
          array_push($latest_ids, $latest_id);
        }
      }

      $data = $this->db->where('budget_allocation_id', $latest_ids, 'IN')->get("tbl_budget_allocation");
      echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
    } else if (array_key_exists("add_vaccine_group_name", $arr)) {
      $new_group_name =  $this->db->insert('tbl_inventory_vaccine_groups', $arr["add_vaccine_group_name"]);
      if ($new_group_name) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('group_id', $latest_id)->getOne("tbl_inventory_vaccine_groups");
        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      }
    } else if (array_key_exists("add_vitamin_group_name", $arr)) {
      $new_group_name =  $this->db->insert('tbl_inventory_vitamin_groups', $arr["add_vitamin_group_name"]);
      if ($new_group_name) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('group_id', $latest_id)->getOne("tbl_inventory_vitamin_groups");
        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      }
    } else if (array_key_exists("add_expenses", $arr)) {
      $add_expenses = $this->db->insert('tbl_expenses', $arr["add_expenses"]);
      $date = $arr['add_expenses']['date'];
      $data = $this->db->rawQuery("SELECT * FROM tbl_expenses WHERE date = '$date'");
      if ($add_expenses) {
        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_in_kind_donation", $arr)) {
      $add_in_kind = $this->db->insert('tbl_donation_in_kind', $arr["add_in_kind_donation"]);
      $latest_id = $this->db->getInsertId();
      if ($add_in_kind) {
        $data = $this->db->where('donation_in_kind_id', $latest_id)->getOne("tbl_donation_in_kind");
        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_new_schedule_medication", $arr)) {
      $animal_id = $arr['add_new_schedule_medication']['animal_id'];
      $add_schedule = $this->db->insert('tbl_animal_schedule', $arr["add_new_schedule_medication"]);
      if ($add_schedule) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('id', $latest_id)->where('animal_id', $animal_id)->getOne("tbl_animal_schedule");

        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_pets_food", $arr)) {
      $add_pet_food = $this->db->insert('tbl_foods_inventory', $arr["add_pets_food"]);
      if ($add_pet_food) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('food_id', $latest_id)->getOne("tbl_foods_inventory");

        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_account", $arr)) {
      $table = '';
      if ($arr['addTo'] == 'Official') {
        $add_account = $this->db->insert('tbl_officials_account', $arr["add_account"]);
        $table = 'tbl_officials_account';
      } else if ($arr['addTo'] == 'Volunteer') {
        $add_account = $this->db->insert('tbl_volunteer_account', $arr["add_account"]);
        $table = 'tbl_volunteer_account';
      }
      if ($add_account) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('id', $latest_id)->getOne($table);

        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_medicine", $arr)) {
      $add_medicine = $this->db->insert('tbl_inventory_medicine', $arr["add_medicine"]);
      if ($add_medicine) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('medicine_id', $latest_id)->getOne("tbl_inventory_medicine");

        $group_name = $arr["add_medicine"]["group_name"];
        $update = array(
          'no_of_medicine' => $this->db->inc($arr["add_medicine"]["medicine_stocks_qty"])
        );
        $this->db->where('group_name', $group_name);
        $this->db->update('tbl_inventory_medicine_groups', $update);

        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_vaccine", $arr)) {
      $add_vaccine = $this->db->insert('tbl_inventory_vaccine', $arr["add_vaccine"]);
      if ($add_vaccine) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('vaccine_id', $latest_id)->getOne("tbl_inventory_vaccine");

        $group_name = $arr["add_vaccine"]["group_name"];
        $update = array(
          'no_of_vaccine' => $this->db->inc($arr["add_vaccine"]["vaccine_stocks_qty"])
        );
        $this->db->where('group_name', $group_name);
        $this->db->update('tbl_inventory_vaccine_groups', $update);

        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_vitamin", $arr)) {
      $add_vitamin = $this->db->insert('tbl_inventory_vitamin', $arr["add_vitamin"]);
      if ($add_vitamin) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->where('vitamin_id', $latest_id)->getOne("tbl_inventory_vitamin");

        $group_name = $arr["add_vitamin"]["group_name"];
        $update = array(
          'no_of_vitamin' => $this->db->inc($arr["add_vitamin"]["vitamin_stocks_qty"])
        );
        $this->db->where('group_name', $group_name);
        $this->db->update('tbl_inventory_vitamin_groups', $update);

        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_surrendered_animal", $arr)) {
      $array = array(
        'animal_id' => $arr["add_surrendered_animal"]["animal_id"],
        'surrenderer_name' => $arr["add_surrendered_animal"]["surrenderer_name"],
        'surrenderer_city_municipality' => $arr["add_surrendered_animal"]["surrenderer_city_municipality"],
        'surrenderer_sex' => $arr["add_surrendered_animal"]["surrenderer_sex"],
        'surrenderer_birth_date' => $arr["add_surrendered_animal"]["surrenderer_birth_date"],
        'surrenderer_phone_number' => $arr["add_surrendered_animal"]["surrenderer_phone_number"],
        'surrender_date' => $arr["add_surrendered_animal"]["surrender_date"],
        'surrender_time' => $arr["add_surrendered_animal"]["surrender_time"],
      );
      $post = $this->db->insert('tbl_surrender_animals', $array);

      if ($post) {
        $latest_id = $this->db->getInsertId();
        $data = $this->db->rawQuery("SELECT tb1.id,tb1.surrenderer_id,  tb2.animal_id,tb2.animal_name,tb2.animal_image,
        COALESCE(tb3.first_name, tb1.surrenderer_name) AS surrenderer_name, COALESCE(tb3.city_municipality, tb1.surrenderer_city_municipality) AS surrenderer_city_municipality, COALESCE(tb3.birth_date, tb1.surrenderer_birth_date) AS surrenderer_birth_date,COALESCE(tb3.sex, tb1.surrenderer_sex) AS surrenderer_sex,COALESCE(tb3.phone_number, tb1.surrenderer_phone_number) AS surrenderer_phone_number,tb1.surrender_date,tb1.surrender_time
        FROM tbl_surrender_animals tb1
        LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
        LEFT JOIN tbl_users tb3 ON tb1.surrenderer_id = tb3.user_id WHERE tb1.id = $latest_id;");

        // $notif_array = array(
        //   'date' => $arr["add_surrendered_animal"]["date_adopted"],
        //   'time' => $arr["add_surrendered_animal"]["time_adopted"],
        //   'id' => $arr["add_surrendered_animal"]["animal_id"],
        //   'name' => 'pet_information',
        //   'image' => $arr["add_surrendered_animal"]["animal_image"],
        //   'details' => 'A new pet name <b>' . $arr["add_surrendered_animal"]["animal_name"] . '</b> has been surrender in our shelter ',
        //   'status' => '',
        // );
        // $this->db->insert('tbl_notification', $notif_array);
        // $latest_notif_id = $this->db->getInsertId();
        // $notif_data = $this->db->where('notif', $latest_notif_id)->getOne("tbl_notification");
        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_walk_in_donation", $arr)) {
      $add_walk_in_donation = array(
        'walk_in_name' => isset($arr["add_walk_in_donation"]["walk_in_name"]) ? $arr["add_walk_in_donation"]["walk_in_name"] : null,
        'walk_in_address' => isset($arr["add_walk_in_donation"]["walk_in_address"]) ? $arr["add_walk_in_donation"]["walk_in_address"] : null,
        'phone_number' => isset($arr["add_walk_in_donation"]["phone_number"]) ? $arr["add_walk_in_donation"]["phone_number"] : null,
      );

      $walk_in_donation = $this->db->insert('tbl_walk_in_donations', $add_walk_in_donation);

      if ($walk_in_donation) {
        $walk_in_id = $this->db->getInsertId();
        $donation = array(
          'walk_in_id' => $walk_in_id,
          'donation_amount' => $arr["add_walk_in_donation"]["donation_amount"],
          'donation_date' => $arr["add_walk_in_donation"]["donation_date"],
          'donation_time' => $arr["add_walk_in_donation"]["donation_time"],
          'donation_status' => 2,
        );
        $add_donation = $this->db->insert('tbl_donations', $donation);
        if ($add_donation) {
          $data = $this->db->rawQuery("SELECT tb1.donation_id,tb3.id AS walk_in_id, tb1.donation_date,tb1.donation_time, tb1.donation_amount,
          CASE WHEN tb3.id IS NULL THEN CONCAT(tb2.first_name,' ', tb2.last_name)
                     ELSE CONCAT(tb3.walk_in_name)
                 END AS walk_in_name,
                 CASE
                     WHEN tb3.id IS NULL THEN CONCAT(tb2.street, ' ', tb2.brgy_name, ', ', tb2.city_municipality, ' ', tb2.province)
                     ELSE CONCAT(tb3.walk_in_address)
                 END AS walk_in_address,

                 CASE
                     WHEN tb3.id IS NULL THEN 'No'
                     ELSE 'Yes'
                 END AS is_walk_in
                 ,tb3.phone_number
          FROM tbl_donations tb1
          LEFT JOIN tbl_users tb2 ON tb1.donators_id = tb2.user_id
          LEFT JOIN tbl_walk_in_donations tb3 ON tb1.walk_in_id = tb3.id WHERE tb3.id = '$walk_in_id'
          ");
          // $notif_array = array(
          //   'date' => $arr["add_walk_in_donation"]["donation_date"],
          //   'time' => $arr["add_walk_in_donation"]["donation_time"],
          //   'id' => null,
          //   'name' => 'donation',
          //   'notif_for' => 2,
          //   'image' => null,
          //   'details' => 'A new pet name <b>' . $arr["add_walk_in_donation"]["animal_name"] . '</b> has been surrender in our shelter ',
          //   'status' => '',
          // );
          // $this->db->insert('tbl_notification', $notif_array);
          // $latest_notif_id = $this->db->getInsertId();
          // $notif_data = $this->db->where('notif', $latest_notif_id)->getOne("tbl_notification");
          echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
        } else {

          echo json_encode(array('status' => 'failed', 'method' => 'POST'));
        }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("submit_public_donation", $arr)) {
      $donation = $this->db->insert('tbl_donations', $arr['submit_public_donation']);
      if ($donation) {
        echo json_encode(array('status' => 'success', 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists('add_wishlist', $arr)) {
      $name = $arr['name'];
      if ($name == 'medicine') {
        $add_wishlist = $this->db->insert('tbl_wishlist_medicine', $arr['add_wishlist']);
        $latest_wishlist_id = $this->db->getInsertId();
        $data = $this->db->where('wishlist_medicine_id', $latest_wishlist_id)->getOne("tbl_wishlist_medicine");
      } else if ($name == 'food') {
        $add_wishlist = $this->db->insert('tbl_wishlist_food', $arr['add_wishlist']);
        $latest_wishlist_id = $this->db->getInsertId();
        $data = $this->db->where('wishlist_food_id', $latest_wishlist_id)->getOne("tbl_wishlist_food");
      } else {
        $add_wishlist = $this->db->insert('tbl_wishlist_supplies', $arr['add_wishlist']);
        $latest_wishlist_id = $this->db->getInsertId();
        $data = $this->db->where('wishlist_supplies_id', $latest_wishlist_id)->getOne("tbl_wishlist_supplies");
      }
      if ($add_wishlist) {
        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_new_animal", $arr)) {
      $add_new_animal = $this->db->insert('tbl_animals_info', $arr['animal_details']);
      if ($add_new_animal) {
        $new_animal_id = $this->db->getInsertId();
        for ($i = 0; $i < count($arr['animal_image']); $i++) {
          $arr['animal_image'][$i]['animal_id'] = $new_animal_id;

          $new_animal_image = $this->db->insert('tbl_animal_image', $arr['animal_image'][$i]);
        }
        if ($new_animal_image) {
          $data = $this->db->rawQuery("SELECT animal_id,animal_name,animal_type,animal_image,fur_color,breed,behaviour,good_with,age,sex,size,weight,height,length,favorite_meats,favorite_fruits,favorite_vegetables,favorite_treats_snacks ,health,current_state,story FROM tbl_animals_info  WHERE animal_id = '$new_animal_id'
          ");
          echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
        } else {

          echo json_encode(array('status' => 'failed', 'method' => 'POST'));
        }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists("add_new_event", $arr)) {
      $add_new_event = $this->db->insert('tbl_activities_and_events', $arr['add_new_event']);
      if ($add_new_event) {
        $new_event_id = $this->db->getInsertId();
        // for ($i = 0; $i < count($arr['image']); $i++) {
        //   $arr['image'][$i]['activities_events_id'] = $new_event_id;
        //   $new_events_image = $this->db->insert('tbl_activities_and_events_image', $arr['image'][$i]);
        // }
        // if ($new_events_image) {
        $this->db->where("event_id", $new_event_id);
        $data = $this->db->get("tbl_activities_and_events");
        echo json_encode(array('status' => 'success', 'data' => $data, 'method' => 'POST'));
        // }
        // else {

        //   echo json_encode(array('status' => 'failed', 'method' => 'POST'));
        // }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists('add_report_management', $arr)) {
      $add_report_details = $this->db->insert('tbl_reports', $arr['report_details']);
      if ($add_report_details) {
        $report_id = $this->db->getInsertId();
        for ($i = 0; $i < count($arr['images']); $i++) {
          $arr['images'][$i]['report_id'] = $report_id;
          $reports_images = $this->db->insert('tbl_reports_images', $arr['images'][$i]);
        }
        if ($reports_images) {
          $this->db->where('report_id', $report_id);
          $data = $this->db->get("tbl_reports");
          $this->db->where('report_id', $report_id);
          $images = $this->db->get("tbl_reports_images");
          echo json_encode(array('status' => 'success', 'data' => $data, 'images' => $images, 'method' => 'POST'));
        } else {

          echo json_encode(array('status' => 'failed', 'method' => 'POST'));
        }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists('add_announcement_management', $arr)) {
      $add_announcement_details = $this->db->insert('tbl_announcements', $arr['announcement_details']);
      if ($add_announcement_details) {
        $announcement_id = $this->db->getInsertId();
        for ($i = 0; $i < count($arr['images']); $i++) {
          $arr['images'][$i]['announcement_id'] = $announcement_id;
          $announcement_images = $this->db->insert('tbl_announcements_image', $arr['images'][$i]);
        }
        if ($announcement_images) {
          $this->db->where('announcement_id', $announcement_id);
          $data = $this->db->get("tbl_announcements");
          $this->db->where('announcement_id', $announcement_id);
          $images = $this->db->get("tbl_announcements_image");
          echo json_encode(array('status' => 'success', 'data' => $data, 'images' => $images, 'method' => 'POST'));
        } else {

          echo json_encode(array('status' => 'failed', 'method' => 'POST'));
        }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'POST'));
      }
    } else if (array_key_exists('add_deceased_animals', $arr)) {
      $animal_id = $arr['add_deceased_animals']['animal_id'];
      $array = array(
        'animal_id' => $animal_id,
        'deceased_date' => $arr['add_deceased_animals']['deceased_date'],
        'deceased_time' => $arr['add_deceased_animals']['deceased_time'],
      );
      $insert = $this->db->insert('tbl_deceased_animals', $array);
      if ($insert) {
        $query = $this->db->rawQuery("SELECT tb2.id,tb2.animal_id, tb1.animal_name,tb1.animal_image, tb1.breed,tb1.age,tb1.size,tb1.sex,tb1.fur_color,tb2.deceased_date,tb2.deceased_time
        FROM tbl_animals_info tb1
        LEFT JOIN tbl_deceased_animals tb2
        ON tb1.animal_id = tb2.animal_id
        WHERE tb1.animal_id = $animal_id");

        // $notif_array = array(
        //   'date' => $arr["add_deceased_animals"]["deceased_date"],
        //   'time' => $arr["add_deceased_animals"]["deceased_time"],
        //   'id' => $arr["add_deceased_animals"]["animal_id"],
        //   'name' => 'pet_information',
        //   'image' => $arr["add_deceased_animals"]["animal_image"],
        //   'details' => 'We are sad to inform that our beloved <b>' . $arr["add_deceased_animals"]["animal_name"] . '<b/> has now passed away.',
        //   'status' => '',
        // );
        // $this->db->insert('tbl_notification', $notif_array);
        // $latest_notif_id = $this->db->getInsertId();
        // $notif_data = $this->db->where('notif', $latest_notif_id)->getOne("tbl_notification");
        echo json_encode(array('status' => 'success', 'data' => $query,  'method' => 'PUT'));
      } else {
        echo 'update failed: ' . $this->db->getLastError();
      };
    } else if (array_key_exists('add_rescued_stray_animals', $arr)) {
      $animal_id = $arr['add_rescued_stray_animals']['animal_id'];
      $array = array(
        'animal_id' => $arr["add_rescued_stray_animals"]["animal_id"],
        'reporter_name' => $arr["add_rescued_stray_animals"]["reporter_name"],
        'reporter_municipality' => $arr["add_rescued_stray_animals"]["reporter_municipality"],
        'reporter_sex' => $arr["add_rescued_stray_animals"]["reporter_sex"],
        'reporter_birth_date' => $arr["add_rescued_stray_animals"]["reporter_birth_date"],
        'reporter_phone_number' => $arr["add_rescued_stray_animals"]["reporter_phone_number"],
        'rescue_date' => $arr["add_rescued_stray_animals"]["rescue_date"],
        'rescue_time' => $arr["add_rescued_stray_animals"]["rescue_time"],
      );
      $post = $this->db->insert('tbl_rescued_animals', $array);
      if ($post) {
        $latest_rescue_id = $this->db->getInsertId();
        $query = $this->db->rawQuery("SELECT tb1.id,tb1.reporter_id,  tb2.animal_id,tb2.animal_name,
        COALESCE(tb3.first_name, tb1.reporter_name) AS reporter_name, COALESCE(tb3.city_municipality, tb1.reporter_municipality) AS reporter_municipality, COALESCE(tb3.birth_date, tb1.reporter_birth_date) AS reporter_birth_date,COALESCE(tb3.sex, tb1.reporter_sex) AS reporter_sex,COALESCE(tb3.phone_number, tb1.reporter_phone_number) AS reporter_phone_number,tb1.rescue_date,tb1.rescue_time
        FROM tbl_rescued_animals tb1
        LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
        LEFT JOIN tbl_users tb3 ON tb1.reporter_id = tb3.user_id WHERE tb1.id = $latest_rescue_id;");
        // $notif_array = array(
        //   'date' => $arr["add_rescued_stray_animals"]["care_start_date"],
        //   'time' => $arr["add_rescued_stray_animals"]["care_start_time"],
        //   'id' => $arr["add_rescued_stray_animals"]["animal_id"],
        //   'name' => 'pet_information',
        //   'image' => $arr["add_rescued_stray_animals"]["animal_image"],
        //   'details' => '<b>' . $arr["add_rescued_stray_animals"]["animal_name"] . '<b/> has been rescued successfully and now under our <b>Shelter care</b>',
        //   'status' => '',
        // );
        // $this->db->insert('tbl_notification', $notif_array);
        // $latest_notif_id = $this->db->getInsertId();
        // $notif_data = $this->db->where('notif', $latest_notif_id)->getOne("tbl_notification");
        echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'POST'));
      } else {
        echo 'update failed: ' . $this->db->getLastError();
      };
    }
  }
  public function httpPut($payload)
  {
    $datas = json_encode($payload);
    $arr = json_decode($datas, true);
    if (array_key_exists('changePassword', $arr)) {
      $array = array(
        "password" => $arr['password'],
      );
      $email = $arr['email_address'];
      $this->db->where('email_address',  $email);
      $update = $this->db->update('tbl_users', $array);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_public_user_details', $arr)) {
      $user_id = $arr['update_public_user_details']['user_id'];
      $this->db->where('user_id', $user_id);
      $update = $this->db->update('tbl_users', $arr['update_public_user_details']);
    } else if (array_key_exists('notif', $arr)) {
      $notif = $arr['notif'];
      $status = $arr['status'];
      $data = array(
        'status' => $status,

      );
      $this->db->where('notif', $notif);
      if ($this->db->update('tbl_notification', $data)) {
        //  $query = $this->db->rawQuery("SELECT * FROM tbl_users where user_id = '$user_id'");
        // echo json_encode(array('status' => 'success', 'data'=>$query, 'method'=>'GET'));

        echo $this->db->count . ' records were updated';
        return;
      } else {
        echo 'update failed: ' . $this->db->getLastError();
        return;
      };
    } else if (array_key_exists('update_publicuser_email_address', $arr)) {
      $this->db->where('user_id', $arr['user_id']);
      $array = array(
        "email_address" => $arr['update_publicuser_email_address'],
      );
      $query = $this->db->update('tbl_users', $array);
      if ($query) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_password', $arr)) {
      $this->db->where('user_id', $arr['user_id']);
      $array = array(
        "password" => $arr['update_password'],
      );
      $query = $this->db->update('tbl_users', $array);
      if ($query) {
        echo json_encode(array('status' => 'success', 'method' => 'GET'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'GET'));
      };
    } else if (array_key_exists('update_rescued_stray_animals', $arr)) {
      $id = $arr['update_rescued_stray_animals']['id'];
      $array = array(
        "reporter_name" => $arr['update_rescued_stray_animals']['reporter_name'],
        "reporter_municipality" => $arr['update_rescued_stray_animals']['reporter_municipality'],
        "reporter_sex" => $arr['update_rescued_stray_animals']['reporter_sex'],
        "reporter_birth_date" => $arr['update_rescued_stray_animals']['reporter_birth_date'],
        "reporter_phone_number" => $arr['update_rescued_stray_animals']['reporter_phone_number'],
        "rescue_date" => $arr['update_rescued_stray_animals']['rescue_date'],
        "rescue_time" => $arr['update_rescued_stray_animals']['rescue_time'],
      );
      $this->db->where('id', $id);
      $update = $this->db->update('tbl_rescued_animals', $array);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_in_kind_donation', $arr)) {

      $array = array(
        'name' => $arr['update_in_kind_donation']['name'],
        'donation_type' => $arr['update_in_kind_donation']['donation_type'],
        'qty' => $arr['update_in_kind_donation']['qty'],
        'qty_type' => $arr['update_in_kind_donation']['qty_type'],
        'address' => $arr['update_in_kind_donation']['address'],
        'phone_number' => $arr['update_in_kind_donation']['phone_number'],
      );

      $inkind_id = $arr['update_in_kind_donation']['donation_in_kind_id'];
      $this->db->where('donation_in_kind_id', $inkind_id);

      $update = $this->db->update('tbl_donation_in_kind', $array);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_walk_in_donation', $arr)) {
      $donation_id = $arr['update_walk_in_donation']['donation_id'];
      $walk_in_id = $arr['update_walk_in_donation']['walk_in_id'];

      $array = array(
        'donation_amount' => $arr["update_walk_in_donation"]["donation_amount"],
        'donation_date' => $arr["update_walk_in_donation"]["donation_date"],
        'donation_time' => $arr["update_walk_in_donation"]["donation_time"],
      );
      $this->db->where('donation_id', $donation_id);
      $update_donation = $this->db->update('tbl_donations', $array);
      if ($update_donation) {
        $update_info = array(
          'walk_in_name' => $arr["update_walk_in_donation"]["walk_in_name"],
          'walk_in_address' => $arr["update_walk_in_donation"]["walk_in_address"],
          'phone_number' => $arr["update_walk_in_donation"]["phone_number"],
        );
        $this->db->where('id', $walk_in_id);
        $update_info = $this->db->update('tbl_walk_in_donations', $update_info);

        if ($update_info) {
          echo json_encode(array('status' => 'success', 'method' => 'PUT'));
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_surrendered_animal', $arr)) {
      $array = array(
        "surrenderer_name" => $arr['update_surrendered_animal']['surrenderer_name'],
        "surrenderer_city_municipality" => $arr['update_surrendered_animal']['surrenderer_city_municipality'],
        "surrenderer_sex" => $arr['update_surrendered_animal']['surrenderer_sex'],
        "surrenderer_birth_date" => $arr['update_surrendered_animal']['surrenderer_birth_date'],
        "surrenderer_phone_number" => $arr['update_surrendered_animal']['surrenderer_phone_number'],
        "surrender_date" => $arr['update_surrendered_animal']['surrender_date'],
        "surrender_time" => $arr['update_surrendered_animal']['surrender_time'],
      );
      $id = $arr['update_surrendered_animal']['id'];
      $this->db->where('id', $id);
      $update = $this->db->update('tbl_surrender_animals', $array);

      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_deceased_animals', $arr)) {
      $id = $arr['update_deceased_animals']['id'];
      $array = array(
        "deceased_date" => $arr['update_deceased_animals']['deceased_date'],
        "deceased_time" => $arr['update_deceased_animals']['deceased_time'],
      );
      $this->db->where('id', $id);
      $update = $this->db->update('tbl_deceased_animals', $array);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_rehomed_pets', $arr)) {
      $id = $arr['update_rehomed_pets']['id'];
      $array = array(
        'adopter_name' => $arr["update_rehomed_pets"]["adopter_name"],
        'adopter_sex' => $arr["update_rehomed_pets"]["adopter_sex"],
        'adopter_city_municipality' => $arr["update_rehomed_pets"]["adopter_city_municipality"],
        'adopter_birth_date' => $arr["update_rehomed_pets"]["adopter_birth_date"],
        'adopter_phone_number' => $arr["update_rehomed_pets"]["adopter_phone_number"],
        'date_adopted' => $arr["update_rehomed_pets"]["date_adopted"],
        'time_adopted' => $arr["update_rehomed_pets"]["time_adopted"],
      );
      $this->db->where('id', $id);
      $update = $this->db->update('tbl_adopted_animals', $array);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_wishlist', $arr)) {

      $name = $arr['name'];
      $change = $arr['change'];
      $deleted_wishlist = '';
      if ($name == 'medicine') {
        $medicine_id = $arr['update_wishlist']['wishlist_medicine_id'];
        $this->db->where('wishlist_medicine_id', $medicine_id);
        if ($change == 'update') {
          $update = $this->db->update('tbl_wishlist_medicine', $arr['update_wishlist']);
        } else {
          $delete = $this->db->delete('tbl_wishlist_medicine');
          $deleted_wishlist = 'medicine';
        }
      } else if ($name == 'food') {
        $food_id = $arr['update_wishlist']['wishlist_food_id'];
        $this->db->where('wishlist_food_id', $food_id);
        if ($change == 'update') {
          $update = $this->db->update('tbl_wishlist_food', $arr['update_wishlist']);
        } else {
          $delete = $this->db->delete('tbl_wishlist_food');
          $deleted_wishlist = 'food';
        }
      } else if ($name == 'supplies') {
        $supplies_id = $arr['update_wishlist']['wishlist_supplies_id'];
        $this->db->where('wishlist_supplies_id', $supplies_id);
        if ($change == 'update') {
          $update = $this->db->update('tbl_wishlist_supplies', $arr['update_wishlist']);
        } else {
          $delete = $this->db->delete('tbl_wishlist_supplies');
          $deleted_wishlist = 'supplies';
        }
      };
      if (isset($update)) {
        if ($update) {
          echo json_encode(array('status' => 'success', 'method' => 'PUT'));
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        };
      }
      if (isset($delete)) {

        if ($delete) {
          echo json_encode(array('status' => 'success', 'deleted_wishlist' => $deleted_wishlist, 'method' => 'DELETE'));
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
        };
      }
    } else if (array_key_exists('update_medicine', $arr)) {
      $medicine_id = $arr['update_medicine']['medicine_id'];
      $current_group_name = $arr['update_medicine']['group_name'];
      $current_stocks_qty = $arr['update_medicine']['medicine_stocks_qty'];
      $previous_group_name = $this->db->where('medicine_id', $medicine_id)->getValue('tbl_inventory_medicine', 'group_name');
      $previous_medicine_stocks_qty = $this->db->where('medicine_id', $medicine_id)->getValue('tbl_inventory_medicine', 'medicine_stocks_qty');
      $this->db->where('medicine_id', $medicine_id);
      $update = $this->db->update('tbl_inventory_medicine', $arr['update_medicine']);
      if ($current_group_name == $previous_group_name) {
        // Update vaccine directly
        if ($previous_medicine_stocks_qty > $current_stocks_qty) {
          //minus
          $difference = $previous_medicine_stocks_qty - $current_stocks_qty;
          $update_array = array(
            'no_of_medicine' => $this->db->dec($difference)
          );
          $this->db->where('group_name', $current_group_name);
          $update = $this->db->update('tbl_inventory_medicine_groups', $update_array);
        } else if ($previous_medicine_stocks_qty < $current_stocks_qty) {
          //add
          $difference = $current_stocks_qty - $previous_medicine_stocks_qty;
          $update_array = array(
            'no_of_medicine' => $this->db->inc($difference)
          );
          $this->db->where('group_name', $current_group_name);
          $update = $this->db->update('tbl_inventory_medicine_groups', $update_array);
        }
      } else {
        // Increment in current group
        $update_array = array(
          'no_of_medicine' => $this->db->inc($arr["update_medicine"]["medicine_stocks_qty"])
        );
        $this->db->where('group_name', $current_group_name);
        $update = $this->db->update('tbl_inventory_medicine_groups', $update_array);
        if ($update) {
          // Decrement in previous group
          $update_array = array(
            'no_of_medicine' => $this->db->dec($arr["update_medicine"]["medicine_stocks_qty"], $current_stocks_qty)
          );
          $this->db->where('group_name', $previous_group_name);
          $update = $this->db->update('tbl_inventory_medicine_groups', $update_array);
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        };
      }
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_vaccine', $arr)) {
      $vaccine_id = $arr['update_vaccine']['vaccine_id'];
      $current_group_name = $arr['update_vaccine']['group_name'];
      $current_stocks_qty = $arr['update_vaccine']['vaccine_stocks_qty'];
      $previous_group_name = $this->db->where('vaccine_id', $vaccine_id)->getValue('tbl_inventory_vaccine', 'group_name');
      $previous_vaccine_stocks_qty = $this->db->where('vaccine_id', $vaccine_id)->getValue('tbl_inventory_vaccine', 'vaccine_stocks_qty');
      $this->db->where('vaccine_id', $vaccine_id);
      $update = $this->db->update('tbl_inventory_vaccine', $arr['update_vaccine']);
      if ($current_group_name == $previous_group_name) {
        // Update vaccine directly
        if ($previous_vaccine_stocks_qty > $current_stocks_qty) {
          //minus
          $difference = $previous_vaccine_stocks_qty - $current_stocks_qty;
          $update_array = array(
            'no_of_vaccine' => $this->db->dec($difference)
          );
          $this->db->where('group_name', $current_group_name);
          $update = $this->db->update('tbl_inventory_vaccine_groups', $update_array);
        } else if ($previous_vaccine_stocks_qty < $current_stocks_qty) {
          //add
          $difference = $current_stocks_qty - $previous_vaccine_stocks_qty;
          $update_array = array(
            'no_of_vaccine' => $this->db->inc($difference)
          );
          $this->db->where('group_name', $current_group_name);
          $update = $this->db->update('tbl_inventory_vaccine_groups', $update_array);
        }
      } else {
        // Increment in current group
        $update_array = array(
          'no_of_vaccine' => $this->db->inc($arr["update_vaccine"]["vaccine_stocks_qty"])
        );
        $this->db->where('group_name', $current_group_name);
        $update = $this->db->update('tbl_inventory_vaccine_groups', $update_array);
        if ($update) {
          // Decrement in previous group
          $update_array = array(
            'no_of_vaccine' => $this->db->dec($arr["update_vaccine"]["vaccine_stocks_qty"], $current_stocks_qty)
          );
          $this->db->where('group_name', $previous_group_name);
          $update = $this->db->update('tbl_inventory_vaccine_groups', $update_array);
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        };
      }
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_vitamin', $arr)) {
      $vitamin_id = $arr['update_vitamin']['vitamin_id'];
      $current_group_name = $arr['update_vitamin']['group_name'];
      $current_stocks_qty = $arr['update_vitamin']['vitamin_stocks_qty'];
      $previous_group_name = $this->db->where('vitamin_id', $vitamin_id)->getValue('tbl_inventory_vitamin', 'group_name');
      $previous_vitamin_stocks_qty = $this->db->where('vitamin_id', $vitamin_id)->getValue('tbl_inventory_vitamin', 'vitamin_stocks_qty');
      $this->db->where('vitamin_id', $vitamin_id);
      $update = $this->db->update('tbl_inventory_vitamin', $arr['update_vitamin']);
      if ($current_group_name == $previous_group_name) {
        // Update vaccine directly
        if ($previous_vitamin_stocks_qty > $current_stocks_qty) {
          //minus
          $difference = $previous_vitamin_stocks_qty - $current_stocks_qty;
          $update_array = array(
            'no_of_vitamin' => $this->db->dec($difference)
          );
          $this->db->where('group_name', $current_group_name);
          $update = $this->db->update('tbl_inventory_vitamin_groups', $update_array);
        } else if ($previous_vitamin_stocks_qty < $current_stocks_qty) {
          //add
          $difference = $current_stocks_qty - $previous_vitamin_stocks_qty;
          $update_array = array(
            'no_of_vitamin' => $this->db->inc($difference)
          );
          $this->db->where('group_name', $current_group_name);
          $update = $this->db->update('tbl_inventory_vitamin_groups', $update_array);
        }
      } else {
        // Increment in current group
        $update_array = array(
          'no_of_vitamin' => $this->db->inc($arr["update_vitamin"]["vitamin_stocks_qty"])
        );
        $this->db->where('group_name', $current_group_name);
        $update = $this->db->update('tbl_inventory_vitamin_groups', $update_array);
        if ($update) {
          // Decrement in previous group
          $update_array = array(
            'no_of_vitamin' => $this->db->dec($arr["update_vitamin"]["vitamin_stocks_qty"], $current_stocks_qty)
          );
          $this->db->where('group_name', $previous_group_name);
          $update = $this->db->update('tbl_inventory_vitamin_groups', $update_array);
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        };
      }
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_pet_food', $arr)) {
      $food_id = $arr['update_pet_food']['food_id'];
      $this->db->where('food_id', $food_id);
      $update = $this->db->update('tbl_foods_inventory', $arr['update_pet_food']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('decline_adoption_request', $arr)) {
      $adoption_id = $arr['decline_adoption_request'];
      $this->db->where('id', $adoption_id);
      $update = $this->db->update('tbl_form_adoption', $arr['adoption_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('approve_adoption_request', $arr)) {
      $adoption_id = $arr['approve_adoption_request'];
      $this->db->where('id', $adoption_id);
      $update = $this->db->update('tbl_form_adoption', $arr['adoption_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('update_adoption_request', $arr)) {
      $adoption_id = $arr['update_adoption_request'];
      $this->db->where('id', $adoption_id);
      $update = $this->db->update('tbl_form_adoption', $arr['review_form']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('decline_rescue_request', $arr)) {
      $report_id = $arr['decline_rescue_request'];
      $this->db->where('report_id', $report_id);
      $update = $this->db->update('tbl_reports', $arr['report_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('approve_rescue_request', $arr)) {
      $report_id = $arr['approve_rescue_request'];
      $this->db->where('report_id', $report_id);
      $update = $this->db->update('tbl_reports', $arr['report_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('decline_volunteer_request', $arr)) {
      $volunteer_id = $arr['decline_volunteer_request'];
      $this->db->where('volunteer_id', $volunteer_id);
      $update = $this->db->update('tbl_volunteer_form', $arr['volunteer_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('approve_volunteer_request', $arr)) {
      $volunteer_id = $arr['approve_volunteer_request'];
      $this->db->where('volunteer_id', $volunteer_id);
      $update = $this->db->update('tbl_volunteer_form', $arr['volunteer_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('decline_in_kind_donation', $arr)) {
      $donation_in_kind_id = $arr['decline_in_kind_donation'];
      $this->db->where('donation_in_kind_id', $donation_in_kind_id);
      $update = $this->db->update('tbl_donation_in_kind', $arr['donation_in_kind_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('approve_in_kind_donation', $arr)) {
      $donation_in_kind_id = $arr['approve_in_kind_donation'];
      $this->db->where('donation_in_kind_id', $donation_in_kind_id);
      $update = $this->db->update('tbl_donation_in_kind', $arr['donation_in_kind_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('decline_donation', $arr)) {
      $donation_id = $arr['decline_donation'];
      $this->db->where('donation_id', $donation_id);
      $update = $this->db->update('tbl_donations', $arr['donation_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists('approve_donation', $arr)) {
      $donation_id = $arr['approve_donation'];
      $this->db->where('donation_id', $donation_id);
      $update = $this->db->update('tbl_donations', $arr['donation_status']);
      if ($update) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      };
    } else if (array_key_exists("image", $arr)) {

      $id = $arr['user_id'];
      var_dump($id);
      $data = array(
        'user_id' => $id,
        'image' => $arr['image'],
        'user_image_name' => $arr['user_image_name'],
      );
      $this->db->where('user_id', $id);
      if ($this->db->update('tbl_users', $data))
        echo $this->db->count . ' records were updated';
      else
        echo 'update failed: ' . $this->db->getLastError();
    } else if (array_key_exists('updateRescuedStrayAnimals', $arr)) {
      $user_id = $arr['updateRescuedStrayAnimals']['animal_id'];
      $this->db->where('animal_id', $user_id);
      $this->db->update('tbl_animals_info', $arr['updateRescuedStrayAnimals']);
      $insert = $this->db->rawQuery("SELECT * FROM tbl_animals_info where animal_id = '$user_id'");
      // echo json_encode(array('status'=> 'success', 'data'=>$insert, 'method' => 'PUT'));


      if (array_key_exists('updateRescueReport', $arr)) {
        $user_id = $arr['updateRescueReport']['report_id'];
        $this->db->where('report_id', $user_id);
        $this->db->update('tbl_animal_rescue_reports', $arr['updateRescueReport']);
        $insert = $this->db->rawQuery("SELECT * FROM tbl_animal_rescue_reports where report_id = '$user_id'");
        echo json_encode(array('status' => 'success', 'data' => $insert, 'method' => 'PUT'));
      }
    } else if (array_key_exists('add_rehomed_pets', $arr)) {
      $animal_id = $arr['add_rehomed_pets']['animal_id'];
      $array = array(
        'animal_id' => $arr["add_rehomed_pets"]["animal_id"],
        'adopter_name' => $arr["add_rehomed_pets"]["adopter_name"],
        'adopter_sex' => $arr["add_rehomed_pets"]["adopter_sex"],
        'adopter_city_municipality' => $arr["add_rehomed_pets"]["adopter_city_municipality"],
        'adopter_birth_date' => $arr["add_rehomed_pets"]["adopter_birth_date"],
        'adopter_phone_number' => $arr["add_rehomed_pets"]["adopter_phone_number"],
        'date_adopted' => $arr["add_rehomed_pets"]["date_adopted"],
        'time_adopted' => $arr["add_rehomed_pets"]["time_adopted"],
      );

      $update = $this->db->insert('tbl_adopted_animals', $array);

      if ($update) {
        $latest_rehomed_pet_id = $this->db->getInsertId();
        $query = $this->db->rawQuery("SELECT tb1.id,  tb2.animal_id,tb2.animal_name,
      COALESCE(tb3.first_name, tb1.adopter_name) AS adopter_name, COALESCE(tb3.city_municipality, tb1.adopter_city_municipality) AS adopter_city_municipality, COALESCE(tb3.birth_date, tb1.adopter_birth_date) AS adopter_birth_date,COALESCE(tb3.sex, tb1.adopter_sex) AS adopter_sex,COALESCE(tb3.phone_number, tb1.adopter_phone_number) AS adopter_phone_number,tb1.date_adopted,tb1.time_adopted
      FROM tbl_adopted_animals tb1
      LEFT JOIN tbl_animals_info tb2 ON tb1.animal_id = tb2.animal_id
      LEFT JOIN tbl_users tb3 ON tb1.adopter_id = tb3.user_id WHERE tb1.id = $latest_rehomed_pet_id;
      ");
        // $notif_array = array(
        //   'date' => $arr["add_rehomed_pets"]["date_adopted"],
        //   'time' => $arr["add_rehomed_pets"]["time_adopted"],
        //   'id' => $arr["add_rehomed_pets"]["animal_id"],
        //   'name' => 'pet_information',
        //   'image' => $arr["add_rehomed_pets"]["animal_image"],
        //   'details' => $arr["add_rehomed_pets"]["animal_name"] . ' has found his/her forever home with ' . $arr["add_rehomed_pets"]["pet_owner_name"],
        //   'status' => '',
        // );
        // $this->db->insert('tbl_notification', $notif_array);
        // $latest_notif_id = $this->db->getInsertId();
        // $notif_data = $this->db->where('notif', $latest_notif_id)->getOne("tbl_notification");
        // echo json_encode(array('status' => 'success', 'data' => $query, 'notif_data' => $notif_data, 'method' => 'PUT'));
        echo json_encode(array('status' => 'success', 'data' => $query, 'method' => 'PUT'));
      } else {
        echo 'update failed: ' . $this->db->getLastError();
      };
    } else if (array_key_exists('updateSurrenderedAnimals', $arr)) {
      $user_id = $arr['updateSurrenderedAnimals']['pet_transfer_id'];
      $this->db->where('pet_transfer_id', $user_id);
      $this->db->update('tbl_animal_transfer', $arr['updateSurrenderedAnimals']);
      $insert = $this->db->rawQuery("SELECT * FROM tbl_animal_transfer where pet_transfer_id = '$user_id'");
      echo json_encode(array('status' => 'success', 'data' => $insert, 'method' => 'PUT'));
    } else if (array_key_exists('updateInKindDonations', $arr)) {
      $user_id = $arr['updateInKindDonations']['inkind_id'];
      $this->db->where('inkind_id', $user_id);
      $this->db->update('tbl_donations_in_kind', $arr['updateInKindDonations']);
      $insert = $this->db->rawQuery("SELECT * FROM tbl_donations_in_kind where inkind_id = '$user_id'");
      echo json_encode(array('status' => 'success', 'data' => $insert, 'method' => 'PUT'));
    } else if (array_key_exists('update_expenses', $arr)) {
      $expense_id = $arr['update_expenses']['expense_id'];
      $this->db->where('expense_id', $expense_id);
      $update_status = $this->db->update('tbl_expenses', $arr['update_expenses']);
      if ($update_status) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_official_account', $arr)) {
      $id = $arr['update_official_account']['id'];
      $this->db->where('id', $id);
      $update_status = $this->db->update('tbl_officials_account', $arr['update_official_account']);
      if ($update_status) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_volunteer_account', $arr)) {
      $id = $arr['update_volunteer_account']['id'];
      $this->db->where('id', $id);
      $update_status = $this->db->update('tbl_volunteer_account', $arr['update_volunteer_account']);
      if ($update_status) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_schedule_animal', $arr)) {
      $id = $arr['update_schedule_animal']['id'];
      $this->db->where('id', $id);
      $update_status = $this->db->update('tbl_animal_schedule', $arr['update_schedule_animal']);
      if ($update_status) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_specific_animal', $arr)) {
      $animal_id = $arr['animal_details']['animal_id'];
      $this->db->where('animal_id', $animal_id);
      $update_animal_details = $this->db->update('tbl_animals_info', $arr['animal_details']);
      if ($update_animal_details) {
        $all_updates_successful = true;
        foreach ($arr['animal_image'] as $image) {
          $data = array(
            'animal_image' => $image['animal_image'] // this should be your new value
          );
          $this->db->where('id', $image['id']);
          $this->db->where('animal_id', $image['animal_id']);
          $updated_animal_image = $this->db->update('tbl_animal_image', $data);
          if (!$updated_animal_image) {
            $all_updates_successful = false;
            break;
          }
        }
        if ($all_updates_successful) { // check the $all_updates_successful flag here
          echo json_encode(array('status' => 'success', 'method' => 'PUT'));
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_report', $arr)) {
      $report_id = $arr['report_details']['report_id'];
      $this->db->where('report_id', $report_id);
      $update_report_details = $this->db->update('tbl_reports', $arr['report_details']);
      if ($update_report_details) {
        $this->db->where('report_id', $report_id);
        $delete_images = $this->db->delete('tbl_reports_images');
        if ($delete_images) {
          for ($i = 0; $i < count($arr["images"]); $i++) {

            $add_new_images = $this->db->insert('tbl_reports_images', $arr["images"][$i]);
          }
          if ($add_new_images) {
            echo json_encode(array('status' => 'success', 'method' => 'PUT'));
          } else {
            echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
          }
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_announcement', $arr)) {
      $announcement_id = $arr['announcement_details']['announcement_id'];
      $this->db->where('announcement_id', $announcement_id);
      $update_announcement_details = $this->db->update('tbl_announcements', $arr['announcement_details']);
      if ($update_announcement_details) {
        $this->db->where('announcement_id', $announcement_id);
        $delete_images = $this->db->delete('tbl_announcements_image');
        if ($delete_images) {
          for ($i = 0; $i < count($arr["images"]); $i++) {
            $add_new_images = $this->db->insert('tbl_announcements_image', $arr["images"][$i]);
          }
          if ($add_new_images) {
            echo json_encode(array('status' => 'success',  'method' => 'PUT'));
          } else {
            echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
          }
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        }
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('update_budget_allocation', $arr)) {
      foreach ($arr['update_budget_allocation'] as $item) {
        $data = (array) $item;
        $this->db->where('budget_allocation_id', $data['budget_allocation_id']);
        $update_status = $this->db->update('tbl_budget_allocation', $data);
        if ($update_status) {
          echo json_encode(array('status' => 'success', 'method' => 'PUT'));
        } else {
          echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
        }
      }
    } else if (array_key_exists('grant_privilege', $arr)) {
      $data = $arr['grant_privilege'];
      $this->db->where('id', $data['id']);
      $update_status = $this->db->update('tbl_officials_account', $data);
      if ($update_status) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('account_activate', $arr)) {
      $data = $arr['account_activate'];
      $this->db->where('id', $data['id']);
      $update_status = $this->db->update('tbl_officials_account', $data);
      if ($update_status) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    } else if (array_key_exists('official_authorization', $arr)) {
      $data = $arr['official_authorization'];
      $this->db->where('id', $data['id']);
      $update_status = $this->db->update('tbl_officials_account', $data);
      if ($update_status) {
        echo json_encode(array('status' => 'success', 'method' => 'PUT'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'PUT'));
      }
    }
  }
  public function httpDelete($payload)
  {
    $datas = json_encode($payload);
    $arr = json_decode($datas, true);
    $del = idate("U");

    if (array_key_exists('date_liked', $arr)) {
      $user_id = $arr['user_id'];
      $animal_id = $arr['animal_id'];
      $this->db->where('user_id', $user_id);
      $this->db->where('animal_id', $animal_id);
      if ($this->db->delete('tbl_likes'))
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
    } else if (array_key_exists('delete_rehomed_pets', $arr)) {
      $array = $arr['delete_rehomed_pets'];

      foreach ($array as $id) {
        $this->db->where('id', $id);
        $query = $this->db->delete('tbl_adopted_animals');
      }

      if ($query) {

        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      }
    } else
    if (array_key_exists('deleteItem', $arr)) {
      $id = $arr['deleteItem'];
      $this->db->rawQuery("UPDATE tbl_animals_info SET deleted_at='$del' WHERE animal_id = '$id' ");

      // $length = sizeof($arr['deleteItem']['animal_id']);
      // for ($x = 0; $x < $length; $x++) {
      //   $i = $arr['animal_id'][$x];
      //   $query = $this->db->rawQuery("UPDATE tbl_emp_information SET deleted_at='$del' WHERE animal_id =  '$i' ");
      // }
      // $this->db->where('deleted_at', 0);
      echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      return;
    } else if (array_key_exists('resolveMedicine', $arr)) {
      $date = $arr['resolveMedicine'];
      $this->db->where('expiry_date', $date, '<');
      if ($this->db->delete('tbl_inventory_medicine'))
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      return;
    } else if (array_key_exists('resolveVaccine', $arr)) {
      $date = $arr['resolveVaccine'];
      $this->db->where('expiry_date', $date, '<');
      if ($this->db->delete('tbl_inventory_vaccine'))
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      return;
    } else if (array_key_exists('delete_official_activity', $arr)) {
      $id = $arr['delete_official_activity']['id'];
      $this->db->where('id', $id);
      $delete = $this->db->delete('tbl_system_activity');
      if ($delete) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      }
    } else if (array_key_exists('resolveVitamin', $arr)) {
      $date = $arr['resolveVitamin'];
      $this->db->where('expiry_date', $date, '<');
      if ($this->db->delete('tbl_inventory_vitamin'))
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      return;
    } else if (array_key_exists('delete_schedule_animal', $arr)) {
      $id = $arr['delete_schedule_animal'];
      $this->db->where('id', $id);
      $delete = $this->db->delete("tbl_animal_schedule");
      if ($delete) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      }
      return;
    } else  if (array_key_exists('delete_animal', $arr)) {
      $array = $arr['delete_animal'];

      foreach ($array as $id) {
        $this->db->where('animal_id', $id);
        $delete = $this->db->delete("tbl_animals_info");

        if ($delete) {
          $this->db->where('id', $id);
          $delete = $this->db->delete("tbl_animal_image");
        }
      }
      if ($delete) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      }
    } else if (array_key_exists('delete_medicine', $arr)) {
      $array = $arr['delete_medicine'];
      $deleteStatus = 'success';
      foreach ($array as $data) {
        $this->db->where('medicine_id', $data['medicine_id']);
        $delete = $this->db->delete("tbl_inventory_medicine");
        if ($delete) {
          $group_name = $data["group_name"];
          $current_qty = $this->db->where('group_name', $group_name)->getValue('tbl_inventory_medicine_groups', 'no_of_medicine');
          $update_qty = $current_qty - $data["medicine_stocks_qty"];
          $update = array(
            'no_of_medicine' => $update_qty
          );
          $this->db->where('group_name', $group_name);
          $this->db->update('tbl_inventory_medicine_groups', $update);
        } else {
          $deleteStatus = 'failed';
          break;
        }
      }
      echo json_encode(array('status' => $deleteStatus, 'method' => 'DELETE'));
    } else if (array_key_exists('delete_vaccine', $arr)) {
      $array = $arr['delete_vaccine'];
      $deleteStatus = 'success';
      foreach ($array as $data) {
        $this->db->where('vaccine_id', $data['vaccine_id']);
        $delete = $this->db->delete("tbl_inventory_vaccine");
        if ($delete) {
          $group_name = $data["group_name"];
          $current_qty = $this->db->where('group_name', $group_name)->getValue('tbl_inventory_vaccine_groups', 'no_of_vaccine');

          $update_qty = $current_qty - $data["vaccine_stocks_qty"];
          $update = array(
            'no_of_vaccine' => $update_qty
          );
          $this->db->where('group_name', $group_name);
          $this->db->update('tbl_inventory_vaccine_groups', $update);
        } else {
          $deleteStatus = 'failed';
          break;
        }
      };
      echo json_encode(array('status' => $deleteStatus, 'method' => 'DELETE'));
    } else if (array_key_exists('delete_vitamin', $arr)) {

      $array = $arr['delete_vitamin'];
      $deleteStatus = 'success';
      foreach ($array as $data) {

        $this->db->where('vitamin_id', $data['vitamin_id']);
        $delete = $this->db->delete("tbl_inventory_vitamin");
        if ($delete) {
          $group_name = $data["group_name"];
          $current_qty = $this->db->where('group_name', $group_name)->getValue('tbl_inventory_vitamin_groups', 'no_of_vitamin');
          $update_qty = $current_qty - $data["vitamin_stocks_qty"];
          $update = array(
            'no_of_vitamin' => $update_qty
          );
          $this->db->where('group_name', $group_name);
          $this->db->update('tbl_inventory_vitamin_groups', $update);
        } else {
          $deleteStatus = 'failed';
          break;
        }
      }
      echo json_encode(array('status' => $deleteStatus, 'method' => 'DELETE'));
    } else if (array_key_exists('delete_surrendered_animal', $arr)) {

      $array = $arr['delete_surrendered_animal'];
      foreach ($array as $id) {
        $this->db->where('id', $id);
        $delete = $this->db->delete("tbl_surrender_animals");
      }

      if ($delete) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      }
    } else if (array_key_exists('delete_in_kind_donation', $arr)) {
      $array = $arr['delete_in_kind_donation'];
      foreach ($array as $id) {
        $this->db->where('donation_in_kind_id', $id);
        $delete = $this->db->delete("tbl_donation_in_kind");
      }

      if ($delete) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
        return;
      }
    } else if (array_key_exists('delete_pet_food', $arr)) {
      foreach ($arr['delete_pet_food'] as $id) {

        $this->db->where('food_id', $id);
        $delete = $this->db->delete("tbl_foods_inventory");
      }
      if ($delete) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      }
    } else if (array_key_exists('delete_walk_in_donation', $arr)) {
      foreach ($arr['delete_walk_in_donation'] as $id) {

        $this->db->where('donation_id', $id);
        $delete_donation = $this->db->delete('tbl_donations');
        if ($delete_donation) {
          $this->db->where('id', $id);
          $delete_walk_in_donation = $this->db->delete('tbl_walk_in_donations');
        }
      }

      if ($delete_walk_in_donation) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      }
    } else if (array_key_exists('delete_deceased_animals', $arr)) {
      $array = $arr['delete_deceased_animals'];
      foreach ($array as $id) {
        $this->db->where('id', $id);
        $delete_deceased = $this->db->delete('tbl_deceased_animals');
      }

      if ($delete_deceased) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      };
    } else if (array_key_exists('delete_rescued_stray_animals', $arr)) {
      $array = $arr['delete_rescued_stray_animals'];

      foreach ($array as $id) {
        $this->db->where('id', $id);
        $delete = $this->db->delete('tbl_rescued_animals');
      }

      if ($delete) {
        echo json_encode(array('status' => 'success', 'method' => 'DELETE'));
      } else {
        echo json_encode(array('status' => 'failed', 'method' => 'DELETE'));
      };
    }
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
