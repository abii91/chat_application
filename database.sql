-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 12, 2017 at 04:52 AM
-- Server version: 5.7.19-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_cichatsocket`
--

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator'),
(2, 'members', 'General User');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) UNSIGNED NOT NULL,
  `ip_address` varchar(15) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `login_attempts`
--

INSERT INTO `login_attempts` (`id`, `ip_address`, `login`, `time`) VALUES
(1, '192.168.8.100', 'admin', 1505138134),
(2, '192.168.8.100', 'user2@gmail.com', 1505154039),
(3, '192.168.8.100', 'user2@gmail.com', 1505154083);

-- --------------------------------------------------------

--
-- Table structure for table `profile_pic`
--

CREATE TABLE `profile_pic` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `picture_path` varchar(100) NOT NULL,
  `mime` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `profile_pic`
--

INSERT INTO `profile_pic` (`id`, `user_id`, `picture_path`, `mime`) VALUES
(0, 1, '/home/jaystream/projects/cichatsocket/profile_image/81.jpg', 'image/jpeg'),
(0, 2, '/home/jaystream/projects/cichatsocket/profile_image/58.jpg', 'image/jpeg'),
(0, 3, '/home/jaystream/projects/cichatsocket/profile_image/66.jpg', 'image/jpeg'),
(0, 4, '/home/jaystream/projects/cichatsocket/profile_image/77.jpg', 'image/jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `activation_code` varchar(40) DEFAULT NULL,
  `forgotten_password_code` varchar(40) DEFAULT NULL,
  `forgotten_password_time` int(11) UNSIGNED DEFAULT NULL,
  `remember_code` varchar(40) DEFAULT NULL,
  `created_on` int(11) UNSIGNED NOT NULL,
  `last_login` int(11) UNSIGNED DEFAULT NULL,
  `active` tinyint(1) UNSIGNED DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `forgotten_password_time`, `remember_code`, `created_on`, `last_login`, `active`, `first_name`, `last_name`, `company`, `phone`) VALUES
(1, '127.0.0.1', 'administrator', '$2a$07$SeBknntpZror9uyftVopmu61qg0ms8Qv1yV6FG.kQOSM.9QhmTo36', '', 'admin@admin.com', '', NULL, NULL, NULL, 1268889823, 1505149874, 1, 'Admin', 'istrator', 'ADMIN', '0485'),
(2, '192.168.56.1', 'user1@sample.com', '$2y$08$Ps79hl6UyOXNd1BxXYxcZOJZ0BTs4GluhU7JtT1W1eUmVkzMvU/aK', NULL, 'user1@sample.com', NULL, NULL, NULL, NULL, 1504342030, 1505155908, 1, 'User1', 'UserLast', 'Company', '458933'),
(3, '192.168.56.1', 'user2@sample.com', '$2y$08$5ZBPERE1IvnEcyA7JXjCfegSeqruXD5z785VsR1dtjsUu2661fK2W', NULL, 'user2@sample.com', NULL, NULL, NULL, NULL, 1504342109, 1505154098, 1, 'user2', 'user2last', 'Company2', '3465345'),
(4, '192.168.56.1', 'user3@sample.com', '$2y$08$LBrGT2UC/I60gzRC/Cdi3ej9HPcnT6V/aLcDSF3AII.Dy.St4Tjdi', NULL, 'user3@sample.com', NULL, NULL, NULL, NULL, 1504342211, 1505158657, 1, 'user3', 'user3last', 'Company2', '3463400');

-- --------------------------------------------------------

--
-- Table structure for table `users_groups`
--

CREATE TABLE `users_groups` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `group_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_groups`
--

INSERT INTO `users_groups` (`id`, `user_id`, `group_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 2),
(4, 3, 2),
(5, 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `xwb_attachments`
--

CREATE TABLE `xwb_attachments` (
  `id` int(11) NOT NULL,
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
  `image_width` varchar(100) DEFAULT NULL,
  `image_height` varchar(100) DEFAULT NULL,
  `image_type` varchar(10) DEFAULT NULL,
  `image_size_str` varchar(50) DEFAULT NULL,
  `v_mp4` varchar(255) DEFAULT NULL,
  `v_webm` varchar(255) DEFAULT NULL,
  `v_ogg` varchar(255) DEFAULT NULL,
  `a_mpeg` varchar(255) DEFAULT NULL,
  `a_ogg` varchar(255) DEFAULT NULL,
  `a_wav` varchar(255) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_conversation`
--

CREATE TABLE `xwb_conversation` (
  `id` int(11) NOT NULL,
  `conversation_name_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_to` varchar(255) DEFAULT NULL,
  `user_from` int(11) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL,
  `direction` varchar(10) DEFAULT NULL,
  `conversation_type` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_conversation_members`
--

CREATE TABLE `xwb_conversation_members` (
  `id` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `user_from` int(11) DEFAULT NULL,
  `cn_id` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_conversation_name`
--

CREATE TABLE `xwb_conversation_name` (
  `id` int(11) NOT NULL,
  `conversation_name` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `xwb_csconsole`
--

CREATE TABLE `xwb_csconsole` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `xwb_csconsole`
--

INSERT INTO `xwb_csconsole` (`id`, `name`, `value`, `description`, `status`) VALUES
(1, 'cs_key', 'xwb_console', NULL, 1),
(2, 'session_user_id_key', '[user_id]', NULL, 1),
(3, 'users_table', 'users', NULL, 1),
(4, 'users_id', 'id', NULL, 1),
(5, 'display_name', 'username', NULL, 1),
(6, 'users_table_other', '', NULL, 1),
(7, 'user_table_fkey', '', NULL, 1),
(8, 'user_table_fdisplayname', '', NULL, 1),
(9, 'picture_filename', '', NULL, 1),
(10, 'profile_pic_path', '', NULL, 1),
(11, 'picture_table', 'profile_pic', NULL, 1),
(12, 'picture_field', 'picture_path', NULL, 1),
(13, 'picture_table_key', 'user_id', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `xwb_messages`
--

CREATE TABLE `xwb_messages` (
  `id` int(11) NOT NULL,
  `message` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `attachment` varchar(255) DEFAULT NULL,
  `message_type` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_users_groups` (`user_id`,`group_id`),
  ADD KEY `fk_users_groups_users1_idx` (`user_id`),
  ADD KEY `fk_users_groups_groups1_idx` (`group_id`);

--
-- Indexes for table `xwb_attachments`
--
ALTER TABLE `xwb_attachments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `xwb_conversation`
--
ALTER TABLE `xwb_conversation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `xwb_conversation_members`
--
ALTER TABLE `xwb_conversation_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `xwb_conversation_name`
--
ALTER TABLE `xwb_conversation_name`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `xwb_csconsole`
--
ALTER TABLE `xwb_csconsole`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `xwb_messages`
--
ALTER TABLE `xwb_messages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users_groups`
--
ALTER TABLE `users_groups`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `xwb_attachments`
--
ALTER TABLE `xwb_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `xwb_conversation`
--
ALTER TABLE `xwb_conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `xwb_conversation_members`
--
ALTER TABLE `xwb_conversation_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `xwb_conversation_name`
--
ALTER TABLE `xwb_conversation_name`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `xwb_csconsole`
--
ALTER TABLE `xwb_csconsole`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `xwb_messages`
--
ALTER TABLE `xwb_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD CONSTRAINT `fk_users_groups_groups1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_groups_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
