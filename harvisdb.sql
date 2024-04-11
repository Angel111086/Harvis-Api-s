-- MySQL dump 10.13  Distrib 5.7.36, for Linux (x86_64)
--
-- Host: localhost    Database: harvisdb
-- ------------------------------------------------------
-- Server version	5.7.36-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adminlogin`
--

DROP TABLE IF EXISTS `adminlogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adminlogin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adminname` varchar(100) NOT NULL,
  `adminpassword` varchar(100) NOT NULL,
  `adminmobile` varchar(100) NOT NULL,
  `adminemail` varchar(100) DEFAULT NULL,
  `StatusId` int(11) DEFAULT NULL,
  `CreatedById` int(11) DEFAULT NULL,
  `CreationDate` date DEFAULT NULL,
  `ModifiedById` int(11) DEFAULT NULL,
  `ModificationDate` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminlogin`
--

LOCK TABLES `adminlogin` WRITE;
/*!40000 ALTER TABLE `adminlogin` DISABLE KEYS */;
INSERT INTO `adminlogin` VALUES (1,'admin','8900','9406972400','kdmanjunat@gmail.com',1,1,'2021-07-21',NULL,NULL);
/*!40000 ALTER TABLE `adminlogin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Skin Care',1,1,'2021-07-21',NULL,NULL),(2,'Hair Care',1,1,'2021-07-21',NULL,NULL),(4,'Personal Care',1,1,'2021-07-22',1,'2021-07-22'),(5,'Fragrance',0,1,'2021-07-22',NULL,NULL),(10,'skin oil',1,1,'2021-09-05',1,'2021-10-15'),(11,'Hair Brand',1,1,'2021-10-21',NULL,NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoice` (
  `invoice_no` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `shipping_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `amount_payable` decimal(10,2) NOT NULL,
  `payment_mode` varchar(500) NOT NULL,
  `invoice_date` date NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`invoice_no`),
  KEY `invoice_order` (`order_id`),
  KEY `invoice_shipping` (`shipping_id`),
  KEY `invoice_user` (`user_id`),
  CONSTRAINT `invoice_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `invoice_shipping` FOREIGN KEY (`shipping_id`) REFERENCES `shippingaddress` (`shipping_id`),
  CONSTRAINT `invoice_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES (2,1,1,2,2500.00,2000.00,'Prepaid','2021-08-05',1,2,'2021-08-05',NULL,NULL),(3,110,5,11,4555.00,3789.00,'COD','2021-10-27',1,11,'2021-10-27',NULL,NULL),(4,111,5,11,4555.00,3789.00,'COD','2021-10-27',1,11,'2021-10-27',NULL,NULL),(5,112,5,11,4555.00,3789.00,'COD','2021-10-27',1,11,'2021-10-27',NULL,NULL),(6,115,6,11,120.00,90.00,'COD','2021-11-01',1,11,'2021-11-01',NULL,NULL),(7,116,6,11,4555.00,3789.00,'COD','2021-11-01',1,11,'2021-11-01',NULL,NULL),(8,127,7,11,4555.00,3789.00,'COD','2021-11-30',1,11,'2021-11-30',NULL,NULL),(9,128,5,11,9110.00,7578.00,'COD','2021-12-01',1,11,'2021-12-01',NULL,NULL),(10,130,7,11,4555.00,3789.00,'COD','2021-12-01',1,11,'2021-12-01',NULL,NULL),(11,131,5,11,4555.00,3789.00,'COD','2021-12-02',1,11,'2021-12-02',NULL,NULL),(12,132,7,11,13665.00,11367.00,'COD','2021-12-02',1,11,'2021-12-02',NULL,NULL);
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer`
--

DROP TABLE IF EXISTS `offer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offer` (
  `offer_id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_name` varchar(500) NOT NULL,
  `offer_code` varchar(100) DEFAULT NULL,
  `no_of_users` int(100) NOT NULL,
  `fromDate` date NOT NULL,
  `expiryDate` date NOT NULL,
  `minimum_cartvalue` decimal(10,2) NOT NULL,
  `maximumDiscount` decimal(10,2) NOT NULL,
  `discountType` varchar(100) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `offer_description` varchar(500) DEFAULT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`offer_id`),
  KEY `category_id` (`category_id`),
  KEY `subcategory_id` (`subcategory_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `offer_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `offer_ibfk_2` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`subcategory_id`),
  CONSTRAINT `offer_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer`
--

LOCK TABLES `offer` WRITE;
/*!40000 ALTER TABLE `offer` DISABLE KEYS */;
INSERT INTO `offer` VALUES (1,'Not Applicable','NA0',0,'2021-10-12','2021-12-31',500.00,5.00,'Percentage',5.00,1,1,2,'Test Description',1,1,'2021-10-12',1,'2021-10-12'),(2,'Welcome Offer','MJ05DAMAKA',1000,'2021-10-15','2021-10-20',500.00,50.00,'flat',50.00,1,1,1,'First 10 orders',1,1,'2021-10-12',NULL,NULL),(3,'Diwali Blast','DIWALI2021',1000,'2021-10-15','2021-10-20',500.00,100.00,'percentage',100.00,1,3,13,'First 10 orders',1,1,'2021-10-12',NULL,NULL),(4,'Masakasa','MASAIMARA%9',1000,'2021-10-12','2021-10-15',1000.00,200.00,'percentage',200.00,1,1,1,'First 10 orders',1,1,'2021-10-12',NULL,NULL);
/*!40000 ALTER TABLE `offer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetail`
--

DROP TABLE IF EXISTS `orderdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderdetail` (
  `orderdetail_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_quantity` int(100) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `offer_id` int(11) DEFAULT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`orderdetail_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `offer_id` (`offer_id`),
  CONSTRAINT `orderdetail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `orderdetail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `orderdetail_ibfk_3` FOREIGN KEY (`offer_id`) REFERENCES `offer` (`offer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetail`
--

LOCK TABLES `orderdetail` WRITE;
/*!40000 ALTER TABLE `orderdetail` DISABLE KEYS */;
INSERT INTO `orderdetail` VALUES (1,13,2,2,100.00,1,1,2,'2021-10-12',NULL,NULL),(3,14,1,2,100.00,1,1,2,'2021-10-12',NULL,NULL),(4,14,10,2,100.00,1,1,2,'2021-10-12',NULL,NULL),(5,18,1,1,150.00,NULL,1,11,'2021-10-16',NULL,NULL),(6,19,10,2,654.00,NULL,1,11,'2021-10-18',NULL,NULL),(7,20,1,1,150.00,1,1,11,'2021-10-18',NULL,NULL),(8,21,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(9,22,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(10,23,13,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(11,24,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(12,25,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(13,26,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(14,27,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(15,28,1,1,150.00,1,1,11,'2021-10-18',NULL,NULL),(16,29,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(17,30,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(18,31,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(19,32,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(20,33,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(21,34,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(22,35,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(23,36,1,1,150.00,1,1,11,'2021-10-18',NULL,NULL),(24,37,14,1,45.00,1,1,11,'2021-10-18',NULL,NULL),(25,38,10,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(26,39,13,1,2344.00,1,1,11,'2021-10-18',NULL,NULL),(27,39,14,1,45.00,1,1,11,'2021-10-18',NULL,NULL),(28,40,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(29,41,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(30,42,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(31,43,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(32,44,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(33,45,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(34,46,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(35,47,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(36,47,12,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(37,48,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(38,49,1,4,150.00,1,1,11,'2021-10-19',NULL,NULL),(39,50,10,5,2344.00,1,1,11,'2021-10-19',NULL,NULL),(40,51,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(41,51,14,1,45.00,1,1,11,'2021-10-19',NULL,NULL),(42,52,14,5,45.00,1,1,11,'2021-10-19',NULL,NULL),(43,53,1,4,150.00,1,1,11,'2021-10-19',NULL,NULL),(44,53,10,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(45,53,12,5,2344.00,1,1,11,'2021-10-19',NULL,NULL),(46,53,13,2,2344.00,1,1,11,'2021-10-19',NULL,NULL),(47,54,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(48,54,14,1,45.00,1,1,11,'2021-10-19',NULL,NULL),(49,55,14,6,45.00,1,1,11,'2021-10-19',NULL,NULL),(50,56,13,5,2344.00,1,1,11,'2021-10-19',NULL,NULL),(51,57,10,2,2344.00,1,1,11,'2021-10-19',NULL,NULL),(52,58,10,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(53,58,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(54,59,14,2,45.00,1,1,11,'2021-10-19',NULL,NULL),(55,60,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(56,60,14,3,45.00,1,1,11,'2021-10-19',NULL,NULL),(57,61,13,2,2344.00,1,1,11,'2021-10-19',NULL,NULL),(58,62,14,1,45.00,1,1,11,'2021-10-19',NULL,NULL),(59,63,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(60,64,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(61,65,12,2,2344.00,1,1,11,'2021-10-19',NULL,NULL),(62,66,10,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(63,67,10,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(64,68,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(65,69,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(66,70,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(67,71,14,1,45.00,1,1,11,'2021-10-19',NULL,NULL),(68,72,1,1,150.00,1,1,11,'2021-10-19',NULL,NULL),(69,73,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(70,74,13,1,2344.00,1,1,11,'2021-10-19',NULL,NULL),(71,75,10,2,2344.00,1,1,11,'2021-10-19',NULL,NULL),(72,76,1,1,150.00,1,1,11,'2021-10-20',NULL,NULL),(73,77,13,1,2344.00,1,1,11,'2021-10-20',NULL,NULL),(74,78,1,1,150.00,1,1,11,'2021-10-22',NULL,NULL),(75,79,1,1,150.00,1,1,11,'2021-10-22',NULL,NULL),(76,82,2,2,500.00,3,1,1,'2021-10-25',NULL,NULL),(77,82,10,3,700.00,3,1,1,'2021-10-25',NULL,NULL),(78,83,1,3,150.00,1,1,11,'2021-10-26',NULL,NULL),(79,84,1,1,150.00,1,1,11,'2021-10-26',NULL,NULL),(80,85,1,1,150.00,1,1,11,'2021-10-26',NULL,NULL),(81,86,10,2,654.00,NULL,1,11,'2021-10-26',NULL,NULL),(82,86,10,2,654.00,NULL,1,11,'2021-10-26',NULL,NULL),(83,87,1,1,150.00,1,1,11,'2021-10-26',NULL,NULL),(84,88,1,1,150.00,1,1,11,'2021-10-26',NULL,NULL),(85,89,10,1,2344.00,1,1,11,'2021-10-26',NULL,NULL),(86,90,10,1,2344.00,1,1,11,'2021-10-26',NULL,NULL),(87,91,13,1,2344.00,1,1,11,'2021-10-26',NULL,NULL),(88,92,1,1,150.00,1,1,11,'2021-10-26',NULL,NULL),(89,93,10,1,2344.00,1,1,11,'2021-10-26',NULL,NULL),(90,94,2,2,500.00,3,1,1,'2021-10-26',NULL,NULL),(91,94,10,3,700.00,3,1,1,'2021-10-26',NULL,NULL),(92,95,12,1,2344.00,1,1,11,'2021-10-26',NULL,NULL),(93,96,1,1,150.00,1,1,11,'2021-10-26',NULL,NULL),(94,97,12,1,2344.00,1,1,11,'2021-10-26',NULL,NULL),(95,98,1,1,150.00,1,1,11,'2021-10-26',NULL,NULL),(96,99,12,1,2344.00,1,1,11,'2021-10-26',NULL,NULL),(97,105,1,1,150.00,1,1,11,'2021-10-27',NULL,NULL),(98,110,10,1,2344.00,1,1,11,'2021-10-27',NULL,NULL),(99,111,13,1,2344.00,1,1,11,'2021-10-27',NULL,NULL),(100,112,13,1,2344.00,1,1,11,'2021-10-27',NULL,NULL),(101,113,14,1,45.00,1,1,11,'2021-10-27',NULL,NULL),(102,114,12,1,2344.00,1,1,11,'2021-10-27',NULL,NULL),(103,115,1,1,150.00,1,1,11,'2021-11-01',NULL,NULL),(104,116,10,1,2344.00,1,1,11,'2021-11-01',NULL,NULL),(105,117,1,1,150.00,1,1,11,'2021-11-01',NULL,NULL),(106,118,10,3,2344.00,1,1,11,'2021-11-01',NULL,NULL),(107,119,1,1,150.00,1,1,11,'2021-11-01',NULL,NULL),(108,120,13,1,2344.00,1,1,11,'2021-11-01',NULL,NULL),(109,121,1,1,150.00,1,1,11,'2021-11-01',NULL,NULL),(110,122,10,1,2344.00,1,1,11,'2021-11-01',NULL,NULL),(111,123,10,1,2344.00,1,1,11,'2021-11-01',NULL,NULL),(112,124,1,2,100.00,1,1,2,'2021-11-09',NULL,NULL),(113,124,10,2,100.00,1,1,2,'2021-11-09',NULL,NULL),(114,125,12,1,2344.00,1,1,11,'2021-11-30',NULL,NULL),(115,126,12,1,2344.00,1,1,11,'2021-11-30',NULL,NULL),(116,127,12,1,2344.00,1,1,11,'2021-11-30',NULL,NULL),(117,128,10,2,2344.00,1,1,11,'2021-12-01',NULL,NULL),(118,129,12,1,2344.00,1,1,11,'2021-12-01',NULL,NULL),(119,130,12,1,2344.00,1,1,11,'2021-12-01',NULL,NULL),(120,131,13,1,2344.00,1,1,11,'2021-12-02',NULL,NULL),(121,132,13,3,2344.00,1,1,11,'2021-12-02',NULL,NULL),(122,133,10,1,2344.00,1,1,11,'2021-12-03',NULL,NULL);
/*!40000 ALTER TABLE `orderdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `payableamount` decimal(10,2) NOT NULL,
  `shipping_id` int(11) NOT NULL,
  `order_status` varchar(100) DEFAULT NULL,
  `payment_type` varchar(500) NOT NULL,
  `payment_status` varchar(100) DEFAULT NULL,
  `order_date` date NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,100.00,20.00,80.00,1,'paid','COD',NULL,'2020-07-24',1,1,'2021-07-24',NULL,NULL),(2,1,100.00,20.00,80.00,1,'paid','COD',NULL,'2020-07-27',0,1,'2021-07-24',1,'2021-07-24'),(3,1,120.00,20.00,100.00,1,'pending','COD',NULL,'2020-06-30',1,1,'2021-06-23',NULL,NULL),(4,3,3500.00,1000.00,2500.00,1,'paid','COD',NULL,'2020-07-31',0,3,'2021-07-30',3,'2021-07-30'),(5,3,3500.00,1000.00,2500.00,1,'paid','COD',NULL,'2020-07-31',1,3,'2021-07-30',NULL,NULL),(6,2,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-09-29',1,2,'2021-09-29',NULL,NULL),(7,2,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-09-29',1,2,'2021-09-29',NULL,NULL),(8,2,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-09-29',1,2,'2021-09-29',NULL,NULL),(9,2,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-09-29',1,2,'2021-09-29',NULL,NULL),(10,11,1222.00,13.00,1233.00,4,'pending','COD',NULL,'2021-09-12',1,11,'2021-10-12',NULL,NULL),(11,2,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-09-29',1,2,'2021-10-12',NULL,NULL),(12,2,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-09-29',1,2,'2021-10-12',NULL,NULL),(13,2,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-09-29',1,2,'2021-10-12',NULL,NULL),(14,2,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-09-29',1,2,'2021-10-12',NULL,NULL),(15,11,1222.00,13.00,1233.00,4,'pending','online',NULL,'2021-09-16',1,11,'2021-10-16',NULL,NULL),(16,11,1222.00,13.00,1233.00,4,'pending','COD',NULL,'2021-09-16',1,11,'2021-10-16',NULL,NULL),(17,11,1222.00,13.00,1233.00,4,'pending','COD',NULL,'2021-09-16',1,11,'2021-10-16',NULL,NULL),(18,11,1222.00,13.00,1233.00,4,'pending','COD',NULL,'2021-09-16',1,11,'2021-10-16',NULL,NULL),(19,11,12345.00,80.00,1223.00,1,NULL,'COD',NULL,'2021-10-18',1,11,'2021-10-18',NULL,NULL),(20,11,1222.00,13.00,1233.00,4,'pending','COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(21,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(22,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(23,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(24,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(25,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(26,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(27,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(28,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(29,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(30,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(31,11,1222.00,13.00,1233.00,4,NULL,'COD',NULL,'2021-09-18',1,11,'2021-10-18',NULL,NULL),(32,11,1222.00,13.00,1233.00,4,'Order Placed','COD','pending','2021-09-18',1,11,'2021-10-18',NULL,NULL),(33,11,1222.00,13.00,1233.00,4,'Order Placed','COD','pending','2021-09-18',1,11,'2021-10-18',NULL,NULL),(34,11,1222.00,13.00,1233.00,4,'Order Placed','COD','pending','2021-09-18',1,11,'2021-10-18',NULL,NULL),(35,11,1222.00,13.00,1233.00,4,'Order Placed','COD','pending','2021-10-18',1,11,'2021-10-18',NULL,NULL),(36,11,1222.00,13.00,1556.00,4,'Order Placed','COD','pending','2021-10-18',1,11,'2021-10-18',NULL,NULL),(37,11,0.00,0.00,1556.00,4,'Order Placed','COD','pending','2021-10-18',1,11,'2021-10-18',NULL,NULL),(38,11,0.00,766.00,1556.00,4,'Order Placed','COD','pending','2021-10-18',1,11,'2021-10-18',NULL,NULL),(39,11,2900.00,55.00,1556.00,4,NULL,'online',NULL,'2021-10-18',1,11,'2021-10-18',NULL,NULL),(40,11,2900.00,55.00,1556.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(41,11,2900.00,55.00,1556.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(42,11,2900.00,55.00,1556.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(43,11,2900.00,55.00,1556.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(44,11,2900.00,55.00,1556.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(45,11,2900.00,55.00,1556.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(46,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(47,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(48,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(49,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(50,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(51,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(52,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(53,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(54,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(55,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(56,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(57,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(58,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(59,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(60,11,2900.00,55.00,1556.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(61,11,2900.00,55.00,1556.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(62,11,2900.00,55.00,451.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(63,11,4555.00,55.00,3789.00,4,'Order Placed','COD','pending','2021-10-19',1,11,'2021-10-19',NULL,NULL),(64,11,4555.00,55.00,3789.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(65,11,9110.00,55.00,7578.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(66,11,4555.00,55.00,3789.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(67,11,4555.00,55.00,3789.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(68,11,120.00,55.00,90.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(69,11,4555.00,55.00,3789.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(70,11,4555.00,55.00,3789.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(71,11,456.00,55.00,451.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(72,11,120.00,55.00,90.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(73,11,4555.00,55.00,3789.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(74,11,4555.00,55.00,3789.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(75,11,9110.00,55.00,7578.00,4,NULL,'online',NULL,'2021-10-19',1,11,'2021-10-19',NULL,NULL),(76,11,120.00,55.00,90.00,4,'Order Placed','COD','pending','2021-10-20',1,11,'2021-10-20',NULL,NULL),(77,11,4555.00,55.00,3789.00,4,'Order Placed','COD','pending','2021-10-20',1,11,'2021-10-20',NULL,NULL),(78,11,120.00,55.00,90.00,5,'Order Placed','COD','pending','2021-10-22',1,11,'2021-10-22',NULL,NULL),(79,11,120.00,55.00,90.00,5,'Order Placed','online','paid','2021-10-22',1,11,'2021-10-22',NULL,NULL),(80,1,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-10-18',1,1,'2021-10-25',NULL,NULL),(81,1,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-10-18',1,1,'2021-10-25',NULL,NULL),(82,1,2000.00,500.00,1500.00,1,'pending','COD',NULL,'2021-10-18',1,1,'2021-10-25',NULL,NULL),(83,11,2345.00,1233.00,1567.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(84,11,120.00,30.00,90.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(85,11,120.00,30.00,90.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(86,11,78.00,234.00,900.00,6,NULL,'COD',NULL,'2021-10-12',1,11,'2021-10-26',NULL,NULL),(87,11,120.00,30.00,90.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(88,11,120.00,30.00,90.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(89,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(90,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(91,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(92,11,120.00,30.00,90.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(93,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(94,1,2000.00,500.00,1500.00,1,'order placed','COD','paid','2021-10-18',1,1,'2021-10-26',NULL,NULL),(95,11,4555.00,766.00,3789.00,5,'Order Placed','COD','pending','2021-10-26',1,11,'2021-10-26',NULL,NULL),(96,11,120.00,30.00,90.00,5,'Order Placed','online','paid','2021-10-26',1,11,'2021-10-26',NULL,NULL),(97,11,4555.00,766.00,3789.00,5,NULL,'online',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(98,11,120.00,30.00,90.00,5,NULL,'online',NULL,'2021-10-26',1,11,'2021-10-26',NULL,NULL),(99,11,4555.00,766.00,3789.00,5,'Order Placed','online','paid','2021-10-26',1,11,'2021-10-26',NULL,NULL),(100,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(101,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(102,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(103,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(104,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(105,11,120.00,30.00,90.00,5,'Order Placed','COD','pending','2021-10-27',1,11,'2021-10-27',NULL,NULL),(106,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(107,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(108,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(109,11,4555.00,766.00,3789.00,5,NULL,'COD',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(110,11,4555.00,766.00,3789.00,5,'Order Placed','COD','pending','2021-10-27',1,11,'2021-10-27',NULL,NULL),(111,11,4555.00,766.00,3789.00,5,'Order Placed','COD','pending','2021-10-27',1,11,'2021-10-27',NULL,NULL),(112,11,4555.00,766.00,3789.00,5,'Order Placed','COD','paid','2021-10-27',1,11,'2021-10-27',NULL,NULL),(113,11,456.00,5.00,451.00,5,NULL,'online',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(114,11,4555.00,766.00,3789.00,6,NULL,'online',NULL,'2021-10-27',1,11,'2021-10-27',NULL,NULL),(115,11,120.00,30.00,90.00,6,'Order Placed','COD','pending','2021-11-01',1,11,'2021-11-01',NULL,NULL),(116,11,4555.00,766.00,3789.00,6,'Order Placed','COD','pending','2021-11-01',1,11,'2021-11-01',NULL,NULL),(117,11,120.00,30.00,90.00,5,'Order Placed','online','paid','2021-11-01',1,11,'2021-11-01',NULL,NULL),(118,11,13665.00,766.00,11367.00,5,NULL,'online',NULL,'2021-11-01',1,11,'2021-11-01',NULL,NULL),(119,11,120.00,30.00,90.00,6,NULL,'online',NULL,'2021-11-01',1,11,'2021-11-01',NULL,NULL),(120,11,4555.00,766.00,3789.00,5,NULL,'online',NULL,'2021-11-01',1,11,'2021-11-01',NULL,NULL),(121,11,120.00,30.00,90.00,5,NULL,'online',NULL,'2021-11-01',1,11,'2021-11-01',NULL,NULL),(122,11,4555.00,766.00,3789.00,6,NULL,'online',NULL,'2021-11-01',1,11,'2021-11-01',NULL,NULL),(123,11,4555.00,766.00,3789.00,5,NULL,'online',NULL,'2021-11-01',1,11,'2021-11-01',NULL,NULL),(124,2,2000.00,500.00,1500.00,1,NULL,'COD',NULL,'2021-09-29',1,2,'2021-11-09',NULL,NULL),(125,11,4555.00,766.00,3789.00,7,NULL,'online',NULL,'2021-11-30',1,11,'2021-11-30',NULL,NULL),(126,11,4555.00,766.00,3789.00,7,NULL,'online',NULL,'2021-11-30',1,11,'2021-11-30',NULL,NULL),(127,11,4555.00,766.00,3789.00,7,'Order Placed','COD','pending','2021-11-30',1,11,'2021-11-30',NULL,NULL),(128,11,9110.00,766.00,7578.00,5,'Order Placed','COD','pending','2021-12-01',1,11,'2021-12-01',NULL,NULL),(129,11,4555.00,766.00,3789.00,7,NULL,'online',NULL,'2021-12-01',1,11,'2021-12-01',NULL,NULL),(130,11,4555.00,766.00,3789.00,7,'Order Placed','COD','pending','2021-12-01',1,11,'2021-12-01',NULL,NULL),(131,11,4555.00,766.00,3789.00,5,'Order Placed','COD','pending','2021-12-02',1,11,'2021-12-02',NULL,NULL),(132,11,13665.00,766.00,11367.00,7,'Order Placed','COD','pending','2021-12-02',1,11,'2021-12-02',NULL,NULL),(133,11,4555.00,766.00,3789.00,7,NULL,'online',NULL,'2021-12-03',1,11,'2021-12-03',NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `subcategory_id` int(11) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_description` varchar(500) DEFAULT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_discount` decimal(10,2) NOT NULL,
  `product_actualprice` decimal(10,2) NOT NULL,
  `product_image` varchar(500) NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_name` (`product_name`),
  KEY `category_id` (`category_id`),
  KEY `subcategory_id` (`subcategory_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`subcategory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,1,'Mixed Fruit Scrub',NULL,150.00,30.00,120.00,'./public/product/reminder.png',1,1,'2021-07-30',1,'2021-10-13'),(2,1,1,'Fruit Scrub',NULL,100.00,20.00,120.00,'./public/product/getVendorApp.svg',0,1,'2021-10-01',NULL,NULL),(10,1,1,'dairy',NULL,2344.00,766.00,4555.00,'./public/product/x8 - Copy.jpg',1,1,'2021-10-08',NULL,NULL),(12,2,5,'medicine',NULL,2344.00,766.00,4555.00,'./public/product/P_9.jpg',1,1,'2021-10-08',NULL,NULL),(13,1,3,'white',NULL,2344.00,766.00,4555.00,'./public/product/P_3.jpg',1,1,'2021-10-11',1,'2021-10-15'),(14,2,5,'chicken',NULL,45.00,5.00,456.00,'./public/product/P_1.jpg',1,1,'2021-10-15',NULL,NULL),(15,2,5,'Hair Mask Cum Conditioner',NULL,2344.00,5.00,2349.00,'./public/product/a6.png',1,1,'2021-11-25',NULL,NULL),(16,2,5,'Help',NULL,8.00,8.00,0.00,'./public/product/z.JPG',1,1,'2021-11-25',NULL,NULL),(17,2,5,'shampoo',NULL,999.00,99.00,900.00,'./public/product/a4.png',1,1,'2021-11-25',NULL,NULL),(18,1,1,'Risabh patitar',NULL,801.00,99.00,900.00,'./public/product/P_4.jpg',1,1,'2021-12-01',NULL,NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `razorpaycredentials`
--

DROP TABLE IF EXISTS `razorpaycredentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `razorpaycredentials` (
  `razorpay_secret` varchar(100) NOT NULL,
  `razorpay_key` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `razorpaycredentials`
--

LOCK TABLES `razorpaycredentials` WRITE;
/*!40000 ALTER TABLE `razorpaycredentials` DISABLE KEYS */;
INSERT INTO `razorpaycredentials` VALUES ('kwW81hJdV7zMHEYIPyNh79qU','rzp_test_mrKy6vydDmReI5');
/*!40000 ALTER TABLE `razorpaycredentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `razorpaydetails`
--

DROP TABLE IF EXISTS `razorpaydetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `razorpaydetails` (
  `razorpaydetails_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `razorpay_paymentid` varchar(250) NOT NULL,
  `org_name` varchar(150) NOT NULL,
  `status` varchar(150) NOT NULL,
  `payableAmount` decimal(10,2) NOT NULL,
  `shipping_id` int(11) NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`razorpaydetails_id`),
  KEY `user_id` (`user_id`),
  KEY `shipping_id` (`shipping_id`),
  CONSTRAINT `razorpaydetails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `razorpaydetails_ibfk_2` FOREIGN KEY (`shipping_id`) REFERENCES `shippingaddress` (`shipping_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `razorpaydetails`
--

LOCK TABLES `razorpaydetails` WRITE;
/*!40000 ALTER TABLE `razorpaydetails` DISABLE KEYS */;
INSERT INTO `razorpaydetails` VALUES (1,2,'Test','Razorpay','paid',2000.00,1,1,2,'2021-10-07',NULL,NULL),(2,2,'Test','Razorpay','paid',2000.00,1,1,2,'2021-10-19',NULL,NULL),(3,11,'pay_IDamNqZCrqJSc4','Razorpay','paid',120.00,5,1,11,'2021-10-25',NULL,NULL),(4,11,'pay_IDamNqZCrqJSc4','Razorpay','paid',120.00,5,1,11,'2021-10-25',NULL,NULL),(5,11,'pay_IDu7lGRPbKF65Q','Razorpay','paid',120.00,5,1,11,'2021-10-26',NULL,NULL),(6,11,'pay_IDu7lGRPbKF65Q','Razorpay','paid',120.00,5,1,11,'2021-10-26',NULL,NULL),(7,11,'pay_IDu7lGRPbKF65Q','Razorpay','paid',4555.00,5,1,11,'2021-10-26',NULL,NULL),(8,11,'pay_IDu7lGRPbKF65Q','Razorpay','paid',4555.00,5,1,11,'2021-10-26',NULL,NULL),(9,11,'pay_IDu7lGRPbKF65Q','Razorpay','paid',4555.00,5,1,11,'2021-10-26',NULL,NULL),(10,11,'pay_IDu7lGRPbKF65Q','Razorpay','paid',4555.00,5,1,11,'2021-10-26',NULL,NULL),(11,11,'pay_IDu7lGRPbKF65Q','Razorpay','paid',4555.00,5,1,11,'2021-10-26',NULL,NULL),(12,11,'pay_IDuMiVlNrcXqtd','Razorpay','paid',120.00,5,1,11,'2021-10-26',NULL,NULL),(13,11,'pay_IDuPbeYQtDqW2W','Razorpay','paid',4555.00,5,1,11,'2021-10-26',NULL,NULL),(14,11,'pay_IDuRjsCNvg0dGt','Razorpay','paid',4555.00,5,1,11,'2021-10-26',NULL,NULL),(15,11,'pay_IENzOkH4gDCuiq','Razorpay','paid',4555.00,5,1,11,'2021-10-27',NULL,NULL),(16,11,'pay_IGE8vBPYPs5y3A','Razorpay','paid',120.00,5,1,11,'2021-11-01',NULL,NULL);
/*!40000 ALTER TABLE `razorpaydetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippingaddress`
--

DROP TABLE IF EXISTS `shippingaddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shippingaddress` (
  `shipping_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `address_line1` varchar(500) NOT NULL,
  `address_line2` varchar(500) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postalcode` bigint(100) NOT NULL,
  `mobilenumber` bigint(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`shipping_id`),
  KEY `user_shipping` (`user_id`),
  CONSTRAINT `user_shipping` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippingaddress`
--

LOCK TABLES `shippingaddress` WRITE;
/*!40000 ALTER TABLE `shippingaddress` DISABLE KEYS */;
INSERT INTO `shippingaddress` VALUES (1,2,'Jyoti','Rajpal','Manik Bagh Road','Palsikar','Indore',452007,5544997788,'jyoti@test.com',0,2,'2021-08-05',2,'2021-08-05'),(2,2,'Jyoti','Rajpal','Manik Bagh Road','','Indore',452007,987654321,'',1,2,'2021-08-05',NULL,NULL),(4,11,'Manjunath','Dhanabal','singapore towers','dubai main road','mumbai',400001,8566522558,'manjunathmj05@gmail.com',0,11,'2021-10-11',NULL,NULL),(5,11,'Manjunath','Dhanabal','singapore towers','dubai main road','mumbai',400001,8056633441,'manjunathmj05@gmail.com',1,11,'2021-10-21',11,'2021-10-21'),(6,11,'Manjunath','Dhanabal','hydrapad tower','singapore road','delhi',400001,8056633441,'manjunathmj05@gmail.com',0,11,'2021-10-21',NULL,NULL),(7,11,'manjunath','dhanabal','26,Bhagya sree colony','vijay nagar','indore',452010,8558558555,'mj89898@gmail.com',1,11,'2021-11-30',NULL,NULL),(8,11,'manjunath','dhanabal','26,Bhagya sree colony','vijay nagar','indore',452010,8558558555,'mj89898@gmail.com',0,11,'2021-11-30',NULL,NULL);
/*!40000 ALTER TABLE `shippingaddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shopping_cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_discount` decimal(10,2) NOT NULL,
  `product_actualprice` decimal(10,2) NOT NULL,
  `product_image` varchar(500) DEFAULT NULL,
  `product_quantity` int(11) NOT NULL,
  `dateAdded` date NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopping_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategory`
--

DROP TABLE IF EXISTS `subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subcategory` (
  `subcategory_id` int(11) NOT NULL AUTO_INCREMENT,
  `subcategory_name` varchar(200) NOT NULL,
  `category_id` int(11) NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`subcategory_id`),
  UNIQUE KEY `subcategory_name` (`subcategory_name`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategory`
--

LOCK TABLES `subcategory` WRITE;
/*!40000 ALTER TABLE `subcategory` DISABLE KEYS */;
INSERT INTO `subcategory` VALUES (1,'Scrub',1,1,1,'2021-07-30',NULL,NULL),(2,'Creams',1,0,1,'2021-07-30',1,'2021-07-30'),(3,'Dairy',1,1,1,'2021-10-01',NULL,NULL),(5,'hair brands',2,1,1,'2021-10-08',1,'2021-10-15');
/*!40000 ALTER TABLE `subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription` (
  `subscription_id` int(11) NOT NULL AUTO_INCREMENT,
  `subscription_email` varchar(255) NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`subscription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
INSERT INTO `subscription` VALUES (1,'test@gmail.com',1,NULL,'2021-09-29',NULL,NULL);
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `shipping_id` int(11) NOT NULL,
  `payment_code` varchar(100) NOT NULL,
  `transactiontype` varchar(100) NOT NULL,
  `paymentmode` varchar(100) NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  KEY `shipping_id` (`shipping_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (3,2,9,1,'Razor','Debit','online',1,2,'2021-09-29',NULL,NULL);
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(500) NOT NULL,
  `user_email` varchar(200) DEFAULT NULL,
  `user_password` varchar(500) DEFAULT NULL,
  `user_mobile` varchar(500) DEFAULT NULL,
  `user_image` varchar(500) DEFAULT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Jyoti Rajpal',NULL,'sha1$246a7214$1$b77b410a12db840d5e60f9c50f0f4e24a8730c03','9406972400',NULL,1,0,'2021-07-24',NULL,NULL),(2,'Jyoti','test@abc.com','sha1$c177fdde$1$56be123c6f2c86f37ca9b6ba4525e25e695cad3f','9988776655','./public/user/contact-bluemenu.png',1,0,'2021-07-24',NULL,'2021-07-24'),(3,'Ram',NULL,'sha1$ce0dd11a$1$1fd7eeb351064c2d5e935a98bcb5be73aa2aa5bd','1234567890','./public/user/potato.png',1,NULL,'2021-07-30',NULL,'2021-07-30'),(4,'Jyoti56',NULL,'sha1$7d74689e$1$e2c31d1a6ebc8c52e6b9430a76d1101a975323e0','9406972400',NULL,1,NULL,'2021-09-24',NULL,NULL),(5,'Manjunath',NULL,'sha1$22098605$1$f62ee2cd7b7bf64b7b16cd4d8a8894640d3b4dc0','8056622113',NULL,1,NULL,'2021-09-27',NULL,NULL),(6,'sakthi',NULL,'sha1$e5dd1dbe$1$1a4ef60d6263a50fbba8fc85b8301dec544c13a1','8695532225',NULL,1,NULL,'2021-09-28',NULL,NULL),(11,'Manjunath Dhanabal','manjunathdhanabal@gmail.com',NULL,NULL,NULL,1,NULL,'2021-10-06',NULL,NULL),(14,'Rishabh Patidar','rishabhpatidar91@gmail.com',NULL,NULL,NULL,1,NULL,'2021-10-25',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wishlist` (
  `wishlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `wishlist_name` varchar(500) NOT NULL,
  `wishlist_description` varchar(500) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `statusId` int(11) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `modifiedById` int(11) DEFAULT NULL,
  `modificationDate` date DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (1,'MyWishList',NULL,11,10,0,11,'2021-12-03',NULL,NULL);
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-04  5:33:38
