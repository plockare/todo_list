SET foreign_key_checks = 0;

CREATE TABLE IF NOT EXISTS `access_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identifier',
  `user_id` int(11) NOT NULL,
  `access_token` varchar(100) NOT NULL,
  `expiration` timestamp NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  UNIQUE KEY `access_token` (`access_token`),
  CONSTRAINT `access_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User identifier',
  `name` varchar(30) NULL COMMENT 'Name of the user',
  `middle_name` varchar(30) DEFAULT NULL COMMENT 'Middle name of the user',
  `surname` varchar(30) NULL COMMENT 'Surname of the user',
  `name_prefix` varchar(30) DEFAULT NULL COMMENT 'Title before name',
  `name_suffix` varchar(30) DEFAULT NULL COMMENT 'Title after name',
  `email` varchar(50) NOT NULL COMMENT 'Email of the user',
  `password` text NOT NULL COMMENT 'Password of the user',
  `phone_number` varchar(20) DEFAULT NULL COMMENT 'Phone number of the user',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `todo_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  `deleted_at` timestamp NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `todo_item_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET foreign_key_checks = 1;