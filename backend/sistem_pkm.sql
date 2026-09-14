-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 07 Jun 2026 pada 17.00
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistem_pkm`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `parent_account_id` int(11) DEFAULT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('asset','liability','equity','income','expense') NOT NULL,
  `normal_balance` enum('debit','credit') NOT NULL,
  `level` int(11) DEFAULT 1,
  `is_leaf` tinyint(1) DEFAULT 1,
  `is_system` tinyint(1) DEFAULT 0,
  `opening_balance` decimal(15,2) DEFAULT 0.00,
  `current_balance` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `accounts`
--

INSERT INTO `accounts` (`id`, `tenant_id`, `parent_account_id`, `code`, `name`, `type`, `normal_balance`, `level`, `is_leaf`, `is_system`, `opening_balance`, `current_balance`, `created_at`, `updated_at`, `deleted_at`) VALUES
(75, 1, NULL, '1101', 'Kas', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(76, 1, NULL, '1102', 'Kas Bank', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(77, 1, NULL, '1103', 'Kas Kecil (Petty Cash)', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(78, 1, NULL, '1201', 'Investasi Jangka Pendek', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(79, 1, NULL, '1301', 'Piutang Usaha', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(80, 1, NULL, '1401', 'Persediaan Barang Dagang', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(81, 1, NULL, '1402', 'Persediaan Bahan Baku', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(82, 1, NULL, '1403', 'Barang Dalam Proses (WIP)', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(83, 1, NULL, '1404', 'Penyisihan Piutang Ragu-ragu', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(84, 1, NULL, '1501', 'Perlengkapan', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(85, 1, NULL, '1502', 'Akumulasi Penyusutan Perlengkapan', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(86, 1, NULL, '1804', 'Peralatan', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(87, 1, NULL, '1805', 'Akumulasi Penyusutan Peralatan', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(88, 1, NULL, '1806', 'Akumulasi Penyusutan Bangunan', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(89, 1, NULL, '2101', 'Utang Usaha', 'liability', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(90, 1, NULL, '2102', 'Utang Bank / Pinjaman', 'liability', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(91, 1, NULL, '2103', 'PPN Keluaran', 'liability', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(92, 1, NULL, '2104', 'Pajak Terutang (PPh / Pajak Final)', 'liability', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(93, 1, NULL, '3101', 'Modal Awal', 'equity', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(94, 1, NULL, '3301', 'Prive', 'equity', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(95, 1, NULL, '4101', 'Pendapatan Usaha', 'income', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(96, 1, NULL, '4102', 'Retur Penjualan', 'income', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(97, 1, NULL, '4103', 'Potongan Penjualan / Diskon', 'income', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(98, 1, NULL, '4201', 'Pendapatan Bunga', 'income', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(99, 1, NULL, '4202', 'Pendapatan Lain-lain', 'income', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(100, 1, NULL, '5101', 'Harga Pokok Penjualan (HPP)', 'expense', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(101, 1, NULL, '5201', 'Beban Gaji', 'expense', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(102, 1, NULL, '5301', 'Beban Sewa', 'expense', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(103, 1, NULL, '5401', 'Beban Listrik', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(104, 1, NULL, '5402', 'Beban Air', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(105, 1, NULL, '5403', 'Beban Telepon', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(106, 1, NULL, '5501', 'Beban Perlengkapan', 'expense', 'debit', 1, 1, 1, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(107, 1, NULL, '5601', 'Beban Penyusutan Bangunan', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(108, 1, NULL, '5602', 'Beban Penyusutan Peralatan', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(109, 1, NULL, '5701', 'Beban Transportasi', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(110, 1, NULL, '5901', 'Beban Lain-lain', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(111, 1, NULL, '5902', 'Beban Pajak', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-05-21 06:49:19', '2026-05-21 06:49:19', NULL),
(149, 3, NULL, '1101', 'Kas', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(150, 3, NULL, '1102', 'Kas Bank', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(151, 3, NULL, '1103', 'Kas Kecil (Petty Cash)', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(152, 3, NULL, '1201', 'Investasi Jangka Pendek', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(153, 3, NULL, '1301', 'Piutang Usaha', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(154, 3, NULL, '1401', 'Persediaan Barang Dagang', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(155, 3, NULL, '1402', 'Persediaan Bahan Baku', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(156, 3, NULL, '1403', 'Barang Dalam Proses (WIP)', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(157, 3, NULL, '1404', 'Penyisihan Piutang Ragu-ragu', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(158, 3, NULL, '1501', 'Perlengkapan', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(159, 3, NULL, '1502', 'Akumulasi Penyusutan Perlengkapan', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(160, 3, NULL, '1804', 'Peralatan', 'asset', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(161, 3, NULL, '1805', 'Akumulasi Penyusutan Peralatan', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(162, 3, NULL, '1806', 'Akumulasi Penyusutan Bangunan', 'asset', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(163, 3, NULL, '2101', 'Utang Usaha', 'liability', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(164, 3, NULL, '2102', 'Utang Bank / Pinjaman', 'liability', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(165, 3, NULL, '2103', 'PPN Keluaran', 'liability', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(166, 3, NULL, '2104', 'Pajak Terutang (PPh / Pajak Final)', 'liability', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(167, 3, NULL, '3101', 'Modal Awal', 'equity', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(168, 3, NULL, '3301', 'Prive', 'equity', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(169, 3, NULL, '4101', 'Pendapatan Usaha', 'income', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(170, 3, NULL, '4102', 'Retur Penjualan', 'income', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(171, 3, NULL, '4103', 'Potongan Penjualan / Diskon', 'income', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(172, 3, NULL, '4201', 'Pendapatan Bunga', 'income', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(173, 3, NULL, '4202', 'Pendapatan Lain-lain', 'income', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(174, 3, NULL, '5101', 'Harga Pokok Penjualan (HPP)', 'expense', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(175, 3, NULL, '5201', 'Beban Gaji', 'expense', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(176, 3, NULL, '5301', 'Beban Sewa', 'expense', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(177, 3, NULL, '5401', 'Beban Listrik', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(178, 3, NULL, '5402', 'Beban Air', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(179, 3, NULL, '5403', 'Beban Telepon', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(180, 3, NULL, '5501', 'Beban Perlengkapan', 'expense', 'debit', 1, 1, 1, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(181, 3, NULL, '5601', 'Beban Penyusutan Bangunan', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(182, 3, NULL, '5602', 'Beban Penyusutan Peralatan', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(183, 3, NULL, '5701', 'Beban Transportasi', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(184, 3, NULL, '5901', 'Beban Lain-lain', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL),
(185, 3, NULL, '5902', 'Beban Pajak', 'expense', 'debit', 1, 1, 0, 0.00, 0.00, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `business_types`
--

CREATE TABLE `business_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `cost_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `business_types`
--

INSERT INTO `business_types` (`id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`, `cost_order`) VALUES
(1, 'Warung & Kios', 'Usaha kecil yang menjual kebutuhan sehari-hari', '2026-05-21 06:30:05', '2026-05-21 06:30:05', NULL, 1),
(2, 'Jasa & Layanan', 'Usaha yang memberikan jasa/layanan kepada pelanggan', '2026-05-21 06:30:05', '2026-05-21 06:30:05', NULL, 2),
(3, 'Kuliner & Rumah Makan', 'Usaha di bidang makanan dan minuman', '2026-05-21 06:30:05', '2026-05-21 06:30:05', NULL, 3),
(4, 'Produksi/Home Industry', 'Usaha produksi rumahan / home industry', '2026-05-21 06:30:05', '2026-05-21 06:30:05', NULL, 4),
(5, 'Pertanian & Peternakan', 'Usaha di bidang pertanian dan peternakan', '2026-05-21 06:30:05', '2026-05-21 06:30:05', NULL, 5),
(6, 'Toko Online', 'Bisnis e-commerce yang menjual produk secara digital melalui marketplace, website, atau media sosial. Contoh: shopee, tokopedia, dropshipper, reseller online', '2026-05-21 06:30:41', '2026-05-21 06:30:41', NULL, 6),
(7, 'Konfeksi', 'Bisnis produksi pakaian jadi (konveksi) yang memproduksi baju, kaos, seragam, jaket, dll dalam skala menengah. Contoh: konveksi kaos, konveksi seragam, konveksi jaket', '2026-05-21 06:30:41', '2026-05-21 06:30:41', NULL, 7);

-- --------------------------------------------------------

--
-- Struktur dari tabel `business_type_categories`
--

CREATE TABLE `business_type_categories` (
  `id` int(11) NOT NULL,
  `business_type_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `category_type` varchar(50) NOT NULL,
  `debit_account_code` varchar(20) NOT NULL,
  `credit_account_code` varchar(20) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_default` tinyint(1) DEFAULT 0,
  `is_adjustment` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `business_type_categories`
--

INSERT INTO `business_type_categories` (`id`, `business_type_id`, `category_name`, `category_type`, `debit_account_code`, `credit_account_code`, `sort_order`, `is_default`, `is_adjustment`, `created_at`, `updated_at`) VALUES
(1, 1, 'Pendapatan Tunai', 'income', '1101', '4101', 10, 1, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(2, 1, 'Penjualan Kredit (Bon)', 'income', '1301', '4101', 11, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(3, 1, 'Terima Pembayaran Bon', 'income', '1101', '1301', 12, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(4, 1, 'Retur Penjualan', 'income', '4101', '1101', 13, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(5, 1, 'Diskon / Potongan Penjualan', 'income', '4103', '1101', 14, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(6, 1, 'Pendapatan Lain-lain', 'income', '1101', '4202', 15, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(7, 1, 'Setoran Kas ke Bank', 'asset', '1102', '1101', 16, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(8, 1, 'Penarikan Bank ke Kas', 'asset', '1101', '1102', 17, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(9, 1, 'Pembelian Barang Tunai', 'expense', '1401', '1101', 20, 1, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(10, 1, 'Pembelian Barang Kredit', 'liability', '1401', '2101', 21, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(11, 1, 'Bayar Utang Supplier', 'expense', '2101', '1101', 22, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(12, 1, 'Beban Listrik', 'expense', '5401', '1101', 30, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(13, 1, 'Beban Sewa', 'expense', '5301', '1101', 31, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(14, 1, 'Beban Transportasi', 'expense', '5701', '1101', 32, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(15, 1, 'Beban Gaji', 'expense', '5201', '1101', 33, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(16, 1, 'Beban Kebersihan & Operasional', 'expense', '5901', '1101', 34, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(17, 1, 'Beban Perlengkapan', 'expense', '5501', '1101', 35, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(18, 1, 'Setoran Modal', 'capital', '1101', '3101', 40, 1, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(19, 1, 'Prive', 'capital', '3301', '1101', 41, 0, 0, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(20, 1, 'Penyesuaian Persediaan (Stock Opname)', 'expense', '5101', '1401', 50, 0, 1, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(21, 1, 'Barang Rusak / Hilang', 'expense', '5901', '1401', 51, 0, 1, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(22, 1, 'Penyusutan Peralatan', 'expense', '5602', '1805', 52, 0, 1, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(23, 1, 'Pemakaian Perlengkapan', 'expense', '5501', '1502', 53, 0, 1, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(24, 1, 'Selisih Kas', 'expense', '5901', '1101', 54, 0, 1, '2026-05-21 07:17:21', '2026-05-21 07:17:21'),
(25, 2, 'Pendapatan Jasa Tunai', 'income', '1101', '4201', 10, 1, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(26, 2, 'Pendapatan Jasa Kredit (Bon)', 'income', '1301', '4201', 11, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(27, 2, 'Terima Pembayaran Bon', 'income', '1101', '1301', 12, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(28, 2, 'Retur / Pembatalan Jasa', 'income', '4201', '1101', 13, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(29, 2, 'Diskon / Potongan Jasa', 'income', '4103', '1101', 14, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(30, 2, 'Pendapatan Lain-lain', 'income', '1101', '4202', 15, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(31, 2, 'Setoran Kas ke Bank', 'asset', '1102', '1101', 16, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(32, 2, 'Penarikan Bank ke Kas', 'asset', '1101', '1102', 17, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(33, 2, 'Beli Perlengkapan Tunai', 'expense', '1501', '1101', 20, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(34, 2, 'Beli Perlengkapan Kredit', 'liability', '1501', '2101', 21, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(35, 2, 'Bayar Utang Supplier', 'expense', '2101', '1101', 22, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(36, 2, 'Beban Gaji', 'expense', '5201', '1101', 30, 1, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(37, 2, 'Beban Listrik', 'expense', '5401', '1101', 31, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(38, 2, 'Beban Air', 'expense', '5402', '1101', 32, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(39, 2, 'Beban Telepon / Wifi', 'expense', '5403', '1101', 33, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(40, 2, 'Beban Sewa', 'expense', '5301', '1101', 34, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(41, 2, 'Beban Transportasi', 'expense', '5701', '1101', 35, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(42, 2, 'Beban Promosi / Iklan', 'expense', '5901', '1101', 36, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(43, 2, 'Beban Kebersihan & Operasional', 'expense', '5901', '1101', 37, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(44, 2, 'Beban Perlengkapan Kantor', 'expense', '5501', '1101', 38, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(45, 2, 'Beban Pelatihan & Sertifikasi', 'expense', '5901', '1101', 39, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(46, 2, 'Beli Peralatan', 'asset', '1804', '1101', 40, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(47, 2, 'Beli Kendaraan Operasional', 'asset', '1804', '1101', 41, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(48, 2, 'Setoran Modal', 'capital', '1101', '3101', 50, 1, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(49, 2, 'Prive (Penarikan Modal)', 'capital', '3301', '1101', 51, 0, 0, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(50, 2, 'Penyusutan Peralatan', 'expense', '5602', '1805', 60, 0, 1, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(51, 2, 'Penyusutan Kendaraan', 'expense', '5602', '1805', 61, 0, 1, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(52, 2, 'Pemakaian Perlengkapan', 'expense', '5501', '1502', 62, 0, 1, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(53, 2, 'Penyesuaian Piutang Tak Tertagih', 'expense', '5901', '1301', 63, 0, 1, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(54, 2, 'Selisih Kas', 'expense', '5901', '1101', 64, 0, 1, '2026-05-22 13:11:08', '2026-05-22 13:11:08'),
(55, 3, 'Pendapatan Penjualan Tunai', 'income', '1101', '4101', 10, 1, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(56, 3, 'Penjualan Kredit (Bon)', 'income', '1301', '4101', 11, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(57, 3, 'Terima Pembayaran Bon', 'income', '1101', '1301', 12, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(58, 3, 'Retur Penjualan', 'income', '4101', '1101', 13, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(59, 3, 'Diskon / Potongan Penjualan', 'income', '4103', '1101', 14, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(60, 3, 'Pendapatan Lain-lain', 'income', '1101', '4202', 15, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(61, 3, 'Setoran Kas ke Bank', 'asset', '1102', '1101', 16, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(62, 3, 'Penarikan Bank ke Kas', 'asset', '1101', '1102', 17, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(63, 3, 'Pembelian Bahan Baku Tunai', 'expense', '1401', '1101', 20, 1, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(64, 3, 'Pembelian Bahan Baku Kredit', 'liability', '1401', '2101', 21, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(65, 3, 'Pembelian Minuman & Snack', 'expense', '1401', '1101', 22, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(66, 3, 'Pembelian Bumbu & Rempah', 'expense', '1401', '1101', 23, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(67, 3, 'Bayar Utang Supplier', 'expense', '2101', '1101', 24, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(68, 3, 'Beban Gaji Karyawan', 'expense', '5201', '1101', 30, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(69, 3, 'Beban Listrik', 'expense', '5401', '1101', 31, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(70, 3, 'Beban Air', 'expense', '5402', '1101', 32, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(71, 3, 'Beban Telepon / Wifi', 'expense', '5403', '1101', 33, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(72, 3, 'Beban Sewa Tempat', 'expense', '5301', '1101', 34, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(73, 3, 'Beban Gas & Bahan Bakar', 'expense', '5901', '1101', 35, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(74, 3, 'Beban Transportasi', 'expense', '5701', '1101', 36, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(75, 3, 'Beban Promosi / Iklan', 'expense', '5901', '1101', 37, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(76, 3, 'Beban Kebersihan & Sanitasi', 'expense', '5901', '1101', 38, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(77, 3, 'Beban Peralatan Makan', 'expense', '5901', '1101', 39, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(78, 3, 'Beban Perlengkapan Dapur', 'expense', '5501', '1101', 40, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(79, 3, 'Beli Peralatan Dapur', 'asset', '1804', '1101', 45, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(80, 3, 'Beli Peralatan Makan', 'asset', '1804', '1101', 46, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(81, 3, 'Beli Kursi & Meja', 'asset', '1804', '1101', 47, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(82, 3, 'Setoran Modal', 'capital', '1101', '3101', 50, 1, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(83, 3, 'Prive (Penarikan Modal)', 'capital', '3301', '1101', 51, 0, 0, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(84, 3, 'Penyesuaian Persediaan Bahan Baku', 'expense', '5101', '1401', 60, 0, 1, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(85, 3, 'Bahan Baku Rusak / Kadaluarsa', 'expense', '5901', '1401', 61, 0, 1, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(86, 3, 'Penyusutan Peralatan Dapur', 'expense', '5602', '1805', 62, 0, 1, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(87, 3, 'Penyusutan Peralatan Makan', 'expense', '5602', '1805', 63, 0, 1, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(88, 3, 'Pemakaian Perlengkapan Dapur', 'expense', '5501', '1502', 64, 0, 1, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(89, 3, 'Selisih Kas', 'expense', '5901', '1101', 65, 0, 1, '2026-05-22 13:13:21', '2026-05-22 13:13:21'),
(90, 4, 'Pendapatan Penjualan Tunai', 'income', '1101', '4101', 10, 1, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(91, 4, 'Penjualan Kredit', 'income', '1301', '4101', 11, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(92, 4, 'Terima Pembayaran Piutang', 'income', '1101', '1301', 12, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(93, 4, 'Retur Penjualan', 'income', '4101', '1101', 13, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(94, 4, 'Diskon / Potongan Penjualan', 'income', '4103', '1101', 14, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(95, 4, 'Pendapatan Lain-lain', 'income', '1101', '4202', 15, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(96, 4, 'Setoran Kas ke Bank', 'asset', '1102', '1101', 16, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(97, 4, 'Penarikan Bank ke Kas', 'asset', '1101', '1102', 17, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(98, 4, 'Pembelian Bahan Baku Tunai', 'expense', '1402', '1101', 20, 1, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(99, 4, 'Pembelian Bahan Baku Kredit', 'liability', '1402', '2101', 21, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(100, 4, 'Pembelian Bahan Penolong', 'expense', '1402', '1101', 22, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(101, 4, 'Pembelian Kemasan', 'expense', '1402', '1101', 23, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(102, 4, 'Bayar Utang Supplier', 'expense', '2101', '1101', 24, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(103, 4, 'Beban Tenaga Kerja Langsung', 'expense', '5201', '1101', 30, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(104, 4, 'Beban Listrik Produksi', 'expense', '5401', '1101', 31, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(105, 4, 'Beban Air Produksi', 'expense', '5402', '1101', 32, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(106, 4, 'Beban Telepon / Internet', 'expense', '5403', '1101', 33, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(107, 4, 'Beban Sewa Tempat Produksi', 'expense', '5301', '1101', 34, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(108, 4, 'Beban Transportasi', 'expense', '5701', '1101', 35, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(109, 4, 'Beban Promosi / Iklan', 'expense', '5901', '1101', 36, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(110, 4, 'Beban Perlengkapan Produksi', 'expense', '5501', '1101', 37, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(111, 4, 'Beban Perawatan Mesin', 'expense', '5901', '1101', 38, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(112, 4, 'Beban Kebersihan', 'expense', '5901', '1101', 39, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(113, 4, 'Beli Mesin Produksi', 'asset', '1804', '1101', 40, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(114, 4, 'Beli Peralatan Produksi', 'asset', '1804', '1101', 41, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(115, 4, 'Beli Kendaraan Operasional', 'asset', '1804', '1101', 42, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(116, 4, 'Setoran Modal', 'capital', '1101', '3101', 50, 1, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(117, 4, 'Prive (Penarikan Modal)', 'capital', '3301', '1101', 51, 0, 0, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(118, 4, 'Penyesuaian Persediaan Bahan Baku', 'expense', '5101', '1402', 60, 0, 1, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(119, 4, 'Bahan Baku Rusak', 'expense', '5901', '1402', 61, 0, 1, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(120, 4, 'Penyusutan Mesin Produksi', 'expense', '5602', '1805', 62, 0, 1, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(121, 4, 'Penyusutan Peralatan', 'expense', '5602', '1805', 63, 0, 1, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(122, 4, 'Pemakaian Perlengkapan', 'expense', '5501', '1502', 64, 0, 1, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(123, 4, 'Selisih Kas', 'expense', '5901', '1101', 65, 0, 1, '2026-05-22 13:14:23', '2026-05-22 13:14:23'),
(124, 5, 'Pendapatan Penjualan Hasil Panen', 'income', '1101', '4101', 10, 1, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(125, 5, 'Penjualan Kredit', 'income', '1301', '4101', 11, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(126, 5, 'Terima Pembayaran Piutang', 'income', '1101', '1301', 12, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(127, 5, 'Retur Penjualan', 'income', '4101', '1101', 13, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(128, 5, 'Diskon / Potongan Penjualan', 'income', '4103', '1101', 14, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(129, 5, 'Pendapatan Lain-lain', 'income', '1101', '4202', 15, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(130, 5, 'Setoran Kas ke Bank', 'asset', '1102', '1101', 16, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(131, 5, 'Penarikan Bank ke Kas', 'asset', '1101', '1102', 17, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(132, 5, 'Pembelian Bibit / Benih', 'expense', '1401', '1101', 20, 1, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(133, 5, 'Pembelian Bibit / Benih Kredit', 'liability', '1401', '2101', 21, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(134, 5, 'Pembelian Pakan Ternak', 'expense', '1401', '1101', 22, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(135, 5, 'Pembelian Pupuk', 'expense', '1401', '1101', 23, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(136, 5, 'Pembelian Obat & Vitamin', 'expense', '1401', '1101', 24, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(137, 5, 'Pembelian Pestisida', 'expense', '1401', '1101', 25, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(138, 5, 'Bayar Utang Supplier', 'expense', '2101', '1101', 26, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(139, 5, 'Beban Gaji Karyawan', 'expense', '5201', '1101', 30, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(140, 5, 'Beban Listrik', 'expense', '5401', '1101', 31, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(141, 5, 'Beban Air / Irigasi', 'expense', '5402', '1101', 32, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(142, 5, 'Beban Sewa Lahan', 'expense', '5301', '1101', 33, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(143, 5, 'Beban Transportasi', 'expense', '5701', '1101', 34, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(144, 5, 'Beban BBM & Pelumas', 'expense', '5701', '1101', 35, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(145, 5, 'Beban Pemeliharaan Kandang', 'expense', '5901', '1101', 36, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(146, 5, 'Beban Pemeliharaan Sawah/Lahan', 'expense', '5901', '1101', 37, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(147, 5, 'Beban Perlengkapan Tani/Ternak', 'expense', '5501', '1101', 38, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(148, 5, 'Beban Promosi / Pemasaran', 'expense', '5901', '1101', 39, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(149, 5, 'Pembelian Ternak Indukan', 'asset', '1804', '1101', 40, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(150, 5, 'Pembelian Ternak Pejantan', 'asset', '1804', '1101', 41, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(151, 5, 'Beli Peralatan Tani/Ternak', 'asset', '1804', '1101', 42, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(152, 5, 'Beli Mesin Pertanian', 'asset', '1804', '1101', 43, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(153, 5, 'Setoran Modal', 'capital', '1101', '3101', 50, 1, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(154, 5, 'Prive (Penarikan Modal)', 'capital', '3301', '1101', 51, 0, 0, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(155, 5, 'Penyesuaian Persediaan Saprotan', 'expense', '5101', '1401', 60, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(156, 5, 'Bibit/Benih Rusak', 'expense', '5901', '1401', 61, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(157, 5, 'Pakan / Pupuk Kadaluarsa', 'expense', '5901', '1401', 62, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(158, 5, 'Ternak Mati / Afkir', 'expense', '5901', '1804', 63, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(159, 5, 'Penyusutan Kandang', 'expense', '5601', '1806', 64, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(160, 5, 'Penyusutan Peralatan', 'expense', '5602', '1805', 65, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(161, 5, 'Penyusutan Mesin Pertanian', 'expense', '5602', '1805', 66, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(162, 5, 'Pemakaian Perlengkapan', 'expense', '5501', '1502', 67, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(163, 5, 'Selisih Kas', 'expense', '5901', '1101', 68, 0, 1, '2026-05-22 13:16:58', '2026-05-22 13:16:58'),
(164, 6, 'Penjualan Marketplace (Shopee/Tokopedia)', 'income', '1102', '4101', 10, 1, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(165, 6, 'Penjualan Website/Sosial Media', 'income', '1101', '4101', 11, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(166, 6, 'Penjualan Dropship/Reseller', 'income', '1101', '4101', 12, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(167, 6, 'Retur Penjualan', 'income', '4101', '1101', 13, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(168, 6, 'Diskon / Potongan Penjualan', 'income', '4103', '1101', 14, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(169, 6, 'Pendapatan Lain-lain', 'income', '1101', '4202', 15, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(170, 6, 'Transfer Kas ke Bank', 'asset', '1102', '1101', 16, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(171, 6, 'Transfer Bank ke Kas', 'asset', '1101', '1102', 17, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(172, 6, 'Topup E-Wallet (OVO/GoPay/Dana)', 'asset', '1103', '1102', 18, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(173, 6, 'Tarik E-Wallet ke Bank', 'asset', '1102', '1103', 19, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(174, 6, 'Pembelian Barang Tunai', 'expense', '1401', '1101', 20, 1, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(175, 6, 'Pembelian Barang Kredit', 'liability', '1401', '2101', 21, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(176, 6, 'Bayar Utang Supplier', 'expense', '2101', '1101', 22, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(177, 6, 'Beban Ongkos Kirim (Ongkir)', 'expense', '5701', '1101', 30, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(178, 6, 'Beban Komisi Marketplace', 'expense', '5901', '1101', 31, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(179, 6, 'Beban Biaya Admin Platform', 'expense', '5901', '1101', 32, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(180, 6, 'Beban Promosi & Iklan Online', 'expense', '5901', '1101', 33, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(181, 6, 'Beban Cashback & Voucher', 'expense', '5901', '1101', 34, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(182, 6, 'Beban Packing & Kemasan', 'expense', '5901', '1101', 35, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(183, 6, 'Beban Gaji Karyawan', 'expense', '5201', '1101', 36, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(184, 6, 'Beban Listrik & Internet', 'expense', '5401', '1101', 37, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(185, 6, 'Beban Sewa Gudang/Rumah', 'expense', '5301', '1101', 38, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(186, 6, 'Beban Langganan Aplikasi', 'expense', '5901', '1101', 39, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(187, 6, 'Beli Peralatan (Laptop, HP, Kamera)', 'asset', '1804', '1101', 40, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(188, 6, 'Beli Kendaraan Operasional', 'asset', '1804', '1101', 41, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(189, 6, 'Setoran Modal', 'capital', '1101', '3101', 50, 1, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(190, 6, 'Prive (Penarikan Modal)', 'capital', '3301', '1101', 51, 0, 0, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(191, 6, 'Penyesuaian Persediaan Barang', 'expense', '5101', '1401', 60, 0, 1, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(192, 6, 'Barang Rusak / Hilang', 'expense', '5901', '1401', 61, 0, 1, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(193, 6, 'Penyusutan Peralatan', 'expense', '5602', '1805', 62, 0, 1, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(194, 6, 'Pemakaian Perlengkapan', 'expense', '5501', '1502', 63, 0, 1, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(195, 6, 'Selisih Kas / E-Wallet', 'expense', '5901', '1101', 64, 0, 1, '2026-05-22 13:18:09', '2026-05-22 13:18:09'),
(196, 7, 'Penjualan Produk Jadi (Tunai)', 'income', '1101', '4101', 10, 1, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(197, 7, 'Penjualan Kredit (Bon Order)', 'income', '1301', '4101', 11, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(198, 7, 'Terima Pembayaran Bon', 'income', '1101', '1301', 12, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(199, 7, 'Penjualan Sablon / Bordir', 'income', '1101', '4101', 13, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(200, 7, 'Retur Penjualan', 'income', '4101', '1101', 14, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(201, 7, 'Diskon / Potongan', 'income', '4103', '1101', 15, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(202, 7, 'Pendapatan Lain-lain', 'income', '1101', '4202', 16, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(203, 7, 'Setoran Kas ke Bank', 'asset', '1102', '1101', 17, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(204, 7, 'Penarikan Bank ke Kas', 'asset', '1101', '1102', 18, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(205, 7, 'Pembelian Kain', 'expense', '1402', '1101', 20, 1, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(206, 7, 'Pembelian Bahan Penolong (Benang, Resleting, Kancing)', 'expense', '1402', '1101', 21, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(207, 7, 'Pembelian Bahan Sablon / Bordir', 'expense', '1402', '1101', 22, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(208, 7, 'Pembelian Kredit', 'liability', '1402', '2101', 23, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(209, 7, 'Bayar Utang Supplier', 'expense', '2101', '1101', 24, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(210, 7, 'Beban Tenaga Kerja Jahit', 'expense', '5201', '1101', 30, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(211, 7, 'Beban Tenaga Kerja Sablon/Bordir', 'expense', '5201', '1101', 31, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(212, 7, 'Beban Listrik Produksi', 'expense', '5401', '1101', 32, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(213, 7, 'Beban Air', 'expense', '5402', '1101', 33, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(214, 7, 'Beban Telepon / Internet', 'expense', '5403', '1101', 34, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(215, 7, 'Beban Sewa Tempat', 'expense', '5301', '1101', 35, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(216, 7, 'Beban Transportasi', 'expense', '5701', '1101', 36, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(217, 7, 'Beban Promosi / Marketing', 'expense', '5901', '1101', 37, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(218, 7, 'Beban Perawatan Mesin Jahit', 'expense', '5901', '1101', 38, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(219, 7, 'Beban Perlengkapan Produksi', 'expense', '5501', '1101', 39, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(220, 7, 'Beli Mesin Jahit', 'asset', '1804', '1101', 40, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(221, 7, 'Beli Mesin Sablon/Bordir', 'asset', '1804', '1101', 41, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(222, 7, 'Beli Peralatan Potong', 'asset', '1804', '1101', 42, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(223, 7, 'Beli Kompor & Setrika (Industri)', 'asset', '1804', '1101', 43, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(224, 7, 'Setoran Modal', 'capital', '1101', '3101', 50, 1, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(225, 7, 'Prive (Penarikan Modal)', 'capital', '3301', '1101', 51, 0, 0, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(226, 7, 'Penyesuaian Persediaan Bahan Baku', 'expense', '5101', '1402', 60, 0, 1, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(227, 7, 'Bahan Baku Rusak', 'expense', '5901', '1402', 61, 0, 1, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(228, 7, 'Barang Jadi Rusak', 'expense', '5901', '1401', 62, 0, 1, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(229, 7, 'Penyusutan Mesin Jahit', 'expense', '5602', '1805', 63, 0, 1, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(230, 7, 'Penyusutan Peralatan', 'expense', '5602', '1805', 64, 0, 1, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(231, 7, 'Pemakaian Perlengkapan', 'expense', '5501', '1502', 65, 0, 1, '2026-05-22 13:19:37', '2026-05-22 13:19:37'),
(232, 7, 'Selisih Kas', 'expense', '5901', '1101', 66, 0, 1, '2026-05-22 13:19:37', '2026-05-22 13:19:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `debit_account_id` int(11) NOT NULL,
  `credit_account_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_default` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `tenant_id`, `name`, `type`, `debit_account_id`, `credit_account_id`, `is_active`, `is_default`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Pendapatan Tunai', 'income', 75, 95, 1, 1, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(2, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(3, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(4, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(5, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(6, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(7, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(8, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(9, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(10, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(11, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(12, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(13, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(14, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(15, 1, 'Beban Gaji', 'expense', 101, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(16, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(17, 1, 'Beban Perlengkapan', 'expense', 106, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(18, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(19, 1, 'Prive', 'capital', 94, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(20, 1, 'Penyesuaian Persediaan (Stock Opname)', 'expense', 100, 80, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(21, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(22, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(23, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(24, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-05-21 17:22:12', '2026-05-21 17:22:12', NULL),
(25, 1, 'Pendapatan Tunai', 'income', 75, 95, 1, 1, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(26, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(27, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(28, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(29, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(30, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(31, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(32, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(33, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(34, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(35, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(36, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(37, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(38, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(39, 1, 'Beban Gaji', 'expense', 101, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(40, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(41, 1, 'Beban Perlengkapan', 'expense', 106, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(42, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(43, 1, 'Prive', 'capital', 94, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(44, 1, 'Penyesuaian Persediaan (Stock Opname)', 'expense', 100, 80, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(45, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(46, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(47, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(48, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-05-21 17:27:46', '2026-05-21 17:27:46', NULL),
(49, 1, 'Pendapatan Jasa Tunai', 'income', 75, 98, 1, 1, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(50, 1, 'Pendapatan Jasa Kredit (Bon)', 'income', 79, 98, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(51, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(52, 1, 'Retur / Pembatalan Jasa', 'income', 98, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(53, 1, 'Diskon / Potongan Jasa', 'income', 97, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(54, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(55, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(56, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(57, 1, 'Beli Perlengkapan Tunai', 'expense', 84, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(58, 1, 'Beli Perlengkapan Kredit', 'liability', 84, 89, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(59, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(60, 1, 'Beban Gaji', 'expense', 101, 75, 1, 1, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(61, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(62, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(63, 1, 'Beban Telepon / Wifi', 'expense', 105, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(64, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(65, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(66, 1, 'Beban Promosi / Iklan', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(67, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(68, 1, 'Beban Perlengkapan Kantor', 'expense', 106, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(69, 1, 'Beban Pelatihan & Sertifikasi', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(70, 1, 'Beli Peralatan', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(71, 1, 'Beli Kendaraan Operasional', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(72, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(73, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-05-22 13:11:35', '2026-05-22 13:11:35', NULL),
(74, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-05-22 13:11:36', '2026-05-22 13:11:36', NULL),
(75, 1, 'Penyusutan Kendaraan', 'expense', 108, 87, 1, 0, 0, '2026-05-22 13:11:36', '2026-05-22 13:11:36', NULL),
(76, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-05-22 13:11:36', '2026-05-22 13:11:36', NULL),
(77, 1, 'Penyesuaian Piutang Tak Tertagih', 'expense', 110, 79, 1, 0, 0, '2026-05-22 13:11:36', '2026-05-22 13:11:36', NULL),
(78, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:11:36', '2026-05-22 13:11:36', NULL),
(79, 1, 'Pendapatan Penjualan Tunai', 'income', 75, 95, 1, 1, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(80, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(81, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(82, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(83, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(84, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(85, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(86, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(87, 1, 'Pembelian Bahan Baku Tunai', 'expense', 80, 75, 1, 1, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(88, 1, 'Pembelian Bahan Baku Kredit', 'liability', 80, 89, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(89, 1, 'Pembelian Minuman & Snack', 'expense', 80, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(90, 1, 'Pembelian Bumbu & Rempah', 'expense', 80, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(91, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(92, 1, 'Beban Gaji Karyawan', 'expense', 101, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(93, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(94, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(95, 1, 'Beban Telepon / Wifi', 'expense', 105, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(96, 1, 'Beban Sewa Tempat', 'expense', 102, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(97, 1, 'Beban Gas & Bahan Bakar', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(98, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(99, 1, 'Beban Promosi / Iklan', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(100, 1, 'Beban Kebersihan & Sanitasi', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(101, 1, 'Beban Peralatan Makan', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(102, 1, 'Beban Perlengkapan Dapur', 'expense', 106, 75, 1, 0, 0, '2026-05-22 13:19:45', '2026-05-22 13:19:45', NULL),
(103, 1, 'Beli Peralatan Dapur', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(104, 1, 'Beli Peralatan Makan', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(105, 1, 'Beli Kursi & Meja', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(106, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(107, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(108, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 80, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(109, 1, 'Bahan Baku Rusak / Kadaluarsa', 'expense', 110, 80, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(110, 1, 'Penyusutan Peralatan Dapur', 'expense', 108, 87, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(111, 1, 'Penyusutan Peralatan Makan', 'expense', 108, 87, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(112, 1, 'Pemakaian Perlengkapan Dapur', 'expense', 106, 85, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(113, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:19:46', '2026-05-22 13:19:46', NULL),
(114, 1, 'Penjualan Produk Jadi (Tunai)', 'income', 75, 95, 1, 1, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(115, 1, 'Penjualan Kredit (Bon Order)', 'income', 79, 95, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(116, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(117, 1, 'Penjualan Sablon / Bordir', 'income', 75, 95, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(118, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(119, 1, 'Diskon / Potongan', 'income', 97, 75, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(120, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(121, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(122, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(123, 1, 'Pembelian Kain', 'expense', 81, 75, 1, 1, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(124, 1, 'Pembelian Bahan Penolong (Benang, Resleting, Kancing)', 'expense', 81, 75, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(125, 1, 'Pembelian Bahan Sablon / Bordir', 'expense', 81, 75, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(126, 1, 'Pembelian Kredit', 'liability', 81, 89, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(127, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-05-22 13:20:13', '2026-05-22 13:20:13', NULL),
(128, 1, 'Beban Tenaga Kerja Jahit', 'expense', 101, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(129, 1, 'Beban Tenaga Kerja Sablon/Bordir', 'expense', 101, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(130, 1, 'Beban Listrik Produksi', 'expense', 103, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(131, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(132, 1, 'Beban Telepon / Internet', 'expense', 105, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(133, 1, 'Beban Sewa Tempat', 'expense', 102, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(134, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(135, 1, 'Beban Promosi / Marketing', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(136, 1, 'Beban Perawatan Mesin Jahit', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(137, 1, 'Beban Perlengkapan Produksi', 'expense', 106, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(138, 1, 'Beli Mesin Jahit', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(139, 1, 'Beli Mesin Sablon/Bordir', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(140, 1, 'Beli Peralatan Potong', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(141, 1, 'Beli Kompor & Setrika (Industri)', 'asset', 86, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(142, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(143, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(144, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 81, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(145, 1, 'Bahan Baku Rusak', 'expense', 110, 81, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(146, 1, 'Barang Jadi Rusak', 'expense', 110, 80, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(147, 1, 'Penyusutan Mesin Jahit', 'expense', 108, 87, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(148, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(149, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(150, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-05-22 13:20:14', '2026-05-22 13:20:14', NULL),
(151, 1, 'Pendapatan Tunai', 'income', 75, 95, 1, 1, 0, '2026-05-22 14:53:29', '2026-05-22 14:53:29', NULL),
(152, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(153, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(154, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(155, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(156, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(157, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(158, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(159, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(160, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(161, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(162, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(163, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(164, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(165, 1, 'Beban Gaji', 'expense', 101, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(166, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(167, 1, 'Beban Perlengkapan', 'expense', 106, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(168, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(169, 1, 'Prive', 'capital', 94, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(170, 1, 'Penyesuaian Persediaan (Stock Opname)', 'expense', 100, 80, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(171, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(172, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(173, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(174, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-05-22 14:53:30', '2026-05-22 14:53:30', NULL),
(175, 1, 'Penjualan Produk Jadi (Tunai)', 'income', 75, 95, 1, 1, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(176, 1, 'Penjualan Kredit (Bon Order)', 'income', 79, 95, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(177, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(178, 1, 'Penjualan Sablon / Bordir', 'income', 75, 95, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(179, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(180, 1, 'Diskon / Potongan', 'income', 97, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(181, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(182, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(183, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(184, 1, 'Pembelian Kain', 'expense', 81, 75, 1, 1, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(185, 1, 'Pembelian Bahan Penolong (Benang, Resleting, Kancing)', 'expense', 81, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(186, 1, 'Pembelian Bahan Sablon / Bordir', 'expense', 81, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(187, 1, 'Pembelian Kredit', 'liability', 81, 89, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(188, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(189, 1, 'Beban Tenaga Kerja Jahit', 'expense', 101, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(190, 1, 'Beban Tenaga Kerja Sablon/Bordir', 'expense', 101, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(191, 1, 'Beban Listrik Produksi', 'expense', 103, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(192, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(193, 1, 'Beban Telepon / Internet', 'expense', 105, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(194, 1, 'Beban Sewa Tempat', 'expense', 102, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(195, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(196, 1, 'Beban Promosi / Marketing', 'expense', 110, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(197, 1, 'Beban Perawatan Mesin Jahit', 'expense', 110, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(198, 1, 'Beban Perlengkapan Produksi', 'expense', 106, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(199, 1, 'Beli Mesin Jahit', 'asset', 86, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(200, 1, 'Beli Mesin Sablon/Bordir', 'asset', 86, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(201, 1, 'Beli Peralatan Potong', 'asset', 86, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(202, 1, 'Beli Kompor & Setrika (Industri)', 'asset', 86, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(203, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(204, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(205, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 81, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(206, 1, 'Bahan Baku Rusak', 'expense', 110, 81, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(207, 1, 'Barang Jadi Rusak', 'expense', 110, 80, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(208, 1, 'Penyusutan Mesin Jahit', 'expense', 108, 87, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(209, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(210, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(211, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-05 13:54:04', '2026-06-05 13:54:04', NULL),
(212, 1, 'Pendapatan Tunai', 'income', 75, 95, 1, 1, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(213, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(214, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(215, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(216, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(217, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(218, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(219, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(220, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(221, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(222, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(223, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(224, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(225, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(226, 1, 'Beban Gaji', 'expense', 101, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(227, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(228, 1, 'Beban Perlengkapan', 'expense', 106, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(229, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(230, 1, 'Prive', 'capital', 94, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(231, 1, 'Penyesuaian Persediaan (Stock Opname)', 'expense', 100, 80, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(232, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(233, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(234, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(235, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-05 13:54:22', '2026-06-05 13:54:22', NULL),
(236, 1, 'Pendapatan Jasa Tunai', 'income', 75, 98, 1, 1, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(237, 1, 'Pendapatan Jasa Kredit (Bon)', 'income', 79, 98, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(238, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(239, 1, 'Retur / Pembatalan Jasa', 'income', 98, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(240, 1, 'Diskon / Potongan Jasa', 'income', 97, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(241, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(242, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(243, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(244, 1, 'Beli Perlengkapan Tunai', 'expense', 84, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(245, 1, 'Beli Perlengkapan Kredit', 'liability', 84, 89, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(246, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(247, 1, 'Beban Gaji', 'expense', 101, 75, 1, 1, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(248, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(249, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(250, 1, 'Beban Telepon / Wifi', 'expense', 105, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(251, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(252, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(253, 1, 'Beban Promosi / Iklan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(254, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(255, 1, 'Beban Perlengkapan Kantor', 'expense', 106, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(256, 1, 'Beban Pelatihan & Sertifikasi', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(257, 1, 'Beli Peralatan', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(258, 1, 'Beli Kendaraan Operasional', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(259, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 06:35:09', '2026-06-06 06:35:09', NULL),
(260, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 06:35:10', '2026-06-06 06:35:10', NULL),
(261, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:35:10', '2026-06-06 06:35:10', NULL),
(262, 1, 'Penyusutan Kendaraan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:35:10', '2026-06-06 06:35:10', NULL),
(263, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 06:35:10', '2026-06-06 06:35:10', NULL),
(264, 1, 'Penyesuaian Piutang Tak Tertagih', 'expense', 110, 79, 1, 0, 0, '2026-06-06 06:35:10', '2026-06-06 06:35:10', NULL),
(265, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:35:10', '2026-06-06 06:35:10', NULL),
(266, 1, 'Pendapatan Tunai', 'income', 75, 95, 1, 1, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(267, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(268, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(269, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(270, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(271, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(272, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(273, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(274, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(275, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(276, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(277, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(278, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(279, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(280, 1, 'Beban Gaji', 'expense', 101, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(281, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(282, 1, 'Beban Perlengkapan', 'expense', 106, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(283, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(284, 1, 'Prive', 'capital', 94, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(285, 1, 'Penyesuaian Persediaan (Stock Opname)', 'expense', 100, 80, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(286, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(287, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(288, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(289, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:35:25', '2026-06-06 06:35:25', NULL),
(290, 1, 'Pendapatan Jasa Tunai', 'income', 75, 98, 1, 1, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(291, 1, 'Pendapatan Jasa Kredit (Bon)', 'income', 79, 98, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(292, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(293, 1, 'Retur / Pembatalan Jasa', 'income', 98, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(294, 1, 'Diskon / Potongan Jasa', 'income', 97, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(295, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(296, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(297, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(298, 1, 'Beli Perlengkapan Tunai', 'expense', 84, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(299, 1, 'Beli Perlengkapan Kredit', 'liability', 84, 89, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(300, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(301, 1, 'Beban Gaji', 'expense', 101, 75, 1, 1, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(302, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(303, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(304, 1, 'Beban Telepon / Wifi', 'expense', 105, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(305, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(306, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(307, 1, 'Beban Promosi / Iklan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(308, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(309, 1, 'Beban Perlengkapan Kantor', 'expense', 106, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(310, 1, 'Beban Pelatihan & Sertifikasi', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(311, 1, 'Beli Peralatan', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(312, 1, 'Beli Kendaraan Operasional', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(313, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(314, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(315, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(316, 1, 'Penyusutan Kendaraan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(317, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(318, 1, 'Penyesuaian Piutang Tak Tertagih', 'expense', 110, 79, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(319, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:57:55', '2026-06-06 06:57:55', NULL),
(320, 1, 'Pendapatan Penjualan Tunai', 'income', 75, 95, 1, 1, 0, '2026-06-06 06:58:16', '2026-06-06 06:58:16', NULL),
(321, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(322, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(323, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(324, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(325, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(326, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(327, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(328, 1, 'Pembelian Bahan Baku Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(329, 1, 'Pembelian Bahan Baku Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(330, 1, 'Pembelian Minuman & Snack', 'expense', 80, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(331, 1, 'Pembelian Bumbu & Rempah', 'expense', 80, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(332, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(333, 1, 'Beban Gaji Karyawan', 'expense', 101, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(334, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(335, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(336, 1, 'Beban Telepon / Wifi', 'expense', 105, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(337, 1, 'Beban Sewa Tempat', 'expense', 102, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(338, 1, 'Beban Gas & Bahan Bakar', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(339, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(340, 1, 'Beban Promosi / Iklan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(341, 1, 'Beban Kebersihan & Sanitasi', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(342, 1, 'Beban Peralatan Makan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(343, 1, 'Beban Perlengkapan Dapur', 'expense', 106, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(344, 1, 'Beli Peralatan Dapur', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(345, 1, 'Beli Peralatan Makan', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(346, 1, 'Beli Kursi & Meja', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(347, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(348, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(349, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 80, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(350, 1, 'Bahan Baku Rusak / Kadaluarsa', 'expense', 110, 80, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(351, 1, 'Penyusutan Peralatan Dapur', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(352, 1, 'Penyusutan Peralatan Makan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(353, 1, 'Pemakaian Perlengkapan Dapur', 'expense', 106, 85, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(354, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:17', '2026-06-06 06:58:17', NULL),
(355, 1, 'Pendapatan Penjualan Tunai', 'income', 75, 95, 1, 1, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(356, 1, 'Penjualan Kredit', 'income', 79, 95, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(357, 1, 'Terima Pembayaran Piutang', 'income', 75, 79, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(358, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(359, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(360, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(361, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(362, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(363, 1, 'Pembelian Bahan Baku Tunai', 'expense', 81, 75, 1, 1, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(364, 1, 'Pembelian Bahan Baku Kredit', 'liability', 81, 89, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(365, 1, 'Pembelian Bahan Penolong', 'expense', 81, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(366, 1, 'Pembelian Kemasan', 'expense', 81, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(367, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(368, 1, 'Beban Tenaga Kerja Langsung', 'expense', 101, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(369, 1, 'Beban Listrik Produksi', 'expense', 103, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(370, 1, 'Beban Air Produksi', 'expense', 104, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(371, 1, 'Beban Telepon / Internet', 'expense', 105, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(372, 1, 'Beban Sewa Tempat Produksi', 'expense', 102, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(373, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(374, 1, 'Beban Promosi / Iklan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(375, 1, 'Beban Perlengkapan Produksi', 'expense', 106, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(376, 1, 'Beban Perawatan Mesin', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(377, 1, 'Beban Kebersihan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(378, 1, 'Beli Mesin Produksi', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(379, 1, 'Beli Peralatan Produksi', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(380, 1, 'Beli Kendaraan Operasional', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(381, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(382, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(383, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 81, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(384, 1, 'Bahan Baku Rusak', 'expense', 110, 81, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(385, 1, 'Penyusutan Mesin Produksi', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(386, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(387, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(388, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:32', '2026-06-06 06:58:32', NULL),
(389, 1, 'Pendapatan Penjualan Hasil Panen', 'income', 75, 95, 1, 1, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(390, 1, 'Penjualan Kredit', 'income', 79, 95, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(391, 1, 'Terima Pembayaran Piutang', 'income', 75, 79, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(392, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(393, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(394, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(395, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(396, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(397, 1, 'Pembelian Bibit / Benih', 'expense', 80, 75, 1, 1, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(398, 1, 'Pembelian Bibit / Benih Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(399, 1, 'Pembelian Pakan Ternak', 'expense', 80, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(400, 1, 'Pembelian Pupuk', 'expense', 80, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(401, 1, 'Pembelian Obat & Vitamin', 'expense', 80, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(402, 1, 'Pembelian Pestisida', 'expense', 80, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(403, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(404, 1, 'Beban Gaji Karyawan', 'expense', 101, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(405, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(406, 1, 'Beban Air / Irigasi', 'expense', 104, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(407, 1, 'Beban Sewa Lahan', 'expense', 102, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(408, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(409, 1, 'Beban BBM & Pelumas', 'expense', 109, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(410, 1, 'Beban Pemeliharaan Kandang', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(411, 1, 'Beban Pemeliharaan Sawah/Lahan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(412, 1, 'Beban Perlengkapan Tani/Ternak', 'expense', 106, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(413, 1, 'Beban Promosi / Pemasaran', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(414, 1, 'Pembelian Ternak Indukan', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(415, 1, 'Pembelian Ternak Pejantan', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(416, 1, 'Beli Peralatan Tani/Ternak', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(417, 1, 'Beli Mesin Pertanian', 'asset', 86, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(418, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(419, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(420, 1, 'Penyesuaian Persediaan Saprotan', 'expense', 100, 80, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(421, 1, 'Bibit/Benih Rusak', 'expense', 110, 80, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(422, 1, 'Pakan / Pupuk Kadaluarsa', 'expense', 110, 80, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(423, 1, 'Ternak Mati / Afkir', 'expense', 110, 86, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(424, 1, 'Penyusutan Kandang', 'expense', 107, 88, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(425, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(426, 1, 'Penyusutan Mesin Pertanian', 'expense', 108, 87, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(427, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(428, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 06:58:49', '2026-06-06 06:58:49', NULL),
(429, 1, 'Penjualan Marketplace (Shopee/Tokopedia)', 'income', 76, 95, 1, 1, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(430, 1, 'Penjualan Website/Sosial Media', 'income', 75, 95, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(431, 1, 'Penjualan Dropship/Reseller', 'income', 75, 95, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(432, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(433, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(434, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(435, 1, 'Transfer Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(436, 1, 'Transfer Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(437, 1, 'Topup E-Wallet (OVO/GoPay/Dana)', 'asset', 77, 76, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(438, 1, 'Tarik E-Wallet ke Bank', 'asset', 76, 77, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(439, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(440, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(441, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(442, 1, 'Beban Ongkos Kirim (Ongkir)', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL);
INSERT INTO `categories` (`id`, `tenant_id`, `name`, `type`, `debit_account_id`, `credit_account_id`, `is_active`, `is_default`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(443, 1, 'Beban Komisi Marketplace', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(444, 1, 'Beban Biaya Admin Platform', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(445, 1, 'Beban Promosi & Iklan Online', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(446, 1, 'Beban Cashback & Voucher', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(447, 1, 'Beban Packing & Kemasan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(448, 1, 'Beban Gaji Karyawan', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:00:31', '2026-06-06 07:00:31', NULL),
(449, 1, 'Beban Listrik & Internet', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(450, 1, 'Beban Sewa Gudang/Rumah', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(451, 1, 'Beban Langganan Aplikasi', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(452, 1, 'Beli Peralatan (Laptop, HP, Kamera)', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(453, 1, 'Beli Kendaraan Operasional', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(454, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(455, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(456, 1, 'Penyesuaian Persediaan Barang', 'expense', 100, 80, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(457, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(458, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(459, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(460, 1, 'Selisih Kas / E-Wallet', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:32', '2026-06-06 07:00:32', NULL),
(461, 1, 'Penjualan Produk Jadi (Tunai)', 'income', 75, 95, 1, 1, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(462, 1, 'Penjualan Kredit (Bon Order)', 'income', 79, 95, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(463, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(464, 1, 'Penjualan Sablon / Bordir', 'income', 75, 95, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(465, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(466, 1, 'Diskon / Potongan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(467, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(468, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(469, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(470, 1, 'Pembelian Kain', 'expense', 81, 75, 1, 1, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(471, 1, 'Pembelian Bahan Penolong (Benang, Resleting, Kancing)', 'expense', 81, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(472, 1, 'Pembelian Bahan Sablon / Bordir', 'expense', 81, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(473, 1, 'Pembelian Kredit', 'liability', 81, 89, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(474, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(475, 1, 'Beban Tenaga Kerja Jahit', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(476, 1, 'Beban Tenaga Kerja Sablon/Bordir', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(477, 1, 'Beban Listrik Produksi', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(478, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(479, 1, 'Beban Telepon / Internet', 'expense', 105, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(480, 1, 'Beban Sewa Tempat', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(481, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(482, 1, 'Beban Promosi / Marketing', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(483, 1, 'Beban Perawatan Mesin Jahit', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(484, 1, 'Beban Perlengkapan Produksi', 'expense', 106, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(485, 1, 'Beli Mesin Jahit', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(486, 1, 'Beli Mesin Sablon/Bordir', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(487, 1, 'Beli Peralatan Potong', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(488, 1, 'Beli Kompor & Setrika (Industri)', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(489, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(490, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(491, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 81, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(492, 1, 'Bahan Baku Rusak', 'expense', 110, 81, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(493, 1, 'Barang Jadi Rusak', 'expense', 110, 80, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(494, 1, 'Penyusutan Mesin Jahit', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(495, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(496, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(497, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:00:42', '2026-06-06 07:00:42', NULL),
(498, 1, 'Penjualan Marketplace (Shopee/Tokopedia)', 'income', 76, 95, 1, 1, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(499, 1, 'Penjualan Website/Sosial Media', 'income', 75, 95, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(500, 1, 'Penjualan Dropship/Reseller', 'income', 75, 95, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(501, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(502, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(503, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(504, 1, 'Transfer Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(505, 1, 'Transfer Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(506, 1, 'Topup E-Wallet (OVO/GoPay/Dana)', 'asset', 77, 76, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(507, 1, 'Tarik E-Wallet ke Bank', 'asset', 76, 77, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(508, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(509, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(510, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(511, 1, 'Beban Ongkos Kirim (Ongkir)', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(512, 1, 'Beban Komisi Marketplace', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(513, 1, 'Beban Biaya Admin Platform', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(514, 1, 'Beban Promosi & Iklan Online', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(515, 1, 'Beban Cashback & Voucher', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(516, 1, 'Beban Packing & Kemasan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(517, 1, 'Beban Gaji Karyawan', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(518, 1, 'Beban Listrik & Internet', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(519, 1, 'Beban Sewa Gudang/Rumah', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(520, 1, 'Beban Langganan Aplikasi', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(521, 1, 'Beli Peralatan (Laptop, HP, Kamera)', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(522, 1, 'Beli Kendaraan Operasional', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(523, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(524, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(525, 1, 'Penyesuaian Persediaan Barang', 'expense', 100, 80, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(526, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(527, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(528, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(529, 1, 'Selisih Kas / E-Wallet', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:07', '2026-06-06 07:03:07', NULL),
(530, 1, 'Pendapatan Penjualan Tunai', 'income', 75, 95, 1, 1, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(531, 1, 'Penjualan Kredit', 'income', 79, 95, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(532, 1, 'Terima Pembayaran Piutang', 'income', 75, 79, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(533, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(534, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(535, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(536, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(537, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(538, 1, 'Pembelian Bahan Baku Tunai', 'expense', 81, 75, 1, 1, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(539, 1, 'Pembelian Bahan Baku Kredit', 'liability', 81, 89, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(540, 1, 'Pembelian Bahan Penolong', 'expense', 81, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(541, 1, 'Pembelian Kemasan', 'expense', 81, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(542, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(543, 1, 'Beban Tenaga Kerja Langsung', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(544, 1, 'Beban Listrik Produksi', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(545, 1, 'Beban Air Produksi', 'expense', 104, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(546, 1, 'Beban Telepon / Internet', 'expense', 105, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(547, 1, 'Beban Sewa Tempat Produksi', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(548, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(549, 1, 'Beban Promosi / Iklan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(550, 1, 'Beban Perlengkapan Produksi', 'expense', 106, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(551, 1, 'Beban Perawatan Mesin', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(552, 1, 'Beban Kebersihan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(553, 1, 'Beli Mesin Produksi', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(554, 1, 'Beli Peralatan Produksi', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(555, 1, 'Beli Kendaraan Operasional', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(556, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(557, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(558, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 81, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(559, 1, 'Bahan Baku Rusak', 'expense', 110, 81, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(560, 1, 'Penyusutan Mesin Produksi', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(561, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(562, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(563, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:35', '2026-06-06 07:03:35', NULL),
(564, 1, 'Pendapatan Tunai', 'income', 75, 95, 1, 1, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(565, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(566, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(567, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(568, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(569, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(570, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(571, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(572, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(573, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(574, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(575, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(576, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(577, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(578, 1, 'Beban Gaji', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(579, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(580, 1, 'Beban Perlengkapan', 'expense', 106, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(581, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(582, 1, 'Prive', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(583, 1, 'Penyesuaian Persediaan (Stock Opname)', 'expense', 100, 80, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(584, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(585, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(586, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(587, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:03:54', '2026-06-06 07:03:54', NULL),
(588, 1, 'Penjualan Marketplace (Shopee/Tokopedia)', 'income', 76, 95, 1, 1, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(589, 1, 'Penjualan Website/Sosial Media', 'income', 75, 95, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(590, 1, 'Penjualan Dropship/Reseller', 'income', 75, 95, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(591, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(592, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(593, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(594, 1, 'Transfer Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(595, 1, 'Transfer Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(596, 1, 'Topup E-Wallet (OVO/GoPay/Dana)', 'asset', 77, 76, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(597, 1, 'Tarik E-Wallet ke Bank', 'asset', 76, 77, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(598, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(599, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(600, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(601, 1, 'Beban Ongkos Kirim (Ongkir)', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(602, 1, 'Beban Komisi Marketplace', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(603, 1, 'Beban Biaya Admin Platform', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(604, 1, 'Beban Promosi & Iklan Online', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(605, 1, 'Beban Cashback & Voucher', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(606, 1, 'Beban Packing & Kemasan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(607, 1, 'Beban Gaji Karyawan', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(608, 1, 'Beban Listrik & Internet', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(609, 1, 'Beban Sewa Gudang/Rumah', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(610, 1, 'Beban Langganan Aplikasi', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(611, 1, 'Beli Peralatan (Laptop, HP, Kamera)', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(612, 1, 'Beli Kendaraan Operasional', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(613, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(614, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(615, 1, 'Penyesuaian Persediaan Barang', 'expense', 100, 80, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(616, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(617, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:04:17', '2026-06-06 07:04:17', NULL),
(618, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:04:18', '2026-06-06 07:04:18', NULL),
(619, 1, 'Selisih Kas / E-Wallet', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:18', '2026-06-06 07:04:18', NULL),
(620, 1, 'Penjualan Produk Jadi (Tunai)', 'income', 75, 95, 1, 1, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(621, 1, 'Penjualan Kredit (Bon Order)', 'income', 79, 95, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(622, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(623, 1, 'Penjualan Sablon / Bordir', 'income', 75, 95, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(624, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(625, 1, 'Diskon / Potongan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(626, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(627, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(628, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(629, 1, 'Pembelian Kain', 'expense', 81, 75, 1, 1, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(630, 1, 'Pembelian Bahan Penolong (Benang, Resleting, Kancing)', 'expense', 81, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(631, 1, 'Pembelian Bahan Sablon / Bordir', 'expense', 81, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(632, 1, 'Pembelian Kredit', 'liability', 81, 89, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(633, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(634, 1, 'Beban Tenaga Kerja Jahit', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(635, 1, 'Beban Tenaga Kerja Sablon/Bordir', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(636, 1, 'Beban Listrik Produksi', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(637, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(638, 1, 'Beban Telepon / Internet', 'expense', 105, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(639, 1, 'Beban Sewa Tempat', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(640, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(641, 1, 'Beban Promosi / Marketing', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(642, 1, 'Beban Perawatan Mesin Jahit', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(643, 1, 'Beban Perlengkapan Produksi', 'expense', 106, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(644, 1, 'Beli Mesin Jahit', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(645, 1, 'Beli Mesin Sablon/Bordir', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(646, 1, 'Beli Peralatan Potong', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(647, 1, 'Beli Kompor & Setrika (Industri)', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(648, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(649, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(650, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 81, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(651, 1, 'Bahan Baku Rusak', 'expense', 110, 81, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(652, 1, 'Barang Jadi Rusak', 'expense', 110, 80, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(653, 1, 'Penyusutan Mesin Jahit', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(654, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(655, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(656, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:29', '2026-06-06 07:04:29', NULL),
(657, 1, 'Pendapatan Penjualan Tunai', 'income', 75, 95, 1, 1, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(658, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(659, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(660, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(661, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(662, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(663, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(664, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(665, 1, 'Pembelian Bahan Baku Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(666, 1, 'Pembelian Bahan Baku Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(667, 1, 'Pembelian Minuman & Snack', 'expense', 80, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(668, 1, 'Pembelian Bumbu & Rempah', 'expense', 80, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(669, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(670, 1, 'Beban Gaji Karyawan', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(671, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(672, 1, 'Beban Air', 'expense', 104, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(673, 1, 'Beban Telepon / Wifi', 'expense', 105, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(674, 1, 'Beban Sewa Tempat', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(675, 1, 'Beban Gas & Bahan Bakar', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(676, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(677, 1, 'Beban Promosi / Iklan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(678, 1, 'Beban Kebersihan & Sanitasi', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(679, 1, 'Beban Peralatan Makan', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(680, 1, 'Beban Perlengkapan Dapur', 'expense', 106, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(681, 1, 'Beli Peralatan Dapur', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(682, 1, 'Beli Peralatan Makan', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(683, 1, 'Beli Kursi & Meja', 'asset', 86, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(684, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(685, 1, 'Prive (Penarikan Modal)', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(686, 1, 'Penyesuaian Persediaan Bahan Baku', 'expense', 100, 80, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(687, 1, 'Bahan Baku Rusak / Kadaluarsa', 'expense', 110, 80, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(688, 1, 'Penyusutan Peralatan Dapur', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(689, 1, 'Penyusutan Peralatan Makan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(690, 1, 'Pemakaian Perlengkapan Dapur', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(691, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:43', '2026-06-06 07:04:43', NULL),
(692, 1, 'Pendapatan Tunai', 'income', 75, 95, 1, 1, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(693, 1, 'Penjualan Kredit (Bon)', 'income', 79, 95, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(694, 1, 'Terima Pembayaran Bon', 'income', 75, 79, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(695, 1, 'Retur Penjualan', 'income', 95, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(696, 1, 'Diskon / Potongan Penjualan', 'income', 97, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(697, 1, 'Pendapatan Lain-lain', 'income', 75, 99, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(698, 1, 'Setoran Kas ke Bank', 'asset', 76, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(699, 1, 'Penarikan Bank ke Kas', 'asset', 75, 76, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(700, 1, 'Pembelian Barang Tunai', 'expense', 80, 75, 1, 1, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(701, 1, 'Pembelian Barang Kredit', 'liability', 80, 89, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(702, 1, 'Bayar Utang Supplier', 'expense', 89, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(703, 1, 'Beban Listrik', 'expense', 103, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(704, 1, 'Beban Sewa', 'expense', 102, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(705, 1, 'Beban Transportasi', 'expense', 109, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(706, 1, 'Beban Gaji', 'expense', 101, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(707, 1, 'Beban Kebersihan & Operasional', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(708, 1, 'Beban Perlengkapan', 'expense', 106, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(709, 1, 'Setoran Modal', 'capital', 75, 93, 1, 1, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(710, 1, 'Prive', 'capital', 94, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(711, 1, 'Penyesuaian Persediaan (Stock Opname)', 'expense', 100, 80, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(712, 1, 'Barang Rusak / Hilang', 'expense', 110, 80, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(713, 1, 'Penyusutan Peralatan', 'expense', 108, 87, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(714, 1, 'Pemakaian Perlengkapan', 'expense', 106, 85, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL),
(715, 1, 'Selisih Kas', 'expense', 110, 75, 1, 0, 0, '2026-06-06 07:04:50', '2026-06-06 07:04:50', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `credit` decimal(15,2) DEFAULT 0.00,
  `memo` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data untuk tabel `journal_entries`
--

INSERT INTO `journal_entries` (`id`, `tenant_id`, `transaction_id`, `account_id`, `debit`, `credit`, `memo`, `created_at`) VALUES
(63, 1, 30, 75, 10000000.00, 0.00, NULL, '2026-06-06 07:38:16'),
(64, 1, 30, 93, 0.00, 10000000.00, NULL, '2026-06-06 07:38:16'),
(65, 1, 31, 75, 100000.00, 0.00, NULL, '2026-06-06 07:41:37'),
(66, 1, 31, 95, 0.00, 100000.00, NULL, '2026-06-06 07:41:37'),
(67, 1, 32, 103, 50000.00, 0.00, NULL, '2026-06-06 07:43:32'),
(68, 1, 32, 75, 0.00, 50000.00, NULL, '2026-06-06 07:43:32'),
(69, 1, 33, 75, 400000.00, 0.00, NULL, '2026-06-06 07:43:57'),
(70, 1, 33, 95, 0.00, 400000.00, NULL, '2026-06-06 07:43:57'),
(71, 1, 34, 80, 250000.00, 0.00, NULL, '2026-06-06 07:51:55'),
(72, 1, 34, 89, 0.00, 250000.00, NULL, '2026-06-06 07:51:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `opening_balances`
--

CREATE TABLE `opening_balances` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `business_type_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `as_of_date` date NOT NULL,
  `side` enum('debit','credit') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `opening_balances`
