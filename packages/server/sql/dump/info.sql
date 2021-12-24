-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: real_world
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cur_articles`
--

DROP TABLE IF EXISTS `cur_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cur_articles` (
  `articleId` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `body` mediumtext NOT NULL,
  `slug` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(1500) NOT NULL,
  `tagList` json DEFAULT NULL,
  `createdAt` int unsigned NOT NULL DEFAULT (unix_timestamp()),
  `updatedAt` int unsigned DEFAULT NULL,
  `favoritesCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`articleId`),
  UNIQUE KEY `uniq_cur_articles_1_idx` (`slug`),
  KEY `fk_cur_articles_1_idx` (`userId`),
  CONSTRAINT `fk_cur_articles_1` FOREIGN KEY (`userId`) REFERENCES `cur_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cur_users`
--

DROP TABLE IF EXISTS `cur_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cur_users` (
  `userId` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `bio` varchar(2000) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Prefix "cur" mean "current". So this table includes current state. This is not dictionary.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dict_tags`
--

DROP TABLE IF EXISTS `dict_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dict_tags` (
  `tagId` int unsigned NOT NULL AUTO_INCREMENT,
  `tagName` varchar(45) NOT NULL,
  `createdAt` int unsigned NOT NULL DEFAULT (unix_timestamp()),
  `creatorId` int unsigned NOT NULL,
  PRIMARY KEY (`tagId`),
  UNIQUE KEY `tag_name_UNIQUE` (`tagName`),
  KEY `fk_dict_tags_1_idx` (`creatorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `map_articles_tags`
--

DROP TABLE IF EXISTS `map_articles_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map_articles_tags` (
  `articleId` int unsigned NOT NULL,
  `tagId` int unsigned NOT NULL,
  UNIQUE KEY `uniq_map_articles_tags_1` (`articleId`,`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `map_favorites`
--

DROP TABLE IF EXISTS `map_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map_favorites` (
  `articleId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  UNIQUE KEY `uniq_map_favorites_1_idx` (`articleId`,`userId`),
  KEY `fk_map_favorites_1_idx` (`articleId`),
  KEY `fk_map_favorites_2_idx` (`userId`),
  CONSTRAINT `fk_map_favorites_1` FOREIGN KEY (`userId`) REFERENCES `cur_users` (`userId`),
  CONSTRAINT `fk_map_favorites_2` FOREIGN KEY (`articleId`) REFERENCES `cur_articles` (`articleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `map_followers`
--

DROP TABLE IF EXISTS `map_followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map_followers` (
  `userId` int unsigned NOT NULL,
  `followerId` int unsigned NOT NULL,
  UNIQUE KEY `uniq_map_followers_1_idx` (`userId`,`followerId`),
  KEY `fk_map_followers_1_idx1` (`userId`,`followerId`),
  KEY `fk_map_followers_2_idx` (`followerId`),
  CONSTRAINT `fk_map_followers_1` FOREIGN KEY (`userId`) REFERENCES `cur_users` (`userId`),
  CONSTRAINT `fk_map_followers_2` FOREIGN KEY (`followerId`) REFERENCES `cur_users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-24 20:15:25
