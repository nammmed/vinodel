-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Дек 03 2024 г., 13:07
-- Версия сервера: 5.7.35-38
-- Версия PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- База данных: `cq62098_vinodel`
--

-- --------------------------------------------------------

--
-- Структура таблицы `batches`
--

CREATE TABLE IF NOT EXISTS `batches` (
                                         `id` int(11) NOT NULL AUTO_INCREMENT,
                                         `user_id` int(11) NOT NULL,
                                         `name` varchar(255) NOT NULL,
                                         `is_blend` tinyint(1) DEFAULT '0',
                                         `initial_volume` decimal(10,2) NOT NULL,
                                         `current_volume` decimal(10,2) NOT NULL,
                                         `status` varchar(50) DEFAULT NULL,
                                         `notes` text,
                                         `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                                         `recipe_id` int(11) DEFAULT NULL,
                                         PRIMARY KEY (`id`),
                                         KEY `user_id` (`user_id`),
                                         KEY `batches_ibfk_2` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `batch_components`
--

CREATE TABLE IF NOT EXISTS `batch_components` (
                                                  `id` int(11) NOT NULL AUTO_INCREMENT,
                                                  `batch_id` int(11) NOT NULL,
                                                  `component_type` enum('grape','batch') NOT NULL,
                                                  `operation_type` enum('blend','split','transfer') DEFAULT NULL,
                                                  `component_id` int(11) NOT NULL,
                                                  `percentage` decimal(5,2) NOT NULL,
                                                  `volume` decimal(10,2) DEFAULT NULL,
                                                  `notes` text,
                                                  PRIMARY KEY (`id`),
                                                  KEY `idx_batch_components_batch_id` (`batch_id`),
                                                  KEY `idx_batch_components_component` (`component_type`,`component_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `grapes`
--

CREATE TABLE IF NOT EXISTS `grapes` (
                                        `id` int(11) NOT NULL AUTO_INCREMENT,
                                        `user_id` int(11) NOT NULL,
                                        `sort` varchar(255) NOT NULL,
                                        `date_purchased` date NOT NULL,
                                        `quantity` decimal(10,2) NOT NULL,
                                        `cost` decimal(10,2) DEFAULT NULL,
                                        `supplier` varchar(255) DEFAULT NULL,
                                        `notes` text,
                                        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                                        PRIMARY KEY (`id`),
                                        KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `measurements`
--

CREATE TABLE IF NOT EXISTS `measurements` (
                                              `id` int(11) NOT NULL AUTO_INCREMENT,
                                              `process_log_id` int(11) NOT NULL,
                                              `date` datetime NOT NULL,
                                              `type` varchar(255) NOT NULL,
                                              `value` decimal(10,2) NOT NULL,
                                              `unit` varchar(50) DEFAULT NULL,
                                              `notes` text,
                                              PRIMARY KEY (`id`),
                                              KEY `process_log_id` (`process_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `processes`
--

CREATE TABLE IF NOT EXISTS `processes` (
                                           `id` int(11) NOT NULL AUTO_INCREMENT,
                                           `name` varchar(255) NOT NULL,
                                           `description` text,
                                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `process_logs`
--

CREATE TABLE IF NOT EXISTS `process_logs` (
                                              `id` int(11) NOT NULL AUTO_INCREMENT,
                                              `batch_id` int(11) NOT NULL,
                                              `process_id` int(11) NOT NULL,
                                              `start_date` date NOT NULL,
                                              `end_date` date DEFAULT NULL,
                                              `notes` text,
                                              PRIMARY KEY (`id`),
                                              KEY `batch_id` (`batch_id`),
                                              KEY `process_id` (`process_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `recipes`
--

CREATE TABLE IF NOT EXISTS `recipes` (
                                         `id` int(11) NOT NULL AUTO_INCREMENT,
                                         `user_id` int(11) NOT NULL,
                                         `name` varchar(255) NOT NULL,
                                         `description` text,
                                         `is_blend` tinyint(1) DEFAULT '0',
                                         `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                                         PRIMARY KEY (`id`),
                                         KEY `recipes_ibfk_1` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `recipe_ingredients`
--

CREATE TABLE IF NOT EXISTS `recipe_ingredients` (
                                                    `id` int(11) NOT NULL AUTO_INCREMENT,
                                                    `recipe_id` int(11) NOT NULL,
                                                    `component_type` enum('batch','grape') NOT NULL,
                                                    `component_id` int(11) NOT NULL,
                                                    `percentage` decimal(5,2) DEFAULT NULL,
                                                    `volume` decimal(10,2) DEFAULT NULL,
                                                    `notes` text,
                                                    PRIMARY KEY (`id`),
                                                    KEY `idx_recipe_ingredients_recipe_id` (`recipe_id`),
                                                    KEY `idx_recipe_ingredients_component` (`component_type`,`component_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `recipe_processes`
--

CREATE TABLE IF NOT EXISTS `recipe_processes` (
                                                  `id` int(11) NOT NULL AUTO_INCREMENT,
                                                  `recipe_id` int(11) NOT NULL,
                                                  `process_id` int(11) NOT NULL,
                                                  `order_number` int(11) NOT NULL,
                                                  `duration_days` int(11) DEFAULT NULL,
                                                  `temperature_min` decimal(4,1) DEFAULT NULL,
                                                  `temperature_max` decimal(4,1) DEFAULT NULL,
                                                  `notes` text,
                                                  PRIMARY KEY (`id`),
                                                  KEY `recipe_processes_ibfk_1` (`recipe_id`),
                                                  KEY `recipe_processes_ibfk_2` (`process_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
                                       `id` int(11) NOT NULL AUTO_INCREMENT,
                                       `name` varchar(255) NOT NULL,
                                       `email` varchar(255) NOT NULL,
                                       `password` varchar(255) NOT NULL,
                                       `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                                       PRIMARY KEY (`id`),
                                       UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `batches`
--
ALTER TABLE `batches`
    ADD CONSTRAINT `batches_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    ADD CONSTRAINT `batches_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`);

--
-- Ограничения внешнего ключа таблицы `batch_components`
--
ALTER TABLE `batch_components`
    ADD CONSTRAINT `batch_components_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `grapes`
--
ALTER TABLE `grapes`
    ADD CONSTRAINT `grapes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `measurements`
--
ALTER TABLE `measurements`
    ADD CONSTRAINT `measurements_ibfk_1` FOREIGN KEY (`process_log_id`) REFERENCES `process_logs` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `process_logs`
--
ALTER TABLE `process_logs`
    ADD CONSTRAINT `process_logs_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE CASCADE,
    ADD CONSTRAINT `process_logs_ibfk_2` FOREIGN KEY (`process_id`) REFERENCES `processes` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `recipes`
--
ALTER TABLE `recipes`
    ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
    ADD CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `recipe_processes`
--
ALTER TABLE `recipe_processes`
    ADD CONSTRAINT `recipe_processes_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
    ADD CONSTRAINT `recipe_processes_ibfk_2` FOREIGN KEY (`process_id`) REFERENCES `processes` (`id`) ON DELETE CASCADE;
