-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2025 at 01:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_activities_and_events`
--

CREATE TABLE `tbl_activities_and_events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `days` int(11) DEFAULT NULL,
  `bgcolor` varchar(50) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `image_gallery` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = false, 1 = true',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_activities_and_events`
--

INSERT INTO `tbl_activities_and_events` (`id`, `title`, `details`, `date`, `time`, `duration`, `days`, `bgcolor`, `icon`, `image_gallery`, `created_at`, `created_by`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(1, '1st of the Month', 'Everything is funny as long as it is happening to someone else', '2025-05-01', NULL, NULL, NULL, 'orange', NULL, NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(2, 'Sisters Birthday', 'Buy a nice present', '2025-05-04', NULL, NULL, NULL, 'green', 'fas fa-birthday-cake', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(3, 'Meeting', 'Time to pitch my idea to the company', '2025-05-10', '10:00:00', 120, NULL, 'red', 'fas fa-handshake', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(4, 'Lunch', 'Company is paying!', '2025-05-10', '11:30:00', 90, NULL, 'teal', 'fas fa-hamburger', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(5, 'Visit mom', 'Always a nice chat with mom', '2025-05-20', '17:00:00', 90, NULL, 'grey', 'fas fa-car', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(6, 'Conference', 'Teaching Javascript 101', '2025-05-22', '08:00:00', 540, NULL, 'blue', 'fas fa-chalkboard-teacher', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(7, 'Girlfriend', 'Meet GF for dinner at Swanky Restaurant', '2025-05-22', '19:00:00', 180, NULL, 'teal', 'fas fa-utensils', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(8, 'Rowing', 'Stay in shape!', '2025-05-27', NULL, NULL, 2, 'purple', 'rowing', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(9, 'Fishing', 'Time for some weekend R&R', '2025-05-27', NULL, NULL, 2, 'purple', 'fas fa-fish', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(10, 'Vacation', 'Trails and hikes, going camping! Don\'t forget to bring bear spray!', '2025-05-29', NULL, NULL, 5, 'purple', 'fas fa-plane', NULL, '2025-05-10 10:26:14', NULL, '2025-05-10 10:26:14', 0, NULL),
(11, 'Mother\'s Day', NULL, '2025-05-11', '08:00:00', 60, NULL, 'pink', NULL, NULL, '2025-05-11 08:22:23', NULL, '2025-05-11 08:22:23', 0, NULL),
(12, 'Fathers\'s Day', 'Father special holiday', '2025-05-12', '09:06:00', 230, NULL, 'deep-orange', NULL, NULL, '2025-05-11 08:23:30', NULL, '2025-05-11 08:23:30', 0, NULL),
(13, 'The Lost cat event hearing in the Philippines', 'Caring for animals Love', '2025-05-15', '08:20:00', 32, NULL, 'indigo', NULL, NULL, '2025-05-11 08:25:42', NULL, '2025-05-11 08:25:42', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_adoption_form`
--

CREATE TABLE `tbl_adoption_form` (
  `id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL COMMENT '1 = with account, 2 = no account',
  `user_id` int(11) NOT NULL,
  `adoption_reason` text NOT NULL,
  `whom_you_are_adopting` varchar(255) NOT NULL,
  `children_below_18_in_the_house` int(11) NOT NULL COMMENT '1 = yes, 2 = no',
  `have_other_pet` int(11) NOT NULL COMMENT '1 = yes, 2 = no',
  `family_favor_of_having_pet` int(11) NOT NULL COMMENT '1 = yes, 2 = no',
  `have_family_member_who_is_allergic_to_animal` int(11) NOT NULL COMMENT '1 = yes, 2 = no',
  `responsible_for_the_pet_medication` int(11) NOT NULL COMMENT '1 = me, 2 = my family, 3 = relatives, 4 = livin in partner',
  `responsible_for_the_pet` int(11) NOT NULL COMMENT '1 = me, 2 = my family, 3 = relatives, 4 = livin in partner',
  `type_of_house_living_in` int(11) NOT NULL COMMENT '1 = rental, 2 = own, 3 = relatives',
  `pet_policies` text NOT NULL,
  `litter_box_located` varchar(255) NOT NULL,
  `prepared_for_unpleasent_odor` int(11) NOT NULL COMMENT '1 = yes, 2 =no',
  `selfie_with_valid_id` int(11) NOT NULL COMMENT 'tbl_files',
  `image_of_pet_sleeping_place` mediumblob NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_adoption_process`
--

CREATE TABLE `tbl_adoption_process` (
  `id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL COMMENT '1 = with account, 2 = no account',
  `user_id` int(11) NOT NULL,
  `adoption_form_id` int(11) NOT NULL,
  `status` int(11) DEFAULT 1 COMMENT '1 = Application Review, 2 = Pet Being Prepared, 3 = Ready for Pickup/Delivery, 4 = Received',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_adoption_story`
--

CREATE TABLE `tbl_adoption_story` (
  `id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_type` int(11) DEFAULT NULL COMMENT '1 = with account, 2 = no account',
  `story_title` varchar(255) NOT NULL,
  `story_text` text NOT NULL,
  `story_date` datetime DEFAULT current_timestamp(),
  `photos` text DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_animal_info`
--

CREATE TABLE `tbl_animal_info` (
  `animal_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `species` varchar(50) NOT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `fur_color` varchar(100) DEFAULT NULL,
  `eye_color` varchar(50) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `spayed_neutered` enum('Yes','No','Pending') DEFAULT 'Pending',
  `vaccination_status` enum('Up-to-date','Partial','None') DEFAULT 'None',
  `temperament` varchar(255) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `favorite_food` varchar(255) DEFAULT NULL,
  `story_background` text DEFAULT NULL,
  `rescue_status` enum('Rescued','Abandoned','Transferred','Born in Care') NOT NULL,
  `health_status` int(11) DEFAULT 3 COMMENT '1 = ready for adoption, 2 = under rehabilitation, 3 = under medication',
  `medical_needs` text DEFAULT NULL,
  `date_rescued` date DEFAULT NULL,
  `primary_image` int(11) DEFAULT NULL COMMENT 'tbl_files reference id',
  `image_gallery` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` int(11) NOT NULL DEFAULT 1 COMMENT '0 = yes, 1 = no',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_animal_info`
--

INSERT INTO `tbl_animal_info` (`animal_id`, `name`, `species`, `breed`, `fur_color`, `eye_color`, `date_of_birth`, `weight`, `height`, `sex`, `spayed_neutered`, `vaccination_status`, `temperament`, `skills`, `favorite_food`, `story_background`, `rescue_status`, `health_status`, `medical_needs`, `date_rescued`, `primary_image`, `image_gallery`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(25, 'Rockie', 'Dog', 'German Sheperd', 'Golder', 'Yellow', '2020-05-12', 57.00, 543.00, 'Female', 'Yes', 'Up-to-date', 'Friendly, loyal, intelligent, great with kids and other pets.', 'Retrieve Things', 'Meat', NULL, 'Transferred', 1, 'No medical needs', NULL, 31, '[31,32,33,34,35]', '2025-05-01 10:37:56', '2025-05-16 07:04:33', 1, NULL),
(26, 'Rockie ', 'Dog', 'Aspin', 'Eyes', 'Pink', '2020-05-22', 32.00, 34.00, 'Male', 'No', 'Partial', 'Friendly, shy', 'Kiting', 'Meat', NULL, 'Transferred', 2, 'None', NULL, 36, '[36,37,38,39,40]', '2025-05-02 14:08:10', '2025-05-16 07:04:30', 1, NULL),
(27, 'Miyuki', 'Dog', 'Japanese', 'Pink', 'Green', '2025-05-27', 43.00, 43.00, 'Male', 'No', 'Up-to-date', 'Friendly', 'Fetching ', 'Good', NULL, 'Transferred', 3, 'nONE', NULL, 41, '[41,42,43,44,45]', '2025-05-02 14:09:11', '2025-05-16 07:04:27', 1, NULL),
(28, 'Signadu', 'Cat', 'Permisan', 'grey', 'Blue', '2025-05-20', 534.00, 999.99, 'Male', 'Yes', 'Partial', 'FERIEND', 'Kite', 'Foogd', NULL, 'Rescued', 1, 'aASDF', NULL, 46, '[46,47,48,49,50]', '2025-05-02 14:11:28', '2025-05-16 07:04:25', 1, NULL),
(29, 'Vlue', 'Cat', 'Persain', 'Green', 'Blue', '2025-05-26', 32.00, 43.00, 'Male', 'No', 'Up-to-date', 'Friendly', 'Fetching', 'Meat', NULL, 'Born in Care', 1, NULL, NULL, 51, '[51,52,53,54,55]', '2025-05-02 14:12:33', '2025-05-16 07:04:22', 1, NULL),
(30, 'Katsu', 'Cat', 'Jpanes', 'Grey', 'Grey', '2021-05-19', 657.00, 567.00, 'Female', 'Yes', 'Up-to-date', 'Behaviour', 'Akils', 'Dog ofod', NULL, 'Transferred', 1, 'sdf', NULL, 57, '[56,57,58,59,60]', '2025-05-02 14:13:43', '2025-05-16 07:04:18', 1, NULL),
(31, 'Firende', 'Cat', 'Gordon', 'Brown', 'Yellow', '2025-05-19', 34.00, 23.00, 'Female', 'No', 'Partial', 'Friendly', 'Fetching', 'Meatt', NULL, 'Abandoned', 1, NULL, NULL, 61, '[61,62,63,64,65]', '2025-05-02 14:14:47', '2025-05-16 07:04:14', 1, NULL),
(32, 'Mitsukishi', 'Dog', 'Askal', 'pINK', 'GREEN', '2025-05-05', 32.00, 23.00, 'Male', 'Yes', 'Up-to-date', 'asdf', 'asdf', 'asdf', 'asdfasdfasdf', 'Rescued', 1, 'asdf', NULL, 77, '[77,78,79,80,81]', '2025-05-16 09:56:58', '2025-05-16 03:56:58', 1, NULL),
(33, 'fasdfasdf', 'sfdasdf', 'asdfasdf', 'asdfa', 'sdfa', '2025-05-06', 23.00, 23.00, 'Male', 'Yes', 'Up-to-date', 'sadf', 'asf', 'asdf', 'asfsadfasdf', 'Abandoned', 1, 'asdf', NULL, 82, '[82,83,84,85,86]', '2025-05-16 11:41:47', '2025-05-16 05:41:47', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_animal_schedule`
--

CREATE TABLE `tbl_animal_schedule` (
  `id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL COMMENT 'reference animal_id',
  `schedule_category` int(11) NOT NULL COMMENT 'reference tbl_schedule_category',
  `schedule_name` varchar(100) NOT NULL,
  `dose_number` int(11) NOT NULL DEFAULT 1,
  `dose_taken` int(11) NOT NULL,
  `scheduled_date` date NOT NULL,
  `next_due_interval` int(11) DEFAULT NULL COMMENT 'by day interval',
  `next_due_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `added_by` int(11) NOT NULL COMMENT 'reference to user_id\r\n',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = no ,1  = yes',
  `deleted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_animal_schedule`
--

INSERT INTO `tbl_animal_schedule` (`id`, `animal_id`, `schedule_category`, `schedule_name`, `dose_number`, `dose_taken`, `scheduled_date`, `next_due_interval`, `next_due_date`, `amount`, `notes`, `added_by`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(1, 25, 1, 'Anti-Rabies', 1, 0, '2025-05-01', 365, '2025-11-01', 250.00, 'No side effects observed', 84, '2025-05-02 22:06:15', '2025-05-03 14:34:25', 0, '2025-05-03 06:34:25'),
(2, 26, 2, 'Anti-Rabies', 2, 0, '2025-11-01', 365, '2026-11-01', 250.00, 'Final dose completed', 84, '2025-05-02 22:06:15', '2025-05-03 23:24:50', 0, '2025-05-03 15:24:50'),
(3, 27, 3, 'Broad-Spectrum Dewormer', 1, 0, '2025-04-20', 365, '2025-07-20', 180.00, 'Repeat quarterly', 84, '2025-05-02 22:06:15', '2025-05-03 23:24:50', 0, '2025-05-03 15:24:50'),
(4, 28, 4, 'Post-Rescue Check-up', 1, 0, '2025-05-05', NULL, NULL, 500.00, 'Minor skin issues treated', 84, '2025-05-02 22:06:15', '2025-05-03 23:24:50', 0, '2025-05-03 15:24:50'),
(5, 31, 0, 'Deworming', 3, 0, '2025-05-06', 10, '2025-05-16', 323.00, NULL, 84, '2025-05-03 21:21:43', '2025-05-03 23:24:50', 0, '2025-05-03 15:24:50');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_announcements`
--

CREATE TABLE `tbl_announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `img_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'refere to user_id\r\n',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_pinned` tinyint(1) DEFAULT 0 COMMENT '0 = false, 1 = true',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = false, 1 = true',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_announcements`
--

INSERT INTO `tbl_announcements` (`id`, `title`, `img_id`, `content`, `created_by`, `created_at`, `updated_at`, `is_pinned`, `is_deleted`, `deleted_at`) VALUES
(1, 'Lost Dog Alert', 68, 'A brown Labrador named Max was last seen near River Park. Please contact the shelter at 0917-xxx-xxxx if found.', 84, '2025-05-05 21:50:10', '2025-05-07 10:39:59', 1, 0, NULL),
(2, 'Free Spay and Neuter Clinic', 69, 'Avail free services from May 10–12 at the Community Vet Station. Limited slots available.', 84, '2025-05-05 21:50:10', '2025-05-07 11:15:58', 0, 0, NULL),
(3, 'Policy Update: Registration Required', 70, 'All pets must be registered with updated vaccination cards starting June 2025. Applies to all incoming shelter intakes.', 84, '2025-05-05 21:50:10', '2025-05-07 11:16:30', 1, 0, NULL),
(4, 'Thank You for Joining Pet Fair 2024', 0, 'We appreciate all the attendees! Visit our website for photo coverage and media releases.', 84, '2025-05-05 21:50:10', '2025-05-05 22:38:51', 0, 0, NULL),
(5, 'Upcoming Rabies Vaccination Drive', 0, 'Prepare your pets for the July rabies vaccination campaign in all barangays.', 84, '2025-05-05 21:50:10', '2025-05-05 22:38:51', 1, 0, NULL),
(6, 'asdfasdfasdf', 0, '<div style=\"text-align: center;\">sdfadfasdfasdfasdfasdfasdfasdfas<strike>dfdsafsdf</strike></div>', 84, '2025-05-07 12:59:00', '2025-05-07 16:33:29', NULL, 1, '2025-05-07 02:33:29'),
(7, 'asd', 0, '<div style=\"text-align: justify;\">sdasdadas<b>s<i>sdas</i></b>asdasdasdaddasda</div>', 84, '2025-05-07 13:15:48', '2025-05-07 16:32:15', 0, 1, '2025-05-07 02:32:15'),
(8, 'dasdasdasd', 0, 'asd', 84, '2025-05-07 13:21:53', '2025-05-07 16:33:38', 0, 1, '2025-05-07 02:33:38'),
(9, 'dasdasdas', 0, 'dasd<b>dasdasds<i>asdsadasda<u>asd</u></i></b>', 84, '2025-05-07 13:24:16', '2025-05-07 16:33:38', 1, 1, '2025-05-07 02:33:38'),
(10, 'The LOst Dogogo', 67, 'we are te reason&nbsp;', 84, '2025-05-07 13:28:41', '2025-05-07 10:37:32', 1, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_budget_allocation`
--

CREATE TABLE `tbl_budget_allocation` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `percentage_allocated` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_budget_allocation`
--

INSERT INTO `tbl_budget_allocation` (`id`, `name`, `percentage_allocated`, `date_created`) VALUES
(1, 'Veterinary Care', 25, '2025-04-16 14:56:23'),
(2, 'Shelter Maintenance', 20, '2025-04-16 14:56:24'),
(3, 'Staff Salaries', 15, '2025-04-16 14:56:24'),
(4, 'Miscellaneous', 5, '2025-04-16 14:56:24');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cash_donations`
--

CREATE TABLE `tbl_cash_donations` (
  `id` int(11) NOT NULL,
  `fund_id` int(11) NOT NULL COMMENT 'referece to tbl_funds fund_id',
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'PHP',
  `method` enum('online','onsite') NOT NULL,
  `reference_code` varchar(100) DEFAULT NULL,
  `received_by` int(11) DEFAULT NULL COMMENT 'reference tbl_users = user_id',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_cash_donations`
--

INSERT INTO `tbl_cash_donations` (`id`, `fund_id`, `amount`, `currency`, `method`, `reference_code`, `received_by`, `notes`) VALUES
(8, 73, 5000.00, 'PHP', 'onsite', NULL, 0, 'For medical aid'),
(9, 75, 10000.00, 'PHP', 'online', 'TXN2025040302', 0, 'Alumni batch donation'),
(10, 77, 2500.00, 'PHP', 'onsite', NULL, 0, 'Mask and shield purchase'),
(11, 79, 15000.00, 'PHP', 'online', 'TXN2025040704', 0, 'Quarterly grant'),
(12, 81, 30000.00, 'PHP', 'onsite', NULL, 0, 'Annual education fund'),
(13, 83, 12000.00, 'PHP', 'online', 'TXN2025040905', 0, 'Water access donation'),
(14, 85, 22000.00, 'PHP', 'onsite', NULL, 0, 'Infrastructure support'),
(15, 87, 11000.00, 'PHP', 'online', 'TXN2025040905', 0, 'Water access donation'),
(16, 89, 18000.00, 'PHP', 'onsite', NULL, 0, 'Infrastructure support');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_expenses`
--

CREATE TABLE `tbl_expenses` (
  `id` int(10) UNSIGNED NOT NULL,
  `expense_title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `expense_date` date NOT NULL,
  `recorded_by` varchar(100) DEFAULT NULL,
  `attachments` text DEFAULT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'refernce budget allocation id',
  `remarks` text DEFAULT NULL,
  `is_archived` tinyint(1) DEFAULT 0,
  `date_created` datetime DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_expenses`
--

INSERT INTO `tbl_expenses` (`id`, `expense_title`, `description`, `amount`, `payment_method`, `reference_number`, `expense_date`, `recorded_by`, `attachments`, `category_id`, `remarks`, `is_archived`, `date_created`, `date_updated`) VALUES
(1, 'Veterinary Fees', 'Vaccination and deworming for 3 dogs', 1800.00, 'GCash', 'TXN-44573', '2025-04-16', 'admin', '[\"/receipts/vet_apr16_2025.jpg\"]', 2, 'Paid in full. Next checkup in 6 months.', 0, '2025-04-17 13:35:50', NULL),
(2, 'Expense on 2025-01-01', 'Auto-generated data', 294.31, 'Cash', 'REF-20250101', '2025-01-01', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(3, 'Expense on 2025-01-02', 'Auto-generated data', 725.01, 'Cash', 'REF-20250102', '2025-01-02', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(4, 'Expense on 2025-01-03', 'Auto-generated data', 126.38, 'Cash', 'REF-20250103', '2025-01-03', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(5, 'Expense on 2025-01-04', 'Auto-generated data', 876.08, 'Cash', 'REF-20250104', '2025-01-04', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(6, 'Expense on 2025-01-05', 'Auto-generated data', 508.18, 'Cash', 'REF-20250105', '2025-01-05', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(7, 'Expense on 2025-01-06', 'Auto-generated data', 770.64, 'Cash', 'REF-20250106', '2025-01-06', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(8, 'Expense on 2025-01-07', 'Auto-generated data', 68.61, 'Cash', 'REF-20250107', '2025-01-07', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(9, 'Expense on 2025-01-08', 'Auto-generated data', 367.75, 'Cash', 'REF-20250108', '2025-01-08', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(10, 'Expense on 2025-01-09', 'Auto-generated data', 369.76, 'Cash', 'REF-20250109', '2025-01-09', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(11, 'Expense on 2025-01-10', 'Auto-generated data', 715.77, 'Cash', 'REF-20250110', '2025-01-10', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(12, 'Expense on 2025-01-11', 'Auto-generated data', 271.85, 'Cash', 'REF-20250111', '2025-01-11', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(13, 'Expense on 2025-01-12', 'Auto-generated data', 723.18, 'Cash', 'REF-20250112', '2025-01-12', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(14, 'Expense on 2025-01-13', 'Auto-generated data', 293.75, 'Cash', 'REF-20250113', '2025-01-13', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(15, 'Expense on 2025-01-14', 'Auto-generated data', 72.67, 'Cash', 'REF-20250114', '2025-01-14', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(16, 'Expense on 2025-01-15', 'Auto-generated data', 737.05, 'Cash', 'REF-20250115', '2025-01-15', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(17, 'Expense on 2025-01-16', 'Auto-generated data', 349.96, 'Cash', 'REF-20250116', '2025-01-16', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(18, 'Expense on 2025-01-17', 'Auto-generated data', 15.77, 'Cash', 'REF-20250117', '2025-01-17', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(19, 'Expense on 2025-01-18', 'Auto-generated data', 149.94, 'Cash', 'REF-20250118', '2025-01-18', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(20, 'Expense on 2025-01-19', 'Auto-generated data', 706.87, 'Cash', 'REF-20250119', '2025-01-19', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(21, 'Expense on 2025-01-20', 'Auto-generated data', 81.12, 'Cash', 'REF-20250120', '2025-01-20', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(22, 'Expense on 2025-01-21', 'Auto-generated data', 179.48, 'Cash', 'REF-20250121', '2025-01-21', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(23, 'Expense on 2025-01-22', 'Auto-generated data', 680.09, 'Cash', 'REF-20250122', '2025-01-22', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(24, 'Expense on 2025-01-23', 'Auto-generated data', 306.30, 'Cash', 'REF-20250123', '2025-01-23', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(25, 'Expense on 2025-01-24', 'Auto-generated data', 699.00, 'Cash', 'REF-20250124', '2025-01-24', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(26, 'Expense on 2025-01-25', 'Auto-generated data', 524.28, 'Cash', 'REF-20250125', '2025-01-25', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(27, 'Expense on 2025-01-26', 'Auto-generated data', 670.28, 'Cash', 'REF-20250126', '2025-01-26', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(28, 'Expense on 2025-01-27', 'Auto-generated data', 16.75, 'Cash', 'REF-20250127', '2025-01-27', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(29, 'Expense on 2025-01-28', 'Auto-generated data', 285.84, 'Cash', 'REF-20250128', '2025-01-28', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(30, 'Expense on 2025-01-29', 'Auto-generated data', 280.23, 'Cash', 'REF-20250129', '2025-01-29', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(31, 'Expense on 2025-01-30', 'Auto-generated data', 751.72, 'Cash', 'REF-20250130', '2025-01-30', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(32, 'Expense on 2025-01-31', 'Auto-generated data', 760.66, 'Cash', 'REF-20250131', '2025-01-31', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(33, 'Expense on 2025-02-01', 'Auto-generated data', 686.97, 'Cash', 'REF-20250201', '2025-02-01', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(34, 'Expense on 2025-02-02', 'Auto-generated data', 206.57, 'Cash', 'REF-20250202', '2025-02-02', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(35, 'Expense on 2025-02-03', 'Auto-generated data', 742.15, 'Cash', 'REF-20250203', '2025-02-03', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(36, 'Expense on 2025-02-04', 'Auto-generated data', 241.65, 'Cash', 'REF-20250204', '2025-02-04', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(37, 'Expense on 2025-02-05', 'Auto-generated data', 911.97, 'Cash', 'REF-20250205', '2025-02-05', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(38, 'Expense on 2025-02-06', 'Auto-generated data', 152.54, 'Cash', 'REF-20250206', '2025-02-06', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(39, 'Expense on 2025-02-07', 'Auto-generated data', 690.57, 'Cash', 'REF-20250207', '2025-02-07', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(40, 'Expense on 2025-02-08', 'Auto-generated data', 747.93, 'Cash', 'REF-20250208', '2025-02-08', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(41, 'Expense on 2025-02-09', 'Auto-generated data', 995.63, 'Cash', 'REF-20250209', '2025-02-09', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(42, 'Expense on 2025-02-10', 'Auto-generated data', 185.57, 'Cash', 'REF-20250210', '2025-02-10', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(43, 'Expense on 2025-02-11', 'Auto-generated data', 565.19, 'Cash', 'REF-20250211', '2025-02-11', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(44, 'Expense on 2025-02-12', 'Auto-generated data', 68.48, 'Cash', 'REF-20250212', '2025-02-12', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(45, 'Expense on 2025-02-13', 'Auto-generated data', 214.46, 'Cash', 'REF-20250213', '2025-02-13', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(46, 'Expense on 2025-02-14', 'Auto-generated data', 458.30, 'Cash', 'REF-20250214', '2025-02-14', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(47, 'Expense on 2025-02-15', 'Auto-generated data', 777.65, 'Cash', 'REF-20250215', '2025-02-15', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(48, 'Expense on 2025-02-16', 'Auto-generated data', 650.69, 'Cash', 'REF-20250216', '2025-02-16', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(49, 'Expense on 2025-02-17', 'Auto-generated data', 364.22, 'Cash', 'REF-20250217', '2025-02-17', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(50, 'Expense on 2025-02-18', 'Auto-generated data', 63.92, 'Cash', 'REF-20250218', '2025-02-18', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(51, 'Expense on 2025-02-19', 'Auto-generated data', 936.57, 'Cash', 'REF-20250219', '2025-02-19', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(52, 'Expense on 2025-02-20', 'Auto-generated data', 219.50, 'Cash', 'REF-20250220', '2025-02-20', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(53, 'Expense on 2025-02-21', 'Auto-generated data', 741.36, 'Cash', 'REF-20250221', '2025-02-21', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(54, 'Expense on 2025-02-22', 'Auto-generated data', 110.38, 'Cash', 'REF-20250222', '2025-02-22', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(55, 'Expense on 2025-02-23', 'Auto-generated data', 424.92, 'Cash', 'REF-20250223', '2025-02-23', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(56, 'Expense on 2025-02-24', 'Auto-generated data', 80.11, 'Cash', 'REF-20250224', '2025-02-24', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(57, 'Expense on 2025-02-25', 'Auto-generated data', 697.87, 'Cash', 'REF-20250225', '2025-02-25', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(58, 'Expense on 2025-02-26', 'Auto-generated data', 538.58, 'Cash', 'REF-20250226', '2025-02-26', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(59, 'Expense on 2025-02-27', 'Auto-generated data', 952.23, 'Cash', 'REF-20250227', '2025-02-27', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(60, 'Expense on 2025-02-28', 'Auto-generated data', 245.20, 'Cash', 'REF-20250228', '2025-02-28', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(61, 'Expense on 2025-03-01', 'Auto-generated data', 88.69, 'Cash', 'REF-20250301', '2025-03-01', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(62, 'Expense on 2025-03-02', 'Auto-generated data', 478.28, 'Cash', 'REF-20250302', '2025-03-02', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(63, 'Expense on 2025-03-03', 'Auto-generated data', 289.06, 'Cash', 'REF-20250303', '2025-03-03', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(64, 'Expense on 2025-03-04', 'Auto-generated data', 187.64, 'Cash', 'REF-20250304', '2025-03-04', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(65, 'Expense on 2025-03-05', 'Auto-generated data', 963.61, 'Cash', 'REF-20250305', '2025-03-05', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(66, 'Expense on 2025-03-06', 'Auto-generated data', 619.88, 'Cash', 'REF-20250306', '2025-03-06', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(67, 'Expense on 2025-03-07', 'Auto-generated data', 105.13, 'Cash', 'REF-20250307', '2025-03-07', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(68, 'Expense on 2025-03-08', 'Auto-generated data', 418.58, 'Cash', 'REF-20250308', '2025-03-08', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(69, 'Expense on 2025-03-09', 'Auto-generated data', 6.78, 'Cash', 'REF-20250309', '2025-03-09', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(70, 'Expense on 2025-03-10', 'Auto-generated data', 361.66, 'Cash', 'REF-20250310', '2025-03-10', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(71, 'Expense on 2025-03-11', 'Auto-generated data', 810.53, 'Cash', 'REF-20250311', '2025-03-11', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(72, 'Expense on 2025-03-12', 'Auto-generated data', 145.15, 'Cash', 'REF-20250312', '2025-03-12', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(73, 'Expense on 2025-03-13', 'Auto-generated data', 463.13, 'Cash', 'REF-20250313', '2025-03-13', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(74, 'Expense on 2025-03-14', 'Auto-generated data', 493.15, 'Cash', 'REF-20250314', '2025-03-14', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(75, 'Expense on 2025-03-15', 'Auto-generated data', 201.72, 'Cash', 'REF-20250315', '2025-03-15', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(76, 'Expense on 2025-03-16', 'Auto-generated data', 394.25, 'Cash', 'REF-20250316', '2025-03-16', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(77, 'Expense on 2025-03-17', 'Auto-generated data', 675.23, 'Cash', 'REF-20250317', '2025-03-17', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(78, 'Expense on 2025-03-18', 'Auto-generated data', 281.20, 'Cash', 'REF-20250318', '2025-03-18', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(79, 'Expense on 2025-03-19', 'Auto-generated data', 265.63, 'Cash', 'REF-20250319', '2025-03-19', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(80, 'Expense on 2025-03-20', 'Auto-generated data', 516.18, 'Cash', 'REF-20250320', '2025-03-20', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(81, 'Expense on 2025-03-21', 'Auto-generated data', 416.73, 'Cash', 'REF-20250321', '2025-03-21', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(82, 'Expense on 2025-03-22', 'Auto-generated data', 272.28, 'Cash', 'REF-20250322', '2025-03-22', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(83, 'Expense on 2025-03-23', 'Auto-generated data', 422.77, 'Cash', 'REF-20250323', '2025-03-23', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(84, 'Expense on 2025-03-24', 'Auto-generated data', 582.12, 'Cash', 'REF-20250324', '2025-03-24', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(85, 'Expense on 2025-03-25', 'Auto-generated data', 255.30, 'Cash', 'REF-20250325', '2025-03-25', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(86, 'Expense on 2025-03-26', 'Auto-generated data', 611.56, 'Cash', 'REF-20250326', '2025-03-26', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(87, 'Expense on 2025-03-27', 'Auto-generated data', 322.06, 'Cash', 'REF-20250327', '2025-03-27', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(88, 'Expense on 2025-03-28', 'Auto-generated data', 614.98, 'Cash', 'REF-20250328', '2025-03-28', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(89, 'Expense on 2025-03-29', 'Auto-generated data', 786.06, 'Cash', 'REF-20250329', '2025-03-29', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(90, 'Expense on 2025-03-30', 'Auto-generated data', 400.26, 'Cash', 'REF-20250330', '2025-03-30', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(91, 'Expense on 2025-03-31', 'Auto-generated data', 530.52, 'Cash', 'REF-20250331', '2025-03-31', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(92, 'Expense on 2025-04-01', 'Auto-generated data', 477.56, 'Cash', 'REF-20250401', '2025-04-01', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(93, 'Expense on 2025-04-02', 'Auto-generated data', 298.86, 'Cash', 'REF-20250402', '2025-04-02', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(94, 'Expense on 2025-04-03', 'Auto-generated data', 380.28, 'Cash', 'REF-20250403', '2025-04-03', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(95, 'Expense on 2025-04-04', 'Auto-generated data', 535.69, 'Cash', 'REF-20250404', '2025-04-04', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(96, 'Expense on 2025-04-05', 'Auto-generated data', 755.60, 'Cash', 'REF-20250405', '2025-04-05', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(97, 'Expense on 2025-04-06', 'Auto-generated data', 535.21, 'Cash', 'REF-20250406', '2025-04-06', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(98, 'Expense on 2025-04-07', 'Auto-generated data', 368.62, 'Cash', 'REF-20250407', '2025-04-07', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(99, 'Expense on 2025-04-08', 'Auto-generated data', 186.85, 'Cash', 'REF-20250408', '2025-04-08', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(100, 'Expense on 2025-04-09', 'Auto-generated data', 232.64, 'Cash', 'REF-20250409', '2025-04-09', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(101, 'Expense on 2025-04-10', 'Auto-generated data', 738.54, 'Cash', 'REF-20250410', '2025-04-10', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(102, 'Expense on 2025-04-11', 'Auto-generated data', 938.48, 'Cash', 'REF-20250411', '2025-04-11', 'system', NULL, 3, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(103, 'Expense on 2025-04-12', 'Auto-generated data', 184.29, 'Cash', 'REF-20250412', '2025-04-12', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(104, 'Expense on 2025-04-13', 'Auto-generated data', 55.24, 'Cash', 'REF-20250413', '2025-04-13', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(105, 'Expense on 2025-04-14', 'Auto-generated data', 390.96, 'Cash', 'REF-20250414', '2025-04-14', 'system', NULL, 2, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(106, 'Expense on 2025-04-15', 'Auto-generated data', 931.08, 'Cash', 'REF-20250415', '2025-04-15', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(107, 'Expense on 2025-04-16', 'Auto-generated data', 171.78, 'Cash', 'REF-20250416', '2025-04-16', 'system', NULL, 1, 'Test record', 0, '2025-04-17 14:03:49', '2025-04-17 14:09:25'),
(108, 'Expense on 2025-04-17', 'Auto-generated data', 884.22, 'Cash', 'REF-20250417', '2025-04-17', 'system', NULL, 4, 'Test record', 0, '2025-04-17 14:03:49', NULL),
(109, 'Vet Checkup - Bella', 'General checkup and consultation for Bella (Labrador)', 1200.00, 'GCash', 'TXN-AC001', '2025-04-19', 'admin', '[\"/receipts/vet_bella_0419.jpg\"]', 2, 'Routine care visit. No issues found.', 0, '2025-04-19 18:14:01', NULL),
(110, 'Deworming - Max', 'Deworming treatment for Max (Beagle)', 450.00, 'Cash', 'TXN-AC002', '2025-04-19', 'admin', '[\"/receipts/deworm_max_0419.jpg\"]', 2, 'Annual schedule. Next in 12 months.', 0, '2025-04-19 18:14:01', NULL),
(111, 'Vaccination - Kitten Trio', '3-in-1 vaccine for 3 kittens', 1800.00, 'Bank Transfer', 'TXN-AC003', '2025-04-19', 'admin', '[\"/receipts/vax_kittens_0419.jpg\"]', 2, 'Completed on time. Booster due in 4 weeks.', 0, '2025-04-19 18:14:01', NULL),
(112, 'Pet Shampoo & Conditioner', 'Hypoallergenic supplies for sensitive fur', 620.00, 'GCash', 'TXN-AC004', '2025-04-19', 'admin', '[\"/receipts/shampoo_0419.jpg\"]', 2, 'Used weekly. Prevents skin irritation.', 0, '2025-04-19 18:14:01', NULL),
(113, 'Parasite Prevention - Zuko', 'Flea and tick meds for Zuko (German Shepherd)', 900.00, 'Credit Card', 'TXN-AC005', '2025-04-19', 'admin', '[\"/receipts/zuko_parasite_0419.jpg\"]', 2, 'Next dose in 30 days.', 0, '2025-04-19 18:14:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_files`
--

CREATE TABLE `tbl_files` (
  `id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `size` bigint(20) NOT NULL,
  `type` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_files`
--

INSERT INTO `tbl_files` (`id`, `image_path`, `size`, `type`, `date_created`) VALUES
(31, 'animal_1746095877_68134f0538510.jpg', 0, '', '2025-05-01 10:37:57'),
(32, 'animal_1746095877_68134f053a714.jpg', 0, '', '2025-05-01 10:37:57'),
(33, 'animal_1746095877_68134f053c315.jpg', 0, '', '2025-05-01 10:37:57'),
(34, 'animal_1746095877_68134f053d7da.jpg', 0, '', '2025-05-01 10:37:57'),
(35, 'animal_1746095877_68134f053edff.jpg', 0, '', '2025-05-01 10:37:57'),
(36, 'animal_1746194890_6814d1ca8adfd.jpg', 0, '', '2025-05-02 14:08:10'),
(37, 'animal_1746194890_6814d1ca8cf76.jpg', 0, '', '2025-05-02 14:08:10'),
(38, 'animal_1746194890_6814d1ca8ea8c.jpg', 0, '', '2025-05-02 14:08:10'),
(39, 'animal_1746194890_6814d1ca9001f.jpg', 0, '', '2025-05-02 14:08:10'),
(40, 'animal_1746194890_6814d1ca915b3.jpg', 0, '', '2025-05-02 14:08:10'),
(41, 'animal_1746194951_6814d207e8b2f.jpg', 0, '', '2025-05-02 14:09:11'),
(42, 'animal_1746194951_6814d207ea315.jpg', 0, '', '2025-05-02 14:09:11'),
(43, 'animal_1746194951_6814d207eb352.jpg', 0, '', '2025-05-02 14:09:11'),
(44, 'animal_1746194951_6814d207ecf56.jpg', 0, '', '2025-05-02 14:09:11'),
(45, 'animal_1746194951_6814d207edfae.jpg', 0, '', '2025-05-02 14:09:11'),
(46, 'animal_1746195088_6814d2909b5e6.jpg', 0, '', '2025-05-02 14:11:28'),
(47, 'animal_1746195088_6814d2909d40d.png', 0, '', '2025-05-02 14:11:28'),
(48, 'animal_1746195088_6814d2909e7bc.jpg', 0, '', '2025-05-02 14:11:28'),
(49, 'animal_1746195088_6814d290a00e7.jpg', 0, '', '2025-05-02 14:11:28'),
(50, 'animal_1746195088_6814d290a13f4.jpg', 0, '', '2025-05-02 14:11:28'),
(51, 'animal_1746195153_6814d2d15838d.jpg', 0, '', '2025-05-02 14:12:33'),
(52, 'animal_1746195153_6814d2d15e92a.jpg', 0, '', '2025-05-02 14:12:33'),
(53, 'animal_1746195153_6814d2d15f7d1.jpg', 0, '', '2025-05-02 14:12:33'),
(54, 'animal_1746195153_6814d2d1605f5.jpg', 0, '', '2025-05-02 14:12:33'),
(55, 'animal_1746195153_6814d2d161801.jpg', 0, '', '2025-05-02 14:12:33'),
(56, 'animal_1746195223_6814d317c0d0e.jpg', 0, '', '2025-05-02 14:13:43'),
(57, 'animal_1746195223_6814d317c21c0.jpg', 0, '', '2025-05-02 14:13:43'),
(58, 'animal_1746195223_6814d317c3145.jpg', 0, '', '2025-05-02 14:13:43'),
(59, 'animal_1746195223_6814d317c46a4.jpg', 0, '', '2025-05-02 14:13:43'),
(60, 'animal_1746195223_6814d317c5789.jpg', 0, '', '2025-05-02 14:13:43'),
(61, 'animal_1746195287_6814d35777274.jpg', 0, '', '2025-05-02 14:14:47'),
(62, 'animal_1746195287_6814d35779333.jpg', 0, '', '2025-05-02 14:14:47'),
(63, 'animal_1746195287_6814d3577a589.jpg', 0, '', '2025-05-02 14:14:47'),
(64, 'animal_1746195287_6814d3577bafd.jpg', 0, '', '2025-05-02 14:14:47'),
(65, 'animal_1746195287_6814d3577d48f.jpg', 0, '', '2025-05-02 14:14:47'),
(66, 'file_1746595456_681aee80503cc.jpg', 0, '', '2025-05-07 05:24:16'),
(67, 'file_1746595721_681aef89ad03f.jpg', 0, '', '2025-05-07 05:28:41'),
(68, 'file_1746607199_681b1c5f8ae1e.jpg', 0, '', '2025-05-07 08:39:59'),
(69, 'file_1746609358_681b24ce4f3e1.jpg', 0, '', '2025-05-07 09:15:58'),
(70, 'file_1746609390_681b24ee4d244.jpg', 0, '', '2025-05-07 09:16:30'),
(71, 'file_1746783529_681dcd2962fb7.jpg', 0, '', '2025-05-09 09:38:49'),
(72, 'file_1746788278_681ddfb69db75.jpg', 0, '', '2025-05-09 10:57:58'),
(73, 'file_1746789655_681de5173e8f0.jpg', 0, '', '2025-05-09 11:20:55'),
(74, 'file_1746789673_681de5295928f.jpg', 0, '', '2025-05-09 11:21:13'),
(75, 'file_1746789796_681de5a4c7f56.jpg', 0, '', '2025-05-09 11:23:16'),
(76, 'file_1746790955_681dea2b700e7.jpg', 0, '', '2025-05-09 11:42:35'),
(77, 'animal_1747389418_68270beabe21e.jpg', 6105445, 'image/jpeg', '2025-05-16 09:56:58'),
(78, 'animal_1747389418_68270beabfca0.jpg', 12539114, 'image/jpeg', '2025-05-16 09:56:58'),
(79, 'animal_1747389418_68270beac1450.jpg', 5514169, 'image/jpeg', '2025-05-16 09:56:58'),
(80, 'animal_1747389418_68270beac2a29.jpg', 2910160, 'image/jpeg', '2025-05-16 09:56:58'),
(81, 'animal_1747389418_68270beac3b72.jpg', 3007366, 'image/jpeg', '2025-05-16 09:56:58'),
(82, 'animal_1747395707_6827247ba42fa.jpg', 12539114, 'image/jpeg', '2025-05-16 11:41:47'),
(83, 'animal_1747395707_6827247ba6cf9.jpg', 5514169, 'image/jpeg', '2025-05-16 11:41:47'),
(84, 'animal_1747395707_6827247ba8da3.jpg', 2910160, 'image/jpeg', '2025-05-16 11:41:47'),
(85, 'animal_1747395707_6827247baa3aa.jpg', 3007366, 'image/jpeg', '2025-05-16 11:41:47'),
(86, 'animal_1747395707_6827247babe3d.jpg', 17947412, 'image/jpeg', '2025-05-16 11:41:47');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_foods_inventory`
--

CREATE TABLE `tbl_foods_inventory` (
  `id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `food_name` varchar(255) NOT NULL,
  `bought_date` date NOT NULL,
  `food_weight_kg` int(11) NOT NULL,
  `daily_consume` int(11) NOT NULL,
  `buying_date_schedule` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_funds`
--

CREATE TABLE `tbl_funds` (
  `fund_id` int(11) NOT NULL,
  `donor_id` int(11) NOT NULL,
  `donation_type` enum('cash','material') NOT NULL,
  `allocated_for` varchar(255) DEFAULT NULL,
  `received_date` date NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = false, 1 = true',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_funds`
--

INSERT INTO `tbl_funds` (`fund_id`, `donor_id`, `donation_type`, `allocated_for`, `received_date`, `remarks`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(73, 101, 'cash', 'Medical Support', '2025-04-01', 'Urgent case from Barangay A', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(74, 102, 'material', 'School Supplies', '2025-04-02', 'Includes notebooks and pens', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(75, 103, 'cash', 'Feeding Program', '2025-04-03', 'Weekly feeding initiative', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(76, 104, 'material', 'Relief Goods', '2025-04-04', 'Donated canned goods', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(77, 105, 'cash', 'COVID PPE', '2025-04-05', 'Mask and sanitizer bulk purchase', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(78, 106, 'material', 'Sports Equipment', '2025-04-06', 'Donated basketballs', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(79, 107, 'cash', 'Scholarship Fund', '2025-04-07', 'For underprivileged students', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(80, 108, 'material', 'Medicines', '2025-04-08', 'OTC and prescription mix', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(81, 109, 'cash', 'Infrastructure', '2025-04-09', 'Barangay hall renovation', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(82, 110, 'material', 'Furniture', '2025-04-10', 'Chairs and tables', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(83, 111, 'cash', 'Water Project', '2025-04-11', 'Pipeline repair fund', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(84, 112, 'material', 'Sanitary Kits', '2025-04-12', 'Soap, shampoo, hygiene items', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(85, 113, 'cash', 'Medical Support', '2025-04-13', 'Emergency ER case', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(86, 114, 'material', 'Textbooks', '2025-04-14', 'Grade 7-10 materials', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(87, 115, 'cash', 'Electricity Fund', '2025-04-15', 'Covered 3 months', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(88, 116, 'material', 'Food Packs', '2025-04-16', 'Donated by Rotary Club', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(89, 117, 'cash', 'Educational Grant', '2025-04-17', 'One-time support', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL),
(90, 118, 'material', 'Clothing', '2025-04-18', 'T-shirts and jackets', '2025-04-18 11:08:50', '2025-04-18 11:08:50', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory`
--

CREATE TABLE `tbl_inventory` (
  `id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `category` enum('medicine','vaccine','vitamin') NOT NULL,
  `group_name` int(11) NOT NULL COMMENT 'reference to tbl_inventory_group id',
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `unit` varchar(50) NOT NULL,
  `expiration_date` date NOT NULL,
  `storage_location` varchar(255) DEFAULT NULL,
  `date_received` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  `date_updated` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `is_deleted` int(11) NOT NULL DEFAULT 1 COMMENT '0 = yes, 1 = no',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_inventory`
--

INSERT INTO `tbl_inventory` (`id`, `item_name`, `category`, `group_name`, `description`, `quantity`, `unit`, `expiration_date`, `storage_location`, `date_received`, `notes`, `date_created`, `date_updated`, `is_deleted`, `deleted_at`) VALUES
(1, 'Amoxicillin 500mg', 'medicine', 3, 'Antibiotic capsule for bacterial infections', 200, 'capsules', '2025-04-26', 'Shelf A1', '2025-04-15', 'Store in a cool, dry place', '2025-04-20 13:30:08', '2025-04-30 23:57:52', 1, '2025-04-22 02:06:07'),
(2, 'Paracetamol 250mg Syrup', 'medicine', 3, 'Pain and fever relief syrup for children', 50, 'bottles', '2025-03-20', 'Shelf B3', '2025-04-16', 'Shake well before use', '2025-04-20 13:30:08', '2025-04-21 20:40:51', 1, NULL),
(3, 'Anti-Rabies Vaccine', 'vaccine', 9, 'Rabies vaccine for dogs and cats', 30, 'vials', '2025-09-30', 'Cold Storage Unit 1', '2025-04-10', 'Keep refrigerated (2°C to 8°C)', '2025-04-20 13:30:08', '2025-04-20 16:34:24', 1, NULL),
(4, '5-in-1 Vaccine', 'vaccine', 7, 'Canine vaccine against 5 major diseases', 25, 'vials', '2025-11-15', 'Cold Storage Unit 2', '2025-04-12', 'Avoid direct sunlight', '2025-04-20 13:30:08', '2025-04-20 16:34:24', 1, NULL),
(5, 'Vitamin C Chewables', 'vitamin', 14, 'Immune booster for dogs', 100, 'tablets', '2026-01-25', 'Shelf C1', '2025-04-14', 'Chewable tablets, orange flavor', '2025-04-20 13:30:08', '2025-04-20 16:35:01', 1, NULL),
(6, 'Multivitamin Syrup', 'vitamin', 15, 'Daily supplement for small pets', 40, 'bottles', '2025-10-10', 'Shelf D2', '2025-04-13', 'Keep out of reach of children', '2025-04-20 13:30:08', '2025-04-22 16:33:42', 0, '2025-04-22 02:33:42'),
(7, 'Cefalexin 250mg', 'medicine', 5, 'Broad-spectrum antibiotic for infections', 150, 'capsules', '2026-04-10', 'Shelf A2', '2025-04-17', 'Avoid moisture', '2025-04-20 15:36:25', '2025-04-22 16:05:24', 0, '2025-04-22 02:05:24'),
(8, 'Metronidazole 500mg', 'medicine', 2, 'For gastrointestinal infections in pets', 80, 'tablets', '2026-06-22', 'Shelf A2', '2025-04-18', 'Store at room temperature', '2025-04-20 15:36:25', '2025-04-23 00:00:00', 1, NULL),
(9, 'Loperamide', 'medicine', 4, 'Anti-diarrheal for dogs and cats', 60, 'tablets', '2026-07-15', 'Shelf A3', '2025-04-19', 'Do not exceed recommended dose', '2025-04-20 15:36:25', '2025-04-22 19:23:06', 0, '2025-04-22 05:23:06'),
(10, 'Prednisone 5mg', 'medicine', 1, 'Steroid for inflammation and allergies', 100, 'tablets', '2026-08-05', 'Shelf A4', '2025-04-20', 'Store away from sunlight', '2025-04-20 15:36:25', '2025-04-22 16:08:44', 0, '2025-04-22 02:08:44'),
(11, 'Clindamycin Drops', 'medicine', 2, 'Oral antibiotic drops', 30, 'bottles', '2026-09-01', 'Shelf B1', '2025-04-21', 'Refrigerate after opening', '2025-04-20 15:36:25', '2025-04-22 19:23:06', 0, '2025-04-22 05:23:06'),
(12, 'Feline Leukemia Vaccine', 'vaccine', 7, 'Protection against feline leukemia virus', 20, 'vials', '2025-12-30', 'Cold Storage Unit 3', '2025-04-22', 'Shake before use', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(13, 'DHPP Vaccine', 'vaccine', 9, 'Distemper, Hepatitis, Parvo & Parainfluenza', 35, 'vials', '2026-01-20', 'Cold Storage Unit 1', '2025-04-23', 'Transport with ice packs', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(14, 'Leptospirosis Vaccine', 'vaccine', 6, 'For leptospira bacteria prevention', 40, 'vials', '2026-03-18', 'Cold Storage Unit 1', '2025-04-24', 'Keep cold at all times', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(15, 'Kennel Cough Vaccine', 'vaccine', 9, 'Bordetella protection for dogs', 22, 'vials', '2026-04-05', 'Cold Storage Unit 2', '2025-04-25', 'Avoid freezing', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(16, 'Canine Coronavirus Vaccine', 'vaccine', 6, 'Canine virus protection', 18, 'vials', '2026-05-14', 'Cold Storage Unit 3', '2025-04-26', 'Protect from light', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(17, 'Vitamin B Complex', 'vitamin', 14, 'Nerve and energy support for pets', 75, 'tablets', '2026-02-28', 'Shelf D3', '2025-04-27', 'Do not crush tablets', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(18, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(19, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(20, 'Lysine Powder', 'vitamin', 12, 'Immune booster for cats', 55, 'jars', '2026-09-11', 'Shelf D1', '2025-04-30', 'Scoop included inside', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(21, 'Zinc + Biotin Supplement', 'vitamin', 14, 'For fur and skin health', 45, 'bottles', '2026-10-20', 'Shelf C4', '2025-05-01', 'Give with food', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(22, 'Iron Drops', 'vitamin', 11, 'For anemia in small pets', 35, 'bottles', '2026-11-08', 'Shelf D2', '2025-05-02', 'Dropper included', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(23, 'Probiotic Chews', 'vitamin', 11, 'Supports gut health', 60, 'packs', '2026-12-25', 'Shelf D3', '2025-05-03', 'Banana flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(24, 'Vitamin A + D Drops', 'vitamin', 14, 'Supports immune and bone health', 50, 'bottles', '2027-01-30', 'Shelf C5', '2025-05-04', 'Use dropper provided', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(25, 'Senior Pet Multivitamin', 'vitamin', 15, 'Daily formula for aging pets', 40, 'bottles', '2027-03-15', 'Shelf C6', '2025-05-05', 'Use once daily', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(26, 'Amoxicillin 500mg', 'medicine', 3, 'Antibiotic capsule for bacterial infections', 200, 'capsules', '2025-04-26', 'Shelf A1', '2025-04-15', 'Store in a cool, dry place', '2025-04-20 13:30:08', '2025-04-20 19:16:14', 1, NULL),
(27, 'Paracetamol 250mg Syrup', 'medicine', 3, 'Pain and fever relief syrup for children', 50, 'bottles', '2025-03-20', 'Shelf B3', '2025-04-16', 'Shake well before use', '2025-04-20 13:30:08', '2025-04-21 20:40:51', 1, NULL),
(28, 'Anti-Rabies Vaccine', 'vaccine', 9, 'Rabies vaccine for dogs and cats', 30, 'vials', '2025-09-30', 'Cold Storage Unit 1', '2025-04-10', 'Keep refrigerated (2°C to 8°C)', '2025-04-20 13:30:08', '2025-04-20 16:34:24', 1, NULL),
(29, '5-in-1 Vaccine', 'vaccine', 7, 'Canine vaccine against 5 major diseases', 25, 'vials', '2025-11-15', 'Cold Storage Unit 2', '2025-04-12', 'Avoid direct sunlight', '2025-04-20 13:30:08', '2025-04-20 16:34:24', 1, NULL),
(30, 'Vitamin C Chewables', 'vitamin', 14, 'Immune booster for dogs', 100, 'tablets', '2026-01-25', 'Shelf C1', '2025-04-14', 'Chewable tablets, orange flavor', '2025-04-20 13:30:08', '2025-04-20 16:35:01', 1, NULL),
(31, 'Multivitamin Syrup', 'vitamin', 15, 'Daily supplement for small pets', 40, 'bottles', '2025-10-10', 'Shelf D2', '2025-04-13', 'Keep out of reach of children', '2025-04-20 13:30:08', '2025-04-20 16:35:01', 1, NULL),
(32, 'Cefalexin 250mg', 'medicine', 5, 'Broad-spectrum antibiotic for infections', 150, 'capsules', '2026-04-10', 'Shelf A2', '2025-04-17', 'Avoid moisture', '2025-04-20 15:36:25', '2025-04-22 19:33:24', 0, '2025-04-22 05:33:24'),
(33, 'Metronidazole 500mg', 'medicine', 5, 'For gastrointestinal infections in pets', 80, 'tablets', '2026-06-22', 'Shelf A2', '2025-04-18', 'Store at room temperature', '2025-04-20 15:36:25', '2025-04-22 19:23:06', 0, '2025-04-22 05:23:06'),
(34, 'Loperamide', 'medicine', 4, 'Anti-diarrheal for dogs and cats', 60, 'tablets', '2026-07-15', 'Shelf A3', '2025-04-19', 'Do not exceed recommended dose', '2025-04-20 15:36:25', '2025-04-22 19:24:59', 0, '2025-04-22 05:24:59'),
(35, 'Prednisone 5mg', 'medicine', 1, 'Steroid for inflammation and allergies', 100, 'tablets', '2026-08-05', 'Shelf A4', '2025-04-20', 'Store away from sunlight', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(36, 'Multivitamin Syrup', 'vitamin', 15, 'Daily supplement for small pets', 40, 'bottles', '2025-10-10', 'Shelf D2', '2025-04-13', 'Keep out of reach of children', '2025-04-20 13:30:08', '2025-04-20 16:35:01', 1, NULL),
(37, 'Cefalexin 250mg', 'medicine', 5, 'Broad-spectrum antibiotic for infections', 150, 'capsules', '2026-04-10', 'Shelf A2', '2025-04-17', 'Avoid moisture', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(38, 'Metronidazole 500mg', 'medicine', 5, 'For gastrointestinal infections in pets', 80, 'tablets', '2026-06-22', 'Shelf A2', '2025-04-18', 'Store at room temperature', '2025-04-20 15:36:25', '2025-04-20 16:32:51', 1, NULL),
(39, 'Loperamide', 'medicine', 4, 'Anti-diarrheal for dogs and cats', 60, 'tablets', '2026-07-15', 'Shelf A3', '2025-04-19', 'Do not exceed recommended dose', '2025-04-20 15:36:25', '2025-04-20 16:32:51', 1, NULL),
(40, 'Prednisone 5mg', 'medicine', 1, 'Steroid for inflammation and allergies', 100, 'tablets', '2026-08-05', 'Shelf A4', '2025-04-20', 'Store away from sunlight', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(41, 'Multivitamin Syrup', 'vitamin', 15, 'Daily supplement for small pets', 40, 'bottles', '2025-10-10', 'Shelf D2', '2025-04-13', 'Keep out of reach of children', '2025-04-20 13:30:08', '2025-04-20 16:35:01', 1, NULL),
(42, 'Cefalexin 250mg', 'medicine', 5, 'Broad-spectrum antibiotic for infections', 150, 'capsules', '2026-04-10', 'Shelf A2', '2025-04-17', 'Avoid moisture', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(43, 'Metronidazole 500mg', 'medicine', 5, 'For gastrointestinal infections in pets', 80, 'tablets', '2026-06-22', 'Shelf A2', '2025-04-18', 'Store at room temperature', '2025-04-20 15:36:25', '2025-04-20 16:32:51', 1, NULL),
(44, 'Loperamide', 'medicine', 4, 'Anti-diarrheal for dogs and cats', 60, 'tablets', '2026-07-15', 'Shelf A3', '2025-04-19', 'Do not exceed recommended dose', '2025-04-20 15:36:25', '2025-04-20 16:32:51', 1, NULL),
(45, 'Prednisone 5mg', 'medicine', 1, 'Steroid for inflammation and allergies', 100, 'tablets', '2026-08-05', 'Shelf A4', '2025-04-20', 'Store away from sunlight', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(46, 'Multivitamin Syrup', 'vitamin', 15, 'Daily supplement for small pets', 40, 'bottles', '2025-10-10', 'Shelf D2', '2025-04-13', 'Keep out of reach of children', '2025-04-20 13:30:08', '2025-04-20 16:35:01', 1, NULL),
(47, 'Cefalexin 250mg', 'medicine', 5, 'Broad-spectrum antibiotic for infections', 150, 'capsules', '2026-04-10', 'Shelf A2', '2025-04-17', 'Avoid moisture', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(48, 'Metronidazole 500mg', 'medicine', 5, 'For gastrointestinal infections in pets', 80, 'tablets', '2026-06-22', 'Shelf A2', '2025-04-18', 'Store at room temperature', '2025-04-20 15:36:25', '2025-04-20 16:32:51', 1, NULL),
(49, 'Loperamide', 'medicine', 4, 'Anti-diarrheal for dogs and cats', 60, 'tablets', '2026-07-15', 'Shelf A3', '2025-04-19', 'Do not exceed recommended dose', '2025-04-20 15:36:25', '2025-04-20 16:32:51', 1, NULL),
(50, 'Prednisone 5mg', 'medicine', 1, 'Steroid for inflammation and allergies', 100, 'tablets', '2026-08-05', 'Shelf A4', '2025-04-20', 'Store away from sunlight', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(51, 'Multivitamin Syrup', 'vitamin', 15, 'Daily supplement for small pets', 40, 'bottles', '2025-10-10', 'Shelf D2', '2025-04-13', 'Keep out of reach of children', '2025-04-20 13:30:08', '2025-04-20 16:35:01', 1, NULL),
(52, 'Cefalexin 250mg', 'medicine', 5, 'Broad-spectrum antibiotic for infections', 150, 'capsules', '2026-04-10', 'Shelf A2', '2025-04-17', 'Avoid moisture', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(53, 'Metronidazole 500mg', 'medicine', 5, 'For gastrointestinal infections in pets', 80, 'tablets', '2026-06-22', 'Shelf A2', '2025-04-18', 'Store at room temperature', '2025-04-20 15:36:25', '2025-04-20 16:32:51', 1, NULL),
(54, 'Loperamide', 'medicine', 4, 'Anti-diarrheal for dogs and cats', 60, 'tablets', '2026-07-15', 'Shelf A3', '2025-04-19', 'Do not exceed recommended dose', '2025-04-20 15:36:25', '2025-04-20 16:32:51', 1, NULL),
(55, 'Prednisone 5mg', 'medicine', 1, 'Steroid for inflammation and allergies', 100, 'tablets', '2026-08-05', 'Shelf A4', '2025-04-20', 'Store away from sunlight', '2025-04-20 15:36:25', '2025-04-20 16:31:40', 1, NULL),
(56, 'Kennel Cough Vaccine', 'vaccine', 9, 'Bordetella protection for dogs', 22, 'vials', '2026-04-05', 'Cold Storage Unit 2', '2025-04-25', 'Avoid freezing', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(57, 'Canine Coronavirus Vaccine', 'vaccine', 6, 'Canine virus protection', 18, 'vials', '2026-05-14', 'Cold Storage Unit 3', '2025-04-26', 'Protect from light', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(58, 'Vitamin B Complex', 'vitamin', 14, 'Nerve and energy support for pets', 75, 'tablets', '2026-02-28', 'Shelf D3', '2025-04-27', 'Do not crush tablets', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(59, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(60, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(61, 'Kennel Cough Vaccine', 'vaccine', 9, 'Bordetella protection for dogs', 22, 'vials', '2026-04-05', 'Cold Storage Unit 2', '2025-04-25', 'Avoid freezing', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(62, 'Canine Coronavirus Vaccine', 'vaccine', 6, 'Canine virus protection', 18, 'vials', '2026-05-14', 'Cold Storage Unit 3', '2025-04-26', 'Protect from light', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(63, 'Vitamin B Complex', 'vitamin', 14, 'Nerve and energy support for pets', 75, 'tablets', '2026-02-28', 'Shelf D3', '2025-04-27', 'Do not crush tablets', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(64, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(65, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(66, 'Kennel Cough Vaccine', 'vaccine', 9, 'Bordetella protection for dogs', 22, 'vials', '2026-04-05', 'Cold Storage Unit 2', '2025-04-25', 'Avoid freezing', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(67, 'Canine Coronavirus Vaccine', 'vaccine', 6, 'Canine virus protection', 18, 'vials', '2026-05-14', 'Cold Storage Unit 3', '2025-04-26', 'Protect from light', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(68, 'Vitamin B Complex', 'vitamin', 14, 'Nerve and energy support for pets', 75, 'tablets', '2026-02-28', 'Shelf D3', '2025-04-27', 'Do not crush tablets', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(69, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(70, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-22 16:31:40', 0, '2025-04-22 02:31:40'),
(71, 'Kennel Cough Vaccine', 'vaccine', 9, 'Bordetella protection for dogs', 22, 'vials', '2026-04-05', 'Cold Storage Unit 2', '2025-04-25', 'Avoid freezing', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(72, 'Canine Coronavirus Vaccine', 'vaccine', 6, 'Canine virus protection', 18, 'vials', '2026-05-14', 'Cold Storage Unit 3', '2025-04-26', 'Protect from light', '2025-04-20 15:36:25', '2025-04-20 16:34:24', 1, NULL),
(73, 'Vitamin B Complex', 'vitamin', 14, 'Nerve and energy support for pets', 75, 'tablets', '2026-02-28', 'Shelf D3', '2025-04-27', 'Do not crush tablets', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(74, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(75, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(76, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(77, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(78, 'Lysine Powder', 'vitamin', 12, 'Immune booster for cats', 55, 'jars', '2026-09-11', 'Shelf D1', '2025-04-30', 'Scoop included inside', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(79, 'Zinc + Biotin Supplement', 'vitamin', 14, 'For fur and skin health', 45, 'bottles', '2026-10-20', 'Shelf C4', '2025-05-01', 'Give with food', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(80, 'Iron Drops', 'vitamin', 11, 'For anemia in small pets', 35, 'bottles', '2026-11-08', 'Shelf D2', '2025-05-02', 'Dropper included', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(81, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(82, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(83, 'Lysine Powder', 'vitamin', 12, 'Immune booster for cats', 55, 'jars', '2026-09-11', 'Shelf D1', '2025-04-30', 'Scoop included inside', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(84, 'Zinc + Biotin Supplement', 'vitamin', 14, 'For fur and skin health', 45, 'bottles', '2026-10-20', 'Shelf C4', '2025-05-01', 'Give with food', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(85, 'Iron Drops', 'vitamin', 11, 'For anemia in small pets', 35, 'bottles', '2026-11-08', 'Shelf D2', '2025-05-02', 'Dropper included', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(86, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(87, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(88, 'Lysine Powder', 'vitamin', 12, 'Immune booster for cats', 55, 'jars', '2026-09-11', 'Shelf D1', '2025-04-30', 'Scoop included inside', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(89, 'Zinc + Biotin Supplement', 'vitamin', 14, 'For fur and skin health', 45, 'bottles', '2026-10-20', 'Shelf C4', '2025-05-01', 'Give with food', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(90, 'Iron Drops', 'vitamin', 11, 'For anemia in small pets', 35, 'bottles', '2026-11-08', 'Shelf D2', '2025-05-02', 'Dropper included', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(91, 'Calcium Chews', 'vitamin', 13, 'Bone strength supplement', 90, 'packs', '2026-06-10', 'Shelf C2', '2025-04-28', 'Chewable, chicken flavor', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(92, 'Fish Oil Capsules', 'vitamin', 14, 'For coat and skin health', 100, 'capsules', '2026-07-19', 'Shelf C3', '2025-04-29', 'Store in original container', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(93, 'Lysine Powder', 'vitamin', 12, 'Immune booster for cats', 55, 'jars', '2026-09-11', 'Shelf D1', '2025-04-30', 'Scoop included inside', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(94, 'Zinc + Biotin Supplement', 'vitamin', 14, 'For fur and skin health', 45, 'bottles', '2026-10-20', 'Shelf C4', '2025-05-01', 'Give with food', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(95, 'Iron Drops', 'vitamin', 11, 'For anemia in small pets', 35, 'bottles', '2026-11-08', 'Shelf D2', '2025-05-02', 'Dropper included', '2025-04-20 15:36:25', '2025-04-20 16:35:01', 1, NULL),
(96, 'Excalibur', 'medicine', 1, NULL, 32, 'litre', '2037-04-24', NULL, '2025-04-23', NULL, '2025-04-23 22:53:32', NULL, 1, NULL),
(97, 'Excalibur', 'medicine', 1, '', 32, 'litre', '2037-04-24', NULL, '2025-04-23', '', '2025-04-23 22:54:29', NULL, 1, NULL),
(98, 'Hiparitus', 'medicine', 3, '', 21, 'bottle', '2025-04-25', NULL, '2025-04-23', '', '2025-04-23 22:59:38', NULL, 1, NULL),
(99, 'Metroxomilan', 'medicine', 2, '', 2, 'nottle', '2025-04-24', NULL, '2025-04-24', '', '2025-04-24 22:59:47', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_inventory_group`
--

CREATE TABLE `tbl_inventory_group` (
  `id` int(11) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `category` enum('medicine','vaccine','vitamin') NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` int(11) NOT NULL DEFAULT 1 COMMENT '0 = yes, 1 = no',
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_inventory_group`
--

INSERT INTO `tbl_inventory_group` (`id`, `group_name`, `category`, `date_created`, `is_deleted`, `deleted_at`) VALUES
(1, 'Antibiotics', 'medicine', '2025-04-20 08:07:39', 1, NULL),
(2, 'Pain Relievers', 'medicine', '2025-04-20 08:07:39', 1, NULL),
(3, 'Antihistamines', 'medicine', '2025-04-20 08:07:39', 1, NULL),
(4, 'Dewormers', 'medicine', '2025-04-20 08:07:39', 1, NULL),
(5, 'Anti-inflammatory', 'medicine', '2025-04-20 08:07:39', 0, '2025-04-22 02:09:23'),
(6, 'Canine Core Vaccines', 'vaccine', '2025-04-20 08:07:39', 1, NULL),
(7, 'Feline Core Vaccines', 'vaccine', '2025-04-20 08:07:39', 1, NULL),
(8, 'Rabies Vaccine', 'vaccine', '2025-04-20 08:07:39', 1, NULL),
(9, '5-in-1 Combo', 'vaccine', '2025-04-20 08:07:39', 1, NULL),
(10, 'Booster Shots', 'vaccine', '2025-04-20 08:07:39', 0, '2025-04-22 02:09:05'),
(11, 'Multivitamins', 'vitamin', '2025-04-20 08:07:39', 1, NULL),
(12, 'Vitamin C Supplements', 'vitamin', '2025-04-20 08:07:39', 1, NULL),
(13, 'Joint Support', 'vitamin', '2025-04-20 08:07:39', 1, NULL),
(14, 'Appetite Boosters', 'vitamin', '2025-04-20 08:07:39', 1, NULL),
(15, 'Immune System Boosters', 'vitamin', '2025-04-20 08:07:39', 1, NULL),
(16, 'Excalibur', 'medicine', '2025-04-24 14:57:06', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_material_donations`
--

CREATE TABLE `tbl_material_donations` (
  `id` int(11) NOT NULL,
  `fund_id` int(11) NOT NULL COMMENT 'referece to tbl_funds fund_id',
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `estimated_value` decimal(12,2) DEFAULT 0.00,
  `received_by` int(11) DEFAULT NULL COMMENT 'reference tbl_users = user_id',
  `item_condition` int(11) DEFAULT 1 COMMENT '1 = new , 2 = used',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_material_donations`
--

INSERT INTO `tbl_material_donations` (`id`, `fund_id`, `item_name`, `quantity`, `unit`, `estimated_value`, `received_by`, `item_condition`, `notes`) VALUES
(1, 74, 'Dog Food Packs', 50, 'packs', 5000.00, 0, 1, 'Donated by PetCo Foundation'),
(2, 76, 'Cat Litter Bags', 30, 'bags', 2400.00, 0, 1, 'Essential supplies for shelter cats'),
(3, 78, 'Pet Shampoo Bottles', 40, 'bottles', 3200.00, 0, 1, 'Used for grooming and hygiene'),
(4, 80, 'Leashes and Collars', 60, 'pieces', 1800.00, 0, 1, 'Different sizes for rescue animals'),
(5, 82, 'Pet Carriers', 15, 'units', 6000.00, 0, 1, 'Still functional, for vet visits'),
(6, 84, 'Vaccination Kits', 25, 'kits', 7500.00, 0, 1, 'Includes syringes and vials'),
(7, 86, 'Leashes and Collars', 60, 'pieces', 1800.00, 0, 1, 'Different sizes for rescue animals'),
(8, 88, 'Pet Carriers', 15, 'units', 6000.00, 0, 1, 'Still functional, for vet visits'),
(9, 90, 'Vaccination Kits', 25, 'kits', 7500.00, 0, 1, 'Includes syringes and vials');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_no_account_donor`
--

CREATE TABLE `tbl_no_account_donor` (
  `donor_id` int(11) NOT NULL,
  `donor_name` varchar(255) NOT NULL,
  `donor_email` varchar(255) DEFAULT NULL,
  `donor_contact` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_no_account_users`
--

CREATE TABLE `tbl_no_account_users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(250) NOT NULL,
  `middle_name` varchar(250) DEFAULT NULL,
  `last_name` varchar(250) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `fb_twitter_ig` varchar(250) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `street` varchar(250) DEFAULT NULL,
  `barangay` varchar(250) DEFAULT NULL,
  `city_municipality` varchar(250) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `occupation` varchar(250) DEFAULT NULL,
  `civil_status` varchar(250) DEFAULT NULL,
  `phone_number` varchar(250) DEFAULT NULL,
  `sex` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_no_account_users`
--

INSERT INTO `tbl_no_account_users` (`id`, `first_name`, `middle_name`, `last_name`, `age`, `fb_twitter_ig`, `email`, `street`, `barangay`, `city_municipality`, `province`, `occupation`, `civil_status`, `phone_number`, `sex`, `created_at`, `updated_at`) VALUES
(1, 'John', 'Michael', 'Doe', 28, 'john_doe', 'johndoe@example.com', '123 Palm Street', 'San Roque', 'Quezon City', 'Metro Manila', 'Software Engineer', 'Single', '09171234567', 'Male', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(2, 'Jane', NULL, 'Smith', 34, 'jane_smith', 'janesmith@example.com', '45 Sunset Blvd', 'Sta. Lucia', 'Pasig', 'Metro Manila', 'Teacher', 'Married', '09181234567', 'Female', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(3, 'Carlos', 'Andres', 'Reyes', 29, 'carlos_reyes', 'carlosr@example.com', '678 Rainbow Ave', 'Bagumbayan', 'Taguig', 'Metro Manila', 'Nurse', 'Single', '09191234567', 'Male', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(4, 'Marissa', NULL, 'Villanueva', 24, 'marissa_v', 'marissav@example.com', '890 Ocean Drive', 'San Antonio', 'Makati', 'Metro Manila', 'Marketing Specialist', 'Single', '09201234567', 'Female', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(5, 'Luis', 'Fernando', 'Santos', 41, 'luis_santos', 'luiss@example.com', '789 Garden Road', 'Poblacion', 'Muntinlupa', 'Metro Manila', 'Businessman', 'Married', '09211234567', 'Male', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(6, 'Ana', 'Beatriz', 'Gomez', 30, 'ana_gomez', 'anag@example.com', '555 Hilltop', 'Banaba', 'Caloocan', 'Metro Manila', 'Doctor', 'Single', '09221234567', 'Female', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(7, 'Miguel', NULL, 'Torres', 27, 'miguel_t', 'miguelt@example.com', '200 Brookside', 'Sta. Elena', 'Marikina', 'Metro Manila', 'Architect', 'Single', '09231234567', 'Male', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(8, 'Patricia', 'Ann', 'Dela Cruz', 26, 'patricia_d', 'patd@example.com', '321 Sunshine St.', 'Bagong Silang', 'Manila', 'Metro Manila', 'Graphic Designer', 'Single', '09241234567', 'Female', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(9, 'Roberto', NULL, 'Garcia', 35, 'roberto_g', 'robertog@example.com', '67 Moonlight Path', 'Santo Niño', 'Las Piñas', 'Metro Manila', 'Engineer', 'Married', '09251234567', 'Male', '2025-04-26 14:42:01', '2025-04-26 14:42:01'),
(10, 'Clarisse', 'Mae', 'Santiago', 22, 'clarisse_s', 'clarisses@example.com', '12 Lakeside Lane', 'Kapitolyo', 'Pasig', 'Metro Manila', 'Student', 'Single', '09261234567', 'Female', '2025-04-26 14:42:01', '2025-04-26 14:42:01');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_official_position`
--

CREATE TABLE `tbl_official_position` (
  `id` int(11) NOT NULL,
  `position_title` varchar(255) NOT NULL,
  `position_description` text NOT NULL,
  `updated_at` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_official_position`
--

INSERT INTO `tbl_official_position` (`id`, `position_title`, `position_description`, `updated_at`, `date_created`) VALUES
(1, 'TAARA HEAD', 'The TAARA Head is the one who helps and creates a safe and holistic niche for rescues while being transitioned to their new home.', 2147483647, '2025-04-09 08:01:57'),
(2, 'SOCIAL MEDIA COORDINATOR', 'The Social Media Coordinator is the one who manages the Facebook page/group, Instagram, Youtube, and TikTok. He/She coordinates with influencer and media practitioners that moderates and manages the social platforms of TAARA that responds to page inquiries.', 2147483647, '2025-04-09 08:01:57'),
(3, 'HEAD RESCUER', 'The Head Rescuer is the one that ensures coordinated and animal friendly capture of stray cats and dogs and bringing them to proper disposition.', 2147483647, '2025-04-09 08:01:57');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pages`
--

CREATE TABLE `tbl_pages` (
  `id` int(11) NOT NULL,
  `page` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_pages`
--

INSERT INTO `tbl_pages` (`id`, `page`, `date_created`) VALUES
(1, 'Dashboard', '2025-04-11 11:53:29'),
(2, 'Volunteer', '2025-04-11 11:53:29'),
(3, 'Report', '2025-04-11 11:53:29'),
(4, 'Pets', '2025-04-11 11:53:29'),
(5, 'Budget Allocation', '2025-04-11 11:53:29'),
(6, 'Daily Expenses', '2025-04-11 11:53:29'),
(7, 'Announcement', '2025-04-11 11:53:29'),
(8, 'Inventory', '2025-04-11 11:53:29'),
(9, 'Pending', '2025-04-11 11:53:29'),
(10, 'Schedule', '2025-04-11 11:53:29'),
(11, 'Activities & Events', '2025-04-11 11:53:29'),
(12, 'Supplies', '2025-04-11 11:53:29'),
(13, 'Authorization', '2025-04-11 11:53:29'),
(14, 'Record', '2025-04-11 11:53:29'),
(15, 'Settings', '2025-04-11 11:53:29');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pet_transfer`
--

CREATE TABLE `tbl_pet_transfer` (
  `id` int(11) NOT NULL,
  `pet_transfer_id` int(11) NOT NULL,
  `pet_owner_first_name` varchar(255) NOT NULL,
  `pet_owner_middle_name` varchar(255) NOT NULL,
  `pet_owner_last_name` varchar(255) NOT NULL,
  `pet_name` varchar(255) NOT NULL,
  `reason_for_transfer` text NOT NULL,
  `pet_breed` varchar(255) NOT NULL,
  `pet_color` varchar(255) NOT NULL,
  `pet_eye_color` varchar(255) NOT NULL,
  `has_anti_rabies` int(11) NOT NULL COMMENT '1 = yes, 2 = no',
  `has_been_dewormed` int(11) NOT NULL COMMENT '1 = yes, 2 = no',
  `behaviour` varchar(255) NOT NULL,
  `pet_sleeping_place` int(11) NOT NULL COMMENT '1 = indoor, 2 = outdoor',
  `image_of_owner_and_pet` mediumblob NOT NULL,
  `date_request` date NOT NULL,
  `date_transfer` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_rescue_report`
--

CREATE TABLE `tbl_rescue_report` (
  `id` int(10) UNSIGNED NOT NULL,
  `reporter_type` int(11) NOT NULL DEFAULT 1 COMMENT '1 = existing user, 2 = added manually',
  `phone_number` bigint(20) DEFAULT NULL,
  `name` varchar(25) NOT NULL,
  `reporter_id` int(11) UNSIGNED DEFAULT NULL,
  `animal_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `status` enum('pending','approved','disapproved') DEFAULT 'pending',
  `rescue_status` int(11) NOT NULL DEFAULT 1 COMMENT '1 = Reported  \r\n2 = Acknowledged  \r\n3 = Rescue In Progress  \r\n4 = Reached Vet Clinic  \r\n5 = Deceased (as declared by vet)  \r\n6 = Released (to environment or public)  \r\n7 = Now Under Organization’s Care  \r\n8 = Returned to Owner  \r\n',
  `img_id` int(11) DEFAULT NULL COMMENT 'reference tbl_files',
  `report_date` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = false ,1  =true',
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_rescue_report`
--

INSERT INTO `tbl_rescue_report` (`id`, `reporter_type`, `phone_number`, `name`, `reporter_id`, `animal_type`, `description`, `location`, `latitude`, `longitude`, `status`, `rescue_status`, `img_id`, `report_date`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(1, 1, 9328427342, 'Daniel Torres', 101, 'Dog', 'A stray dog was spotted injured near the Tabaco City public market. It appears malnourished and scared.', 'Public Market, Tabaco City, Albay', 13.3590000, 123.7330000, 'approved', 3, 76, '2025-05-07 21:12:07', '2025-05-09 19:57:58', 0, '2025-05-09 12:59:48'),
(2, 1, 9328427342, 'James Villanueva', 103, 'Dog', 'A stray dog was spotted injured near the Tabaco City public market. It appears malnourished and scared.', 'Public Market, Tabaco City, Albay', 13.3590000, 123.7330000, 'approved', 1, 0, '2025-05-07 21:12:07', '2025-05-10 13:43:32', 0, '2025-05-09 12:59:48'),
(3, 1, 9328427342, 'Juan Cruz', 105, 'Dog', 'A stray dog was spotted injured near the Tabaco City public market. It appears malnourished and scared.', 'Public Market, Tabaco City, Albay', 13.3590000, 123.7330000, 'disapproved', 1, 75, '2025-05-07 21:12:07', '2025-05-09 21:10:20', 0, '2025-05-07 15:48:18'),
(4, 1, 9328427342, 'Mark Lopez', 107, 'Dog', 'A stray dog was spotted injured near the Tabaco City public market. It appears malnourished and scared.', 'Public Market, Tabaco City, Albay', 13.3590000, 123.7330000, 'disapproved', 1, 0, '2025-05-07 21:12:07', '2025-05-10 13:44:50', 0, '2025-05-07 15:48:18'),
(5, 2, 8456456865, 'dasdasd', NULL, 'Dog', 'sadfafd', 'asdfasfd', NULL, NULL, 'approved', 1, NULL, '2025-05-09 17:06:22', '2025-05-10 13:47:27', 0, NULL),
(6, 2, 9578567878, 'asdasd', NULL, 'Dog', 'gsdfgsdfg', 'sgfdsgfg', NULL, NULL, 'approved', 1, NULL, '2025-05-09 17:06:41', '2025-05-10 13:47:37', 0, NULL),
(7, 2, 2342343424, 'sdfasdf', NULL, 'Dog', 'fasfdasf', 'asdfasdf', NULL, NULL, 'pending', 1, NULL, '2025-05-09 17:09:29', '2025-05-09 17:09:29', 0, NULL),
(8, 2, 9467467657, 'fasdfa', NULL, 'Dog', 'dsfgsdfgsd', 'gsdfgsg', NULL, NULL, 'pending', 1, NULL, '2025-05-09 17:36:44', '2025-05-09 17:36:44', 0, NULL),
(9, 2, 9467456754, 'dfasfd', NULL, 'Dog', 'fasdfasdf', 'afdsfsadf', NULL, NULL, 'pending', 1, 71, '2025-05-09 17:38:49', '2025-05-09 11:38:49', 0, NULL),
(10, 2, 9328427342, 'fasdfqwefqwf', NULL, 'Dog', 'sdfasdf', 'fasdfasd', NULL, NULL, 'pending', 1, 72, '2025-05-09 18:57:58', '2025-05-09 12:57:58', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_schedule_category`
--

CREATE TABLE `tbl_schedule_category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_schedule_category`
--

INSERT INTO `tbl_schedule_category` (`category_id`, `category_name`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
(1, 'Vaccination', '2025-05-02 22:02:29', '2025-05-02 22:02:29', 0, NULL),
(2, 'Deworming', '2025-05-02 22:02:29', '2025-05-02 22:02:29', 0, NULL),
(3, 'Routine Vet Check-up', '2025-05-02 22:02:29', '2025-05-02 22:02:29', 0, NULL),
(4, 'Neutering/Spaying', '2025-05-02 22:02:29', '2025-05-02 22:02:29', 0, NULL),
(5, 'Microchipping', '2025-05-02 22:02:29', '2025-05-02 22:02:29', 0, NULL),
(6, 'Surgery Follow-up', '2025-05-02 22:02:29', '2025-05-02 22:02:29', 0, NULL),
(7, 'Dental Cleaning', '2025-05-02 22:02:29', '2025-05-02 22:02:29', 0, NULL),
(8, 'Behavioral Assessment', '2025-05-02 22:02:29', '2025-05-02 22:02:29', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transportation_fee`
--

CREATE TABLE `tbl_transportation_fee` (
  `id` int(11) NOT NULL,
  `transportation_fee_id` int(11) NOT NULL,
  `transportation_fee` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `user_id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL DEFAULT 1 COMMENT '1 = public , 2 = volunteer, 3 = officials',
  `image_id` int(11) NOT NULL COMMENT 'reference tbl_files',
  `first_name` varchar(250) NOT NULL,
  `middle_name` varchar(250) NOT NULL,
  `last_name` varchar(250) NOT NULL,
  `suffix` varchar(255) NOT NULL,
  `Bio` text NOT NULL,
  `birth_date` date NOT NULL,
  `email_address` varchar(250) NOT NULL,
  `phone_number` bigint(20) NOT NULL,
  `civil_status` varchar(255) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `street` varchar(250) NOT NULL,
  `brgy_name` varchar(250) NOT NULL,
  `city_municipality` varchar(250) NOT NULL,
  `province` varchar(250) NOT NULL,
  `sex` int(11) NOT NULL DEFAULT 1,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `roles` int(11) NOT NULL COMMENT 'tbl_positions_table id',
  `roles_type` int(11) DEFAULT 1 COMMENT '1 = official, 2 = volunteer',
  `page_access` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '\'[]\'',
  `date_created` date NOT NULL,
  `is_deleted` int(11) NOT NULL DEFAULT 1 COMMENT '0 = yes, 1 = no',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_activated` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = false, 1 =true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`user_id`, `user_type`, `image_id`, `first_name`, `middle_name`, `last_name`, `suffix`, `Bio`, `birth_date`, `email_address`, `phone_number`, `civil_status`, `occupation`, `street`, `brgy_name`, `city_municipality`, `province`, `sex`, `username`, `password`, `roles`, `roles_type`, `page_access`, `date_created`, `is_deleted`, `deleted_at`, `is_activated`) VALUES
(84, 3, 42, 'Juanex', 'Dela', 'Cruz', 'Jr.', 'A passionate web developer and technology enthusiast.', '1995-06-15', 'mikocoral05@gmail.com', 9328427342, 'Single', 'Software Engineer', '123 Main Street', 'Barangay Santo Niño', 'Quezon City', 'Metro Manila', 1, 'mik', '123', 1, 1, '\"\\\"\\\\\\\"[]\\\\\\\"\\\"\"', '2025-04-01', 1, NULL, 1),
(95, 2, 49, 'Juan', 'Dela', 'Cruz', '', 'System administrator with 5 years of experience.', '1990-05-15', 'juan.cruz@example.com', 9328427342, 'Single', 'IT Administrator', '123 Tech St.', 'Barangay San Jose', 'Quezon City', 'Metro Manila', 1, 'juandelacruz', 'hashed_password_1', 1, 2, '\"[]\"', '2025-04-01', 0, NULL, 1),
(96, 2, 49, 'Ana', 'Marquez', 'Santos', '', 'Freelance writer and content creator.', '1995-07-23', 'ana.santos@example.com', 9328427342, 'Single', 'Content Writer', '45 Story Lane', 'Barangay Bagong Pag-asa', 'Cebu City', 'Cebu', 2, 'anasantos95', 'hashed_password_2', 2, 2, '\"[]\"', '2025-04-01', 0, NULL, 1),
(97, 2, 68, 'Mark', 'David', 'Lopez', '', 'Software developer specializing in backend services.', '1988-11-30', 'mark.lopez@example.com', 9328427342, 'Married', 'Software Engineer', '78 Code St.', 'Barangay Sta. Cruz', 'Davao City', 'Davao del Sur', 1, 'markdlopez', 'hashed_password_3', 3, 2, '\"[]\"', '2025-04-01', 0, NULL, 1),
(98, 2, 38, 'Emily', 'Rose', 'Gonzales', '', 'Passionate about online community building.', '1993-09-10', 'emily.gonzales@example.com', 9328427342, 'Single', 'Community Manager', '12 Forum Avenue', 'Barangay Kamuning', 'Mandaluyong City', 'Metro Manila', 2, 'emilygonz', 'hashed_password_4', 4, 2, '\"[]\"', '2025-04-01', 1, NULL, 1),
(99, 3, 40, 'Carlos', 'Miguel', 'Reyes', '', 'Aspiring entrepreneur in e-commerce.', '2000-02-05', 'carlos.reyes@example.com', 9328427342, 'Single', 'E-commerce Specialist', '56 Online Street', 'Barangay San Isidro', 'Pasay City', 'Metro Manila', 1, 'carlosreyes20', 'hashed_password_5', 2, 1, '\"[]\"', '2025-04-01', 1, NULL, 1),
(100, 3, 57, 'Sophia', 'Isabel', 'Fernandez', '', 'Managing IT operations for startups.', '1985-06-18', 'sophia.fernandez@example.com', 9328427342, 'Married', 'IT Manager', '90 Innovation Blvd', 'Barangay Southpoint', 'Taguig City', 'Metro Manila', 2, 'sophiafern', 'hashed_password_6', 3, 1, '\"[]\"', '2025-04-01', 1, NULL, 1),
(101, 1, 55, 'Daniel', 'Andres', 'Torres', '', 'Photography enthusiast and social media expert.', '1997-12-14', 'daniel.torres@example.com', 9328427342, 'Single', 'Photographer', '67 Lens Avenue', 'Barangay Greenfields', 'Baguio City', 'Benguet', 1, 'mik', '1234', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(103, 1, 33, 'James', 'Paul', 'Villanueva', '', 'Passionate about cybersecurity and ethical hacking.', '1992-08-17', 'james.villanueva@example.com', 9328427342, 'Married', 'Cybersecurity Specialist', '88 Secure Lane', 'Barangay Shield', 'Iloilo City', 'Iloilo', 1, 'jameshacker', 'hashed_password_9', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(105, 1, 54, 'Juan', 'Dela', 'Cruz', '', 'System administrator with 5 years of experience.', '1990-05-15', 'juan.cruz@example.com', 9328427342, 'Single', 'IT Administrator', '123 Tech St.', 'Barangay San Jose', 'Quezon City', 'Metro Manila', 1, 'juandelacruz', 'hashed_password_1', 0, 0, '\"[]\"', '2025-04-01', 0, '2025-04-25 03:36:29', 1),
(107, 1, 58, 'Mark', 'David', 'Lopez', '', 'Software developer specializing in backend services.', '1988-11-30', 'mark.lopez@example.com', 9328427342, 'Married', 'Software Engineer', '78 Code St.', 'Barangay Sta. Cruz', 'Davao City', 'Davao del Sur', 1, 'markdlopez', 'hashed_password_3', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(111, 2, 58, 'Daniel', 'Andres', 'Torres', '', 'Photography enthusiast and social media expert.', '1997-12-14', 'daniel.torres@example.com', 9328427342, 'Single', 'Photographer', '67 Lens Avenue', 'Barangay Greenfields', 'Baguio City', 'Benguet', 1, 'danielt_photos', 'hashed_password_7', 5, 2, '\"[]\"', '2025-04-01', 1, NULL, 1),
(113, 1, 45, 'Juan', 'Dela', 'Cruz', 'Jr.', 'A passionate web developer and technology enthusiast.', '1995-06-15', 'mikocoral05@gmail.com', 9328427342, 'Single', 'Software Engineer', '123 Main Street', 'Barangay Santo Niño', 'Quezon City', 'Metro Manila', 1, 'mik', '123', 0, 0, '\"[]\"', '2025-04-01', 0, '2025-04-25 03:38:27', 1),
(114, 1, 62, 'Juan', 'Dela', 'Cruz', '', 'System administrator with 5 years of experience.', '1990-05-15', 'juan.cruz@example.com', 9328427342, 'Single', 'IT Administrator', '123 Tech St.', 'Barangay San Jose', 'Quezon City', 'Metro Manila', 1, 'juandelacruz', 'hashed_password_1', 0, 0, '\"[]\"', '2025-04-01', 0, '2025-04-25 03:39:22', 1),
(115, 1, 63, 'Ana', 'Marquez', 'Santos', '', 'Freelance writer and content creator.', '1995-07-23', 'ana.santos@example.com', 9328427342, 'Single', 'Content Writer', '45 Story Lane', 'Barangay Bagong Pag-asa', 'Cebu City', 'Cebu', 2, 'anasantos95', 'hashed_password_2', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(116, 1, 60, 'Mark', 'David', 'Lopez', '', 'Software developer specializing in backend services.', '1988-11-30', 'mark.lopez@example.com', 9328427342, 'Married', 'Software Engineer', '78 Code St.', 'Barangay Sta. Cruz', 'Davao City', 'Davao del Sur', 1, 'markdlopez', 'hashed_password_3', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(117, 1, 42, 'Emily', 'Rose', 'Gonzales', '', 'Passionate about online community building.', '1993-09-10', 'emily.gonzales@example.com', 9328427342, 'Single', 'Community Manager', '12 Forum Avenue', 'Barangay Kamuning', 'Mandaluyong City', 'Metro Manila', 2, 'emilygonz', 'hashed_password_4', 0, 0, '\"[]\"', '2025-04-01', 0, '2025-04-25 00:10:17', 1),
(118, 1, 39, 'Carlos', 'Miguel', 'Reyes', '', 'Aspiring entrepreneur in e-commerce.', '2000-02-05', 'carlos.reyes@example.com', 9328427342, 'Single', 'E-commerce Specialist', '56 Online Street', 'Barangay San Isidro', 'Pasay City', 'Metro Manila', 1, 'carlosreyes20', 'hashed_password_5', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(119, 1, 40, 'Sophia', 'Isabel', 'Fernandez', '', 'Managing IT operations for startups.', '1985-06-18', 'sophia.fernandez@example.com', 9328427342, 'Married', 'IT Manager', '90 Innovation Blvd', 'Barangay Southpoint', 'Taguig City', 'Metro Manila', 2, 'sophiafern', 'hashed_password_6', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(120, 1, 54, 'Daniel', 'Andres', 'Torres', '', 'Photography enthusiast and social media expert.', '1997-12-14', 'daniel.torres@example.com', 9328427342, 'Single', 'Photographer', '67 Lens Avenue', 'Barangay Greenfields', 'Baguio City', 'Benguet', 1, 'danielt_photos', 'hashed_password_7', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(121, 1, 38, 'Christine', 'Mae', 'Domingo', '', 'UX/UI designer creating meaningful experiences.', '1996-03-29', 'christine.domingo@example.com', 9328427342, 'Single', 'UX Designer', '34 Creative Alley', 'Barangay New Horizons', 'Cagayan de Oro City', 'Misamis Oriental', 2, 'christineux', 'hashed_password_8', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(122, 1, 38, 'Juan', 'Dela', 'Cruz', 'Jr.', 'A passionate web developer and technology enthusiast.', '1995-06-15', 'mikocoral05@gmail.com', 9328427342, 'Single', 'Software Engineer', '123 Main Street', 'Barangay Santo Niño', 'Quezon City', 'Metro Manila', 1, 'mik', '123', 0, 0, '\"[]\"', '2025-04-01', 0, '2025-04-25 03:39:22', 1),
(123, 1, 46, 'Juan', 'Dela', 'Cruz', '', 'System administrator with 5 years of experience.', '1990-05-15', 'juan.cruz@example.com', 9328427342, 'Single', 'IT Administrator', '123 Tech St.', 'Barangay San Jose', 'Quezon City', 'Metro Manila', 1, 'juandelacruz', 'hashed_password_1', 0, 0, '\"[]\"', '2025-04-01', 0, '2025-04-25 03:38:27', 1),
(124, 1, 48, 'Ana', 'Marquez', 'Santos', '', 'Freelance writer and content creator.', '1995-07-23', 'ana.santos@example.com', 9328427342, 'Single', 'Content Writer', '45 Story Lane', 'Barangay Bagong Pag-asa', 'Cebu City', 'Cebu', 2, 'anasantos95', 'hashed_password_2', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(125, 1, 30, 'Mark', 'David', 'Lopez', '', 'Software developer specializing in backend services.', '1988-11-30', 'mark.lopez@example.com', 9328427342, 'Married', 'Software Engineer', '78 Code St.', 'Barangay Sta. Cruz', 'Davao City', 'Davao del Sur', 1, 'markdlopez', 'hashed_password_3', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(126, 1, 59, 'Emily', 'Rose', 'Gonzales', '', 'Passionate about online community building.', '1993-09-10', 'emily.gonzales@example.com', 9328427342, 'Single', 'Community Manager', '12 Forum Avenue', 'Barangay Kamuning', 'Mandaluyong City', 'Metro Manila', 2, 'emilygonz', 'hashed_password_4', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(127, 1, 51, 'Carlos', 'Miguel', 'Reyes', '', 'Aspiring entrepreneur in e-commerce.', '2000-02-05', 'carlos.reyes@example.com', 9328427342, 'Single', 'E-commerce Specialist', '56 Online Street', 'Barangay San Isidro', 'Pasay City', 'Metro Manila', 1, 'carlosreyes20', 'hashed_password_5', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(128, 1, 50, 'Sophia', 'Isabel', 'Fernandez', '', 'Managing IT operations for startups.', '1985-06-18', 'sophia.fernandez@example.com', 9328427342, 'Married', 'IT Manager', '90 Innovation Blvd', 'Barangay Southpoint', 'Taguig City', 'Metro Manila', 2, 'sophiafern', 'hashed_password_6', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(129, 1, 67, 'Daniel', 'Andres', 'Torres', '', 'Photography enthusiast and social media expert.', '1997-12-14', 'daniel.torres@example.com', 9328427342, 'Single', 'Photographer', '67 Lens Avenue', 'Barangay Greenfields', 'Baguio City', 'Benguet', 1, 'danielt_photos', 'hashed_password_7', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1),
(130, 1, 34, 'Christine', 'Mae', 'Domingo', '', 'UX/UI designer creating meaningful experiences.', '1996-03-29', 'christine.domingo@example.com', 9328427342, 'Single', 'UX Designer', '34 Creative Alley', 'Barangay New Horizons', 'Cagayan de Oro City', 'Misamis Oriental', 2, 'christineux', 'hashed_password_8', 0, 0, '\"[]\"', '2025-04-01', 1, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_vet_bills`
--

CREATE TABLE `tbl_vet_bills` (
  `id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `bill_name` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `billing_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_volunteer_form`
--

CREATE TABLE `tbl_volunteer_form` (
  `id` int(11) NOT NULL,
  `volunteer_form_id` int(11) NOT NULL,
  `member_of_welfare_org` varchar(255) NOT NULL,
  `have_pets` varchar(255) NOT NULL,
  `have_children` varchar(255) NOT NULL,
  `experience_in_recue` varchar(250) DEFAULT NULL,
  `experience_details` text DEFAULT NULL,
  `vaccinated_anti_rabies` varchar(250) NOT NULL,
  `willing_to_be_vaccinated` varchar(255) NOT NULL,
  `family_favor_being_volunteer` varchar(255) NOT NULL,
  `related_member_in_organization` varchar(255) NOT NULL,
  `related_member_in_organization_name` varchar(255) DEFAULT NULL,
  `related_member_in_organization_relationship` varchar(255) DEFAULT NULL,
  `how_know_organization` varchar(255) NOT NULL,
  `most_available_day` varchar(255) NOT NULL,
  `most_available_time` varchar(255) NOT NULL,
  `formal_education_pet_care` varchar(255) NOT NULL,
  `done_any_other_volunteer_work` varchar(255) NOT NULL,
  `done_any_other_volunteer_work_indicate` text DEFAULT NULL,
  `physical_psychological_limitation` varchar(255) NOT NULL,
  `physical_psychological_limitation_indicate` text DEFAULT NULL,
  `contact_person_emergency_name` varchar(255) NOT NULL,
  `contact_person_emergency_number` bigint(11) NOT NULL,
  `contact_person_emergency_relationship` varchar(255) NOT NULL,
  `field_or_virtual_committee` varchar(255) NOT NULL,
  `field_or_virtual_committee_position` varchar(255) NOT NULL,
  `have_vehicle` varchar(255) DEFAULT NULL,
  `vehicle_type` varchar(255) DEFAULT NULL,
  `experience_managing_social_media` varchar(255) DEFAULT NULL,
  `software_use_in_design` varchar(255) DEFAULT NULL,
  `have_internet_connection` varchar(255) DEFAULT NULL,
  `device_use` varchar(255) DEFAULT NULL,
  `device_use_willing_to_use` varchar(255) DEFAULT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_volunteer_form`
--

INSERT INTO `tbl_volunteer_form` (`id`, `volunteer_form_id`, `member_of_welfare_org`, `have_pets`, `have_children`, `experience_in_recue`, `experience_details`, `vaccinated_anti_rabies`, `willing_to_be_vaccinated`, `family_favor_being_volunteer`, `related_member_in_organization`, `related_member_in_organization_name`, `related_member_in_organization_relationship`, `how_know_organization`, `most_available_day`, `most_available_time`, `formal_education_pet_care`, `done_any_other_volunteer_work`, `done_any_other_volunteer_work_indicate`, `physical_psychological_limitation`, `physical_psychological_limitation_indicate`, `contact_person_emergency_name`, `contact_person_emergency_number`, `contact_person_emergency_relationship`, `field_or_virtual_committee`, `field_or_virtual_committee_position`, `have_vehicle`, `vehicle_type`, `experience_managing_social_media`, `software_use_in_design`, `have_internet_connection`, `device_use`, `device_use_willing_to_use`, `date_created`) VALUES
(1, 2, 'No', 'No', 'No', 'No', NULL, 'No', 'No', 'No', 'No', NULL, NULL, 's', 'Tuesday', '5 hour', 'No', 'No', NULL, 'No', NULL, 's', 0, 's', 'Field Committee', 'Awareness and Events Committee', 'No', 's', NULL, NULL, NULL, NULL, NULL, '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_volunteer_position`
--

CREATE TABLE `tbl_volunteer_position` (
  `id` int(11) NOT NULL,
  `position_title` varchar(255) NOT NULL,
  `position_description` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_volunteer_position`
--

INSERT INTO `tbl_volunteer_position` (`id`, `position_title`, `position_description`, `updated_at`, `date_created`) VALUES
(1, 'Kennel Cleaner', 'Responsible for maintaining cleanliness in animal enclosures, ensuring a safe and hygienic space for rescued animals.', '2025-04-09 08:24:10', '2025-04-09 08:24:10'),
(2, 'Feeding Coordinator', 'Prepares and distributes food to the animals based on dietary requirements and feeding schedules.', '2025-04-09 08:24:10', '2025-04-09 08:24:10'),
(3, 'Animal Socializer', 'Helps socialize shy or traumatized animals by spending time playing, walking, or simply sitting with them.', '2025-04-09 08:24:10', '2025-04-09 08:24:10'),
(4, 'Transport Volunteer', 'Assists in safely transporting animals to and from vet appointments, foster homes, or adoption events.', '2025-04-09 08:24:10', '2025-04-09 08:24:10'),
(5, 'Event & Adoption Assistant', 'Supports in organizing and managing adoption drives, awareness events, and engaging with potential adopters.', '2025-04-09 08:24:10', '2025-04-09 08:24:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_activities_and_events`
--
ALTER TABLE `tbl_activities_and_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_adoption_form`
--
ALTER TABLE `tbl_adoption_form`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_adoption_process`
--
ALTER TABLE `tbl_adoption_process`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_adoption_story`
--
ALTER TABLE `tbl_adoption_story`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_animal_info`
--
ALTER TABLE `tbl_animal_info`
  ADD PRIMARY KEY (`animal_id`);

--
-- Indexes for table `tbl_animal_schedule`
--
ALTER TABLE `tbl_animal_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_announcements`
--
ALTER TABLE `tbl_announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_budget_allocation`
--
ALTER TABLE `tbl_budget_allocation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_cash_donations`
--
ALTER TABLE `tbl_cash_donations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_expenses`
--
ALTER TABLE `tbl_expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_files`
--
ALTER TABLE `tbl_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_funds`
--
ALTER TABLE `tbl_funds`
  ADD PRIMARY KEY (`fund_id`);

--
-- Indexes for table `tbl_inventory`
--
ALTER TABLE `tbl_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_inventory_group`
--
ALTER TABLE `tbl_inventory_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_material_donations`
--
ALTER TABLE `tbl_material_donations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_no_account_donor`
--
ALTER TABLE `tbl_no_account_donor`
  ADD PRIMARY KEY (`donor_id`);

--
-- Indexes for table `tbl_no_account_users`
--
ALTER TABLE `tbl_no_account_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_official_position`
--
ALTER TABLE `tbl_official_position`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_pages`
--
ALTER TABLE `tbl_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_rescue_report`
--
ALTER TABLE `tbl_rescue_report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_schedule_category`
--
ALTER TABLE `tbl_schedule_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `tbl_volunteer_form`
--
ALTER TABLE `tbl_volunteer_form`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `volunteer_form_id` (`volunteer_form_id`);

--
-- Indexes for table `tbl_volunteer_position`
--
ALTER TABLE `tbl_volunteer_position`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_activities_and_events`
--
ALTER TABLE `tbl_activities_and_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_adoption_form`
--
ALTER TABLE `tbl_adoption_form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_adoption_process`
--
ALTER TABLE `tbl_adoption_process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_adoption_story`
--
ALTER TABLE `tbl_adoption_story`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_animal_info`
--
ALTER TABLE `tbl_animal_info`
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `tbl_animal_schedule`
--
ALTER TABLE `tbl_animal_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_announcements`
--
ALTER TABLE `tbl_announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_budget_allocation`
--
ALTER TABLE `tbl_budget_allocation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_cash_donations`
--
ALTER TABLE `tbl_cash_donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_expenses`
--
ALTER TABLE `tbl_expenses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `tbl_files`
--
ALTER TABLE `tbl_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `tbl_funds`
--
ALTER TABLE `tbl_funds`
  MODIFY `fund_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `tbl_inventory`
--
ALTER TABLE `tbl_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `tbl_inventory_group`
--
ALTER TABLE `tbl_inventory_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_material_donations`
--
ALTER TABLE `tbl_material_donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_no_account_donor`
--
ALTER TABLE `tbl_no_account_donor`
  MODIFY `donor_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_no_account_users`
--
ALTER TABLE `tbl_no_account_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_official_position`
--
ALTER TABLE `tbl_official_position`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_pages`
--
ALTER TABLE `tbl_pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_rescue_report`
--
ALTER TABLE `tbl_rescue_report`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_schedule_category`
--
ALTER TABLE `tbl_schedule_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `tbl_volunteer_form`
--
ALTER TABLE `tbl_volunteer_form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_volunteer_position`
--
ALTER TABLE `tbl_volunteer_position`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
