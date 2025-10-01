-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 07, 2025 at 07:06 AM
-- Server version: 5.7.36
-- PHP Version: 8.1.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `uuid`, `name`, `created_at`, `updated_at`) VALUES
(1, 'cat_uncategorized_00000000-0000-0000-0000-000000000000', 'Uncategorized', '2025-07-04 07:45:19', '2025-07-04 07:45:19'),
(2, 'cat_53edcfb7-5051-438e-93c1-bd9a645bd82c', 'Men\'s T-Shirts', '2025-07-04 07:46:31', '2025-07-04 07:46:31'),
(3, 'cat_9a7561ea-ad72-42d7-a526-4318c597eb5a', 'Toys', '2025-07-04 07:46:34', '2025-07-04 07:46:34');

-- --------------------------------------------------------

--
-- Table structure for table `manufacturers`
--

CREATE TABLE `manufacturers` (
  `manufacturer_id` int(11) NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `manufacturers`
--

INSERT INTO `manufacturers` (`manufacturer_id`, `uuid`, `name`, `created_at`, `updated_at`) VALUES
(1, 'man_unknown_00000000-0000-0000-0000-000000000000', 'Unknown Manufacturer', '2025-07-04 07:45:19', '2025-07-04 07:45:19'),
(2, 'man_83546ef0-2197-4431-b930-41f2109cf0da', 'Vyroba', '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(3, 'man_1128f836-ba13-4673-be40-928f19f84753', 'Sklad', '2025-07-04 07:46:34', '2025-07-04 07:46:34');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `full_size_image` text COLLATE utf8mb4_unicode_ci,
  `category_id` int(11) DEFAULT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `isVisible` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `uuid`, `title`, `code`, `price`, `image`, `full_size_image`, `category_id`, `manufacturer_id`, `isVisible`, `created_at`, `updated_at`) VALUES
(1, 'prod_12ad7f2f-9613-4eae-99ba-33cef1d68a91', 'T-shirt ŠKODA RABBIT AK-47 White', 'DRK0019', '15.00', '/uploads/img_7662e5f2-6900-4481-a9f0-83fc361dd34e.webp', '/uploads/img_7662e5f2-6900-4481-a9f0-83fc361dd34e_full.webp', 2, 2, 1, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(2, 'prod_d390f761-41bf-470e-b538-a8ac2674c941', 'T-shirt ŠKODA RABBIT AK-47 Black', 'DRK0018', '15.00', '/uploads/img_1e6e7016-0adf-4713-939a-a1567a20bb22.webp', '/uploads/img_1e6e7016-0adf-4713-939a-a1567a20bb22_full.webp', 2, 2, 1, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(3, 'prod_45b02100-824f-45ac-a7e0-e820e33e5418', 'T-shirt DOUBLE RED Cars Museum White', 'DR20491', '15.00', '/uploads/img_9872a893-6da6-434a-a13f-23e08abb12bf.webp', '/uploads/img_9872a893-6da6-434a-a13f-23e08abb12bf_full.webp', 2, 2, 1, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(4, 'prod_3946bae7-10d2-4af1-b227-8120482ce22b', 'T-shirt DOUBLE RED Cars Museum Red', 'DR20492', '15.00', '/uploads/img_f5e1cc41-1562-4867-9845-7fe4bb4c7fd3.webp', '/uploads/img_f5e1cc41-1562-4867-9845-7fe4bb4c7fd3_full.webp', 2, 2, 1, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(5, 'prod_77773da0-f861-44b1-8404-a428bbe2cbc2', 'T-shirt DOUBLE RED Cars Museum Black', 'DR20493', '15.00', '/uploads/img_d723696f-2cad-4a3e-8382-56117b1c9d1c.webp', '/uploads/img_d723696f-2cad-4a3e-8382-56117b1c9d1c_full.webp', 2, 2, 1, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(6, 'prod_50e49baa-ead7-4138-b020-5c9d42223831', 'Strosek T-Shirt Black', 'DR20554', '15.00', '/uploads/img_6a02b6d4-8b29-4dfe-a2be-2bdc2ef17892.webp', '/uploads/img_6a02b6d4-8b29-4dfe-a2be-2bdc2ef17892_full.webp', 2, 2, 1, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(7, 'prod_619d9696-6149-4911-af68-025a621bf719', 'ŠKODA 130 RS Limited Edition 1:64', 'DRK0081', '20.00', '/uploads/img_8d6e8ffb-a32f-4efc-babc-648b4c31ff7a.webp', '/uploads/img_8d6e8ffb-a32f-4efc-babc-648b4c31ff7a_full.webp', 3, 3, 1, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(8, 'prod_05e57d0a-65ff-44c3-ae02-95769a021164', 'ŠKODA 130 LR Limited Edition 1:64', 'DRK0080', '20.00', '/uploads/img_b12fe120-7326-48ab-a6ed-840656c909d4.webp', '/uploads/img_b12fe120-7326-48ab-a6ed-840656c909d4_full.webp', 3, 3, 1, '2025-07-04 07:46:35', '2025-07-04 07:46:35');

-- --------------------------------------------------------

--
-- Table structure for table `product_sizes`
--

CREATE TABLE `product_sizes` (
  `product_size_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_sizes`
--

INSERT INTO `product_sizes` (`product_size_id`, `product_id`, `size_name`, `stock`, `created_at`, `updated_at`) VALUES
(1, 1, 'M', 26, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(2, 1, 'L', 20, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(3, 1, 'XL', 28, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(4, 1, 'XXL', 32, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(5, 1, 'S', 10, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(6, 2, 'M', 40, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(7, 2, 'L', 28, '2025-07-04 07:46:32', '2025-07-04 11:14:07'),
(8, 2, 'XL', 30, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(9, 2, 'XXL', 0, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(10, 2, 'S', 10, '2025-07-04 07:46:32', '2025-07-04 07:46:32'),
(11, 3, 'M', 40, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(12, 3, 'L', 34, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(13, 3, 'XL', 11, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(14, 3, 'XXL', 19, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(15, 4, 'M', 13, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(16, 4, 'L', 4, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(17, 4, 'XL', 39, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(18, 4, 'XXL', 0, '2025-07-04 07:46:33', '2025-07-04 07:46:33'),
(19, 5, 'M', 30, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(20, 5, 'L', 4, '2025-07-04 07:46:34', '2025-07-04 08:18:49'),
(21, 5, 'XL', 0, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(22, 5, 'XXL', 0, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(23, 6, 'S', 5, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(24, 6, 'M', 5, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(25, 6, 'L', 5, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(26, 6, 'XL', 5, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(27, 6, 'XXL', 5, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(28, 6, '3XL', 5, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(29, 7, 'ŠKODA 130 RS - ŠKODA 130 RS no. 49 Monte Carlo 1977', 3, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(30, 7, 'ŠKODA 130 RS - ŠKODA 130 RS no. 31 Rally Acropolis 1979', 3, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(31, 7, 'ŠKODA 130 RS - ŠKODA 130 RS no. 31 RALLY RAC 1976', 3, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(32, 7, 'ŠKODA 130 RS - ŠKODA 130 RS FULL SET', 3, '2025-07-04 07:46:34', '2025-07-04 07:46:34'),
(33, 8, 'ŠKODA 130 LR - ŠKODA 130 LR no. 24 Rally RAC 1986', 3, '2025-07-04 07:46:35', '2025-07-04 07:46:35'),
(34, 8, 'ŠKODA 130 LR - ŠKODA 130 LR no. 21 Rally Bohemia 1988', 3, '2025-07-04 07:46:35', '2025-07-04 07:46:35'),
(35, 8, 'ŠKODA 130 LR - ŠKODA 130 LR RED PLAIN BODY', 3, '2025-07-04 07:46:35', '2025-07-04 07:46:35'),
(36, 8, 'ŠKODA 130 LR - ŠKODA 130 LR FULL SET', 2, '2025-07-04 07:46:35', '2025-07-04 10:09:03');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sale_id` int(11) NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `submission_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sale_id`, `uuid`, `user_id`, `total_amount`, `payment_method`, `notes`, `submission_date`, `created_at`, `updated_at`) VALUES
(6, 'sale_94ddf9dc-55a8-4bbe-966b-da0acdd9ee64', 1, '15.00', 'Cash', '', '2025-07-04 10:18:49', '2025-07-04 08:18:49', '2025-07-04 08:18:49'),
(13, 'sale_d6ceef8a-7f2f-4430-8857-4be2dc732b68', 1, '22.00', 'Cash', '', '2025-07-04 11:45:09', '2025-07-04 09:45:09', '2025-07-04 09:45:09'),
(14, 'sale_40c84a17-1108-446c-9c76-b596b17a13b1', 1, '35.00', 'Cash', '', '2025-07-04 11:47:21', '2025-07-04 09:47:21', '2025-07-04 09:47:21'),
(15, 'sale_290e57e5-b033-4ed6-a8cf-833fd0b01f9d', 1, '16.00', 'Cash', '', '2025-07-04 11:51:03', '2025-07-04 09:51:03', '2025-07-04 09:51:03'),
(16, 'sale_e1734681-511e-403f-a12b-1da2cb6ea5b5', 1, '10.00', 'Cash', '', '2025-07-04 11:53:39', '2025-07-04 09:53:39', '2025-07-04 09:53:39'),
(17, 'sale_e1682ac4-a8df-4767-b920-1b7917b473ed', 1, '10.00', 'Cash', '', '2025-07-04 11:57:49', '2025-07-04 09:57:49', '2025-07-04 09:57:49'),
(18, 'sale_2f94e88a-d7d5-465e-9469-8de3a0b34c16', 1, '18.00', 'Cash', '', '2025-07-04 12:00:28', '2025-07-04 10:00:28', '2025-07-04 10:00:28'),
(19, 'sale_e0bacb89-9ff0-4815-8996-3bdb30d25916', 1, '15.00', 'Cash', '', '2025-07-04 12:00:48', '2025-07-04 10:00:48', '2025-07-04 10:00:48'),
(20, 'sale_8ae97c22-a08e-4d48-931f-a6a8011ba957', 2, '15.00', 'Cash', '', '2025-07-04 12:02:40', '2025-07-04 10:02:40', '2025-07-04 10:02:40'),
(21, 'sale_85b45e1c-b66f-4fef-bb9b-1455c0c53d81', 2, '20.00', 'Cash', '', '2025-07-04 12:09:03', '2025-07-04 10:09:03', '2025-07-04 10:09:03'),
(22, 'sale_ae71f345-b2ab-403c-bfa8-30600ef02070', 3, '15.00', 'Cash', '', '2025-07-04 13:14:07', '2025-07-04 11:14:07', '2025-07-04 11:14:07');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `sale_item_id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_uuid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `full_size_image` text COLLATE utf8mb4_unicode_ci,
  `selected_size` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT '0.00',
  `final_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`sale_item_id`, `sale_id`, `product_id`, `product_uuid`, `title`, `code`, `image`, `full_size_image`, `selected_size`, `quantity`, `unit_price`, `discount`, `final_price`, `created_at`) VALUES
(6, 6, 5, 'prod_77773da0-f861-44b1-8404-a428bbe2cbc2', 'T-shirt DOUBLE RED Cars Museum Black', 'DR20493', 'http://localhost:3001/uploads/img_d723696f-2cad-4a3e-8382-56117b1c9d1c.webp', 'http://localhost:3001/uploads/img_d723696f-2cad-4a3e-8382-56117b1c9d1c_full.webp', 'L', 1, '15.00', '0.00', '15.00', '2025-07-04 08:18:49'),
(13, 13, NULL, NULL, 'hohohoo', 'bo22', '', '', 'N/A', 1, '0.00', '0.00', '0.00', '2025-07-04 09:45:09'),
(14, 14, NULL, NULL, 'T-shirt men carbonaro', 'MANUAL_ITEM', '', '', 'M', 1, '0.00', '0.00', '0.00', '2025-07-04 09:47:21'),
(15, 14, NULL, NULL, 'Magnet Jaguar', 'MANUAL_ITEM', '', '', 'N/A', 2, '0.00', '0.00', '0.00', '2025-07-04 09:47:21'),
(16, 15, NULL, NULL, 'CUP', 'N/A', '', '', 'N/A', 2, '0.00', '0.00', '0.00', '2025-07-04 09:51:03'),
(17, 16, NULL, NULL, 'Magnet Zoho', 'N/A', '', '', 'N/A', 3, '0.00', '5.00', '-5.00', '2025-07-04 09:53:39'),
(18, 17, NULL, NULL, 'somethin', 'N/A', '', '', 'N/A', 3, '0.00', '5.00', '-5.00', '2025-07-04 09:57:49'),
(19, 18, NULL, NULL, 'Snood Zebra', 'N/A', '', '', 'N/A', 3, '6.00', '0.00', '0.00', '2025-07-04 10:00:28'),
(20, 19, 2, 'prod_d390f761-41bf-470e-b538-a8ac2674c941', 'T-shirt ŠKODA RABBIT AK-47 Black', 'DRK0018', 'http://localhost:3001/uploads/img_1e6e7016-0adf-4713-939a-a1567a20bb22.webp', 'http://localhost:3001/uploads/img_1e6e7016-0adf-4713-939a-a1567a20bb22_full.webp', 'L', 1, '15.00', '0.00', '15.00', '2025-07-04 10:00:48'),
(21, 20, NULL, NULL, 'Zeny Tricka carbonarno', 'N/A', '', '', 's', 1, '15.00', '0.00', '0.00', '2025-07-04 10:02:40'),
(22, 21, 8, 'prod_05e57d0a-65ff-44c3-ae02-95769a021164', 'ŠKODA 130 LR Limited Edition 1:64', 'DRK0080', 'http://localhost:3001/uploads/img_b12fe120-7326-48ab-a6ed-840656c909d4.webp', 'http://localhost:3001/uploads/img_b12fe120-7326-48ab-a6ed-840656c909d4_full.webp', 'ŠKODA 130 LR - ŠKODA 130 LR FULL SET', 1, '20.00', '0.00', '20.00', '2025-07-04 10:09:03'),
(23, 22, 2, 'prod_d390f761-41bf-470e-b538-a8ac2674c941', 'T-shirt ŠKODA RABBIT AK-47 Black', 'DRK0018', 'http://localhost:3001/uploads/img_1e6e7016-0adf-4713-939a-a1567a20bb22.webp', 'http://localhost:3001/uploads/img_1e6e7016-0adf-4713-939a-a1567a20bb22_full.webp', 'L', 1, '15.00', '0.00', '15.00', '2025-07-04 11:14:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hashedPassword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','employee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'employee',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `permissions` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `uuid`, `username`, `hashedPassword`, `role`, `created_at`, `updated_at`, `permissions`) VALUES
(1, 'user_b3992c12-0ffb-4cf2-bfde-2846a6820756', 'RED', '$2y$10$OZymkjB1uAcyG5eWXR4wceZh/0K5jWyqBCrRhffYx4IlmCaSqgNRO', 'admin', '2025-07-04 07:44:38', '2025-07-04 07:44:38', NULL),
(2, 'user_0c000909-2999-490e-8138-0aa31cccf824', 'em', '$2a$10$ukoTLbnqdH2THk7AyGajEOIwlR5P5arBqpJlFeA0XwDNfZqQrq63.', 'employee', '2025-07-04 10:01:39', '2025-07-04 11:07:46', '{\"editProducts\":false,\"accessInventory\":false,\"viewFullSalesHistory\":false}'),
(3, 'user_43c2a282-53be-468c-9f16-afe3fc7fa600', 'Mat', '$2a$10$O8E8MWbaNfJbVTZTncksFeCSngIFqNwNHMXsicayMVz7Kd/momo4m', 'employee', '2025-07-04 10:01:52', '2025-07-04 10:01:52', '{\"editProducts\":false,\"accessInventory\":false,\"viewFullSalesHistory\":false}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_category_uuid` (`uuid`);

--
-- Indexes for table `manufacturers`
--
ALTER TABLE `manufacturers`
  ADD PRIMARY KEY (`manufacturer_id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_manufacturer_uuid` (`uuid`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `manufacturer_id` (`manufacturer_id`),
  ADD KEY `idx_product_uuid` (`uuid`),
  ADD KEY `idx_product_code` (`code`),
  ADD KEY `idx_product_title` (`title`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`product_size_id`),
  ADD UNIQUE KEY `uq_product_size` (`product_id`,`size_name`),
  ADD KEY `idx_product_size_name` (`size_name`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sale_id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_sale_uuid` (`uuid`),
  ADD KEY `idx_sale_submission_date` (`submission_date`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`sale_item_id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_sale_item_product_uuid` (`product_uuid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_user_uuid` (`uuid`),
  ADD KEY `id_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `manufacturer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `product_size_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `sale_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`manufacturer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