--

INSERT INTO `opening_balances` (`id`, `tenant_id`, `business_type_id`, `account_id`, `as_of_date`, `side`, `amount`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(13, 1, 1, 75, '2026-06-01', 'debit', 10000000.00, 'Saldo Awal Kas', 1, '2026-06-06 07:38:16', '2026-06-06 07:38:16');

-- --------------------------------------------------------

--
-- Struktur dari tabel `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `parameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`parameters`)),
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `file_url` varchar(255) DEFAULT NULL,
  `generated_by` int(11) DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(128) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tenant_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` text NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tenants`
--

CREATE TABLE `tenants` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `business_age` varchar(50) DEFAULT NULL,
  `business_type_id` int(11) DEFAULT NULL,
  `subdomain` varchar(100) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tenants`
--

INSERT INTO `tenants` (`id`, `name`, `business_age`, `business_type_id`, `subdomain`, `logo_url`, `settings`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Tenant Testing / Demo', NULL, 1, NULL, NULL, NULL, 'active', '2026-05-21 06:48:42', '2026-06-06 07:04:50', NULL),
(3, 'warung justiadi', '3', 1, NULL, NULL, NULL, 'active', '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `business_type_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `transaction_number` varchar(50) DEFAULT NULL,
  `type` enum('opening_balance','regular','adjustment','income','expense') NOT NULL DEFAULT 'regular',
  `amount` decimal(15,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `reference_no` varchar(100) DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `status` enum('draft','posted','voided') DEFAULT 'posted',
  `created_by` int(11) DEFAULT NULL,
  `posted_by` int(11) DEFAULT NULL,
  `posted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `tenant_id`, `business_type_id`, `category_id`, `transaction_number`, `type`, `amount`, `payment_method`, `description`, `transaction_date`, `reference_no`, `attachment_url`, `status`, `created_by`, `posted_by`, `posted_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(30, 1, 1, NULL, NULL, 'opening_balance', 10000000.00, NULL, 'Saldo Awal Kas', '2026-06-01', NULL, NULL, 'posted', NULL, NULL, NULL, '2026-06-06 07:38:16', '2026-06-06 07:38:16', NULL),
(31, 1, 1, 1, NULL, 'income', 100000.00, NULL, 'Penjualan 5Kg Beras', '2026-06-02', NULL, NULL, 'posted', NULL, NULL, NULL, '2026-06-06 07:41:36', '2026-06-06 07:41:36', NULL),
(32, 1, 1, 12, NULL, 'expense', 50000.00, NULL, 'Bayar Token Listrik', '2026-06-02', NULL, NULL, 'posted', NULL, NULL, NULL, '2026-06-06 07:43:32', '2026-06-06 07:43:32', NULL),
(33, 1, 1, 1, NULL, 'income', 400000.00, NULL, NULL, '2026-06-03', NULL, NULL, 'posted', NULL, NULL, NULL, '2026-06-06 07:43:57', '2026-06-06 07:43:57', NULL),
(34, 1, 1, 10, NULL, '', 250000.00, NULL, 'Restock permen (kredit)', '2026-06-04', NULL, NULL, 'posted', NULL, NULL, NULL, '2026-06-06 07:51:55', '2026-06-06 07:51:55', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','tenant_admin','accountant','viewer') DEFAULT 'accountant',
  `phone` varchar(50) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `tenant_id`, `name`, `email`, `password`, `role`, `phone`, `avatar_url`, `is_active`, `last_login_at`, `email_verified_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Admin Testing', 'admin@testing.com', '$2b$10$w/uRUW5BzElb1auPS72kz.R3mh/HcXQ1VbsXfvB6DwKHVk4o4QRMS', 'tenant_admin', NULL, NULL, 1, NULL, NULL, '2026-05-21 06:49:33', '2026-05-21 17:15:55', NULL),
(3, 3, 'justiadi', 'justiadi234@mail.com', '$2b$10$x/lZWHe1v4SeHYjcjKALsOHoc1z1XIvMpVe1/7dOzT/5yzpio/qQW', '', '08943974', NULL, 1, NULL, NULL, '2026-06-07 10:33:54', '2026-06-07 10:33:54', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_tenant_code` (`tenant_id`,`code`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_parent` (`parent_account_id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_code` (`code`);

--
-- Indeks untuk tabel `business_types`
--
ALTER TABLE `business_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`);

--
-- Indeks untuk tabel `business_type_categories`
--
ALTER TABLE `business_type_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_business_type` (`business_type_id`),
  ADD KEY `idx_category_type` (`category_type`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `debit_account_id` (`debit_account_id`),
  ADD KEY `credit_account_id` (`credit_account_id`),
  ADD KEY `idx_tenant_type` (`tenant_id`,`type`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_default` (`is_default`);

--
-- Indeks untuk tabel `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `idx_tenant_tx` (`tenant_id`,`transaction_id`),
  ADD KEY `idx_account` (`account_id`),
  ADD KEY `idx_tenant_account` (`tenant_id`,`account_id`),
  ADD KEY `idx_journal_entries_balance` (`tenant_id`,`account_id`,`created_at`);

--
-- Indeks untuk tabel `opening_balances`
--
ALTER TABLE `opening_balances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `business_type_id` (`business_type_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_tenant_date` (`tenant_id`,`as_of_date`),
  ADD KEY `idx_account` (`account_id`),
  ADD KEY `idx_tenant_account` (`tenant_id`,`account_id`),
  ADD KEY `idx_opening_balances_tenant_account` (`tenant_id`,`account_id`,`as_of_date`);

--
-- Indeks untuk tabel `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `generated_by` (`generated_by`),
  ADD KEY `idx_tenant_type` (`tenant_id`,`type`),
  ADD KEY `idx_generated` (`generated_at`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `idx_last_activity` (`last_activity`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indeks untuk tabel `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subdomain` (`subdomain`),
  ADD KEY `idx_business_type` (`business_type_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_subdomain` (`subdomain`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `posted_by` (`posted_by`),
  ADD KEY `idx_tenant_date` (`tenant_id`,`transaction_date`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_number` (`transaction_number`),
  ADD KEY `idx_date` (`transaction_date`),
  ADD KEY `idx_transactions_tenant_status` (`tenant_id`,`status`,`transaction_date`),
  ADD KEY `idx_transactions_business_type` (`business_type_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_active` (`is_active`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT untuk tabel `business_types`
--
ALTER TABLE `business_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `business_type_categories`
--
ALTER TABLE `business_type_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=716;

--
-- AUTO_INCREMENT untuk tabel `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `opening_balances`
--
ALTER TABLE `opening_balances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tenants`
--
ALTER TABLE `tenants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_2` FOREIGN KEY (`parent_account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `business_type_categories`
--
ALTER TABLE `business_type_categories`
  ADD CONSTRAINT `business_type_categories_ibfk_1` FOREIGN KEY (`business_type_id`) REFERENCES `business_types` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categories_ibfk_2` FOREIGN KEY (`debit_account_id`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `categories_ibfk_3` FOREIGN KEY (`credit_account_id`) REFERENCES `accounts` (`id`);

--
-- Ketidakleluasaan untuk tabel `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `journal_entries_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `journal_entries_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ketidakleluasaan untuk tabel `opening_balances`
--
ALTER TABLE `opening_balances`
  ADD CONSTRAINT `opening_balances_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `opening_balances_ibfk_2` FOREIGN KEY (`business_type_id`) REFERENCES `business_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `opening_balances_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `opening_balances_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `tenants`
--
ALTER TABLE `tenants`
  ADD CONSTRAINT `tenants_ibfk_1` FOREIGN KEY (`business_type_id`) REFERENCES `business_types` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_5` FOREIGN KEY (`business_type_id`) REFERENCES `business_types` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
