CREATE DATABASE `waterworksdev` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_danish_ci */;


CREATE TABLE waterworksdev.`installation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_danish_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_danish_ci DEFAULT NULL,
  `orgUUID` varchar(255) COLLATE utf8mb4_danish_ci DEFAULT NULL,
  `state` smallint(6) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `operation` tinyint(1) NOT NULL DEFAULT '0',
  `moving` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `inst_uuid` (`uuid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_danish_ci;



-- waterworksdev.instDevice definition

CREATE TABLE waterworksdev.`instDevice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_danish_ci NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `deviceUUID` varchar(36) COLLATE utf8mb4_danish_ci NOT NULL,
  `instUUID` varchar(36) COLLATE utf8mb4_danish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `instDevice_installation_fk` (`instUUID`),
  KEY `instDevice_uuid` (`uuid`) USING BTREE,
  CONSTRAINT `instDevice_installation_fk` FOREIGN KEY (`instUUID`) REFERENCES `installation` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_danish_ci;

-- waterworksdev.instUser definition

CREATE TABLE waterworksdev.`instUser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_danish_ci NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `userUUID` varchar(36) COLLATE utf8mb4_danish_ci NOT NULL,
  `instUUID` varchar(36) COLLATE utf8mb4_danish_ci NOT NULL,
  `adults` int(11) NOT NULL DEFAULT '1',
  `children` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `instUser_installation_fk` (`instUUID`),
  KEY `instUser_uuid` (`uuid`) USING BTREE,
  CONSTRAINT `instUser_installation_fk` FOREIGN KEY (`instUUID`) REFERENCES `installation` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_danish_ci;
