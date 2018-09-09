-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 25, 2017 at 09:53 AM
-- Server version: 5.7.19-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_cichat`
--

-- --------------------------------------------------------

--
-- Table structure for table `xwb_attachments`
--

CREATE TABLE IF NOT EXISTS `xwb_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `file_name` varchar(250) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `full_path` varchar(255) DEFAULT NULL,
  `raw_name` varchar(200) DEFAULT NULL,
  `orig_name` varchar(200) DEFAULT NULL,
  `client_name` varchar(200) DEFAULT NULL,
  `file_ext` varchar(10) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `is_image` tinyint(1) DEFAULT '0',
  `image_width` VARCHAR(100) NULL DEFAULT NULL,
  `image_height` VARCHAR(100) NULL DEFAULT NULL,
  `image_type` varchar(10) DEFAULT NULL,
  `image_size_str` varchar(50) DEFAULT NULL,
  `v_mp4` varchar(255) DEFAULT NULL,
  `v_webm` varchar(255) DEFAULT NULL,
  `v_ogg` varchar(255) DEFAULT NULL,
  `a_mpeg` varchar(255) DEFAULT NULL,
  `a_ogg` varchar(255) DEFAULT NULL,
  `a_wav` varchar(255) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_conversation`
--

CREATE TABLE IF NOT EXISTS `xwb_conversation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_name_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_to` varchar(255) DEFAULT NULL,
  `user_from` int(11) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL,
  `direction` varchar(10) DEFAULT NULL,
  `conversation_type` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_conversation_members`
--

CREATE TABLE IF NOT EXISTS `xwb_conversation_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) DEFAULT NULL,
  `user_from` int(11) DEFAULT NULL,
  `cn_id` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_conversation_name`
--

CREATE TABLE IF NOT EXISTS `xwb_conversation_name` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_name` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_csconsole`
--

CREATE TABLE IF NOT EXISTS `xwb_csconsole` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_messages`
--

CREATE TABLE IF NOT EXISTS `xwb_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `attachment` varchar(255) DEFAULT NULL,
  `message_type` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
