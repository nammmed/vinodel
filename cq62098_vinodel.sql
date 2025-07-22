-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Июл 22 2025 г., 11:19
-- Версия сервера: 5.7.41-44
-- Версия PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `batch_components`
--

CREATE TABLE IF NOT EXISTS `batch_components` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `batch_id` int(11) NOT NULL,
  `component_type` enum('grape','batch') NOT NULL,
  `operation_type` enum('create','blend','split','transfer') DEFAULT NULL,
  `component_id` int(11) NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `volume` decimal(10,2) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `idx_batch_components_batch_id` (`batch_id`),
  KEY `idx_batch_components_component` (`component_type`,`component_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `grapes`
--

CREATE TABLE IF NOT EXISTS `grapes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `grape_sort_id` int(11) NOT NULL,
  `date_purchased` date NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `grapes_ibfk_2` (`grape_sort_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `grape_sorts`
--

CREATE TABLE IF NOT EXISTS `grape_sorts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `color` enum('red','white','pink','fruit') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `grape_sorts`
--

INSERT INTO `grape_sorts` (`id`, `name`, `color`) VALUES
(1, 'Каберне Совиньон', 'red'),
(2, 'Мерло', 'red'),
(3, 'Пино Нуар', 'red'),
(4, 'Сира (Шираз)', 'red'),
(5, 'Каберне Фран', 'red'),
(6, 'Мальбек (Кот)', 'red'),
(7, 'Карменер', 'red'),
(8, 'Пти Вердо', 'red'),
(9, 'Шардоне', 'white'),
(10, 'Совиньон Блан', 'white'),
(11, 'Рислинг', 'white'),
(12, 'Пино Гри (Пино Гриджио)', 'white'),
(13, 'Гевюрцтраминер', 'white'),
(14, 'Мускат Белый (Moscato Bianco)', 'white'),
(15, 'Вионье', 'white'),
(16, 'Шенен Блан (Пино де ля Луар)', 'white'),
(17, 'Семильон', 'white'),
(18, 'Пино Блан (Вайсбургундер)', 'white'),
(19, 'Сильванер', 'white'),
(20, 'Мюллер-Тургау', 'white'),
(21, 'Коломбар', 'white'),
(22, 'Санджовезе', 'red'),
(23, 'Неббиоло', 'red'),
(24, 'Барбера', 'red'),
(25, 'Монтепульчано', 'red'),
(26, 'Примитиво (Цинфандель)', 'red'),
(27, 'Неро д\'Авола', 'red'),
(28, 'Корвина', 'red'),
(29, 'Треббьяно', 'white'),
(30, 'Верментино', 'white'),
(31, 'Пино Гриджио', 'white'),
(32, 'Кортезе', 'white'),
(33, 'Гарганега', 'white'),
(34, 'Темпранильо (Тинто Фино)', 'red'),
(35, 'Гарнача (Гренаш)', 'red'),
(36, 'Монастрель (Мурведр)', 'red'),
(37, 'Кариньян (Масуэло)', 'red'),
(38, 'Бобаль', 'red'),
(39, 'Турига Насьонал', 'red'),
(40, 'Тинта Рориш (Арагонеш)', 'red'),
(41, 'Альбариньо', 'white'),
(42, 'Вердехо', 'white'),
(43, 'Айрен', 'white'),
(44, 'Макабео (Виура)', 'white'),
(45, 'Гаме', 'red'),
(46, 'Сенсо', 'red'),
(47, 'Менье', 'red'),
(48, 'Мурведр', 'red'),
(49, 'Танат', 'red'),
(50, 'Гролло', 'red'),
(51, 'Саваньен', 'white'),
(52, 'Мелон де Бургонь (Мюскаде)', 'white'),
(53, 'Русан', 'white'),
(54, 'Марсан', 'white'),
(55, 'Дорнфельдер', 'red'),
(56, 'Португизер', 'red'),
(57, 'Троллингер', 'red'),
(58, 'Лембергер (Блауфранкиш)', 'red'),
(59, 'Цвайгельт', 'red'),
(60, 'Санкт-Лаурент', 'red'),
(61, 'Грюнер Вельтлинер', 'white'),
(62, 'Кернер', 'white'),
(63, 'Шасла (Гутедель)', 'white'),
(64, 'Саперави', 'red'),
(65, 'Александроули', 'red'),
(66, 'Муджуретули', 'red'),
(67, 'Красностоп Золотовский', 'red'),
(68, 'Цимлянский Черный', 'red'),
(69, 'Бастардо Магарачский', 'red'),
(70, 'Оджалеши', 'red'),
(71, 'Фетяска Нягрэ', 'red'),
(72, 'Вранац', 'red'),
(73, 'Кадарка', 'red'),
(74, 'Ркацители', 'white'),
(75, 'Мцване', 'white'),
(76, 'Фетяска Алба', 'white'),
(77, 'Фурминт', 'white'),
(78, 'Цоликоури', 'white'),
(79, 'Грашевина (Вельшрислинг)', 'white'),
(80, 'Жилавка', 'white'),
(81, 'Кокур Белый', 'white'),
(82, 'Изабелла', 'red'),
(83, 'Лидия', 'pink'),
(84, 'Конкорд', 'red'),
(85, 'Регент', 'red'),
(86, 'Маркетт', 'red'),
(87, 'Фронтиньяк', 'red'),
(88, 'Видаль Блан', 'white'),
(89, 'Сейваль Блан', 'white'),
(90, 'Бианка', 'white'),
(91, 'Солярис', 'white'),
(92, 'Йоханнитер', 'white'),
(93, 'Кристалл', 'white'),
(94, 'Цитронный Магарача', 'white'),
(95, 'Дружба', 'white'),
(96, 'Платовский', 'white'),
(97, 'Амурский Потапенко', 'red'),
(98, 'Яблоко', 'fruit'),
(99, 'Груша', 'fruit'),
(100, 'Айва', 'fruit'),
(101, 'Вишня', 'fruit'),
(102, 'Черешня', 'fruit'),
(103, 'Ежевика', 'fruit'),
(104, 'Малина', 'fruit'),
(105, 'Клубника (Земляника садовая)', 'fruit'),
(106, 'Черная смородина', 'fruit'),
(107, 'Красная смородина', 'fruit'),
(108, 'Белая смородина', 'fruit'),
(109, 'Крыжовник', 'fruit'),
(110, 'Слива', 'fruit'),
(111, 'Алыча', 'fruit'),
(112, 'Терн', 'fruit'),
(113, 'Голубика', 'fruit'),
(114, 'Черника', 'fruit'),
(115, 'Ирга', 'fruit'),
(116, 'Жимолость', 'fruit'),
(117, 'Рябина черноплодная (Арония)', 'fruit'),
(118, 'Рябина красная', 'fruit'),
(119, 'Клюква', 'fruit'),
(120, 'Брусника', 'fruit'),
(121, 'Облепиха', 'fruit'),
(122, 'Шиповник', 'fruit'),
(123, 'Бузина черная', 'fruit'),
(124, 'Мед', 'fruit'),
(125, 'Виноград (черный)', 'red'),
(126, 'Виноград (белый)', 'white'),
(127, 'Виноград (розовый)', 'pink');

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `processes`
--

CREATE TABLE IF NOT EXISTS `processes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `recipes`
--

CREATE TABLE IF NOT EXISTS `recipes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `recipe_ingredients`
--

CREATE TABLE IF NOT EXISTS `recipe_ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `grape_sort_id` int(11) NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipe_id` (`recipe_id`),
  KEY `recipe_ingredients_ibfk_2` (`grape_sort_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `supplies`
--

CREATE TABLE IF NOT EXISTS `supplies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '0',
  `unit` varchar(50) DEFAULT 'шт.',
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `supply_purchases`
--

CREATE TABLE IF NOT EXISTS `supply_purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supply_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `quantity` int(11) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `supply_id` (`supply_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `supply_usages`
--

CREATE TABLE IF NOT EXISTS `supply_usages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supply_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `quantity` int(11) NOT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `supply_id` (`supply_id`),
  KEY `batch_id` (`batch_id`),
  KEY `user_id` (`user_id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Ограничения внешнего ключа таблицы `batches`
--
ALTER TABLE `batches`
  ADD CONSTRAINT `batches_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `batch_components`
--
ALTER TABLE `batch_components`
  ADD CONSTRAINT `batch_components_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `grapes`
--
ALTER TABLE `grapes`
  ADD CONSTRAINT `grapes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grapes_ibfk_2` FOREIGN KEY (`grape_sort_id`) REFERENCES `grape_sorts` (`id`);

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
  ADD CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_ingredients_ibfk_2` FOREIGN KEY (`grape_sort_id`) REFERENCES `grape_sorts` (`id`);

--
-- Ограничения внешнего ключа таблицы `supplies`
--
ALTER TABLE `supplies`
  ADD CONSTRAINT `supplies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `supply_purchases`
--
ALTER TABLE `supply_purchases`
  ADD CONSTRAINT `supply_purchases_ibfk_1` FOREIGN KEY (`supply_id`) REFERENCES `supplies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `supply_purchases_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `supply_usages`
--
ALTER TABLE `supply_usages`
  ADD CONSTRAINT `supply_usages_ibfk_1` FOREIGN KEY (`supply_id`) REFERENCES `supplies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `supply_usages_ibfk_2` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `supply_usages_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
