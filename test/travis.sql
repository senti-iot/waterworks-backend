CREATE TABLE waterworksdev.installation (
	id INT auto_increment NOT NULL,
	uuid varchar(36) NOT NULL,
	address varchar(255) NULL,
	orgUUID VARCHAR(255) NULL,
	state SMALLINT DEFAULT 0 NOT NULL,
	adults SMALLINT NULL,
	children SMALLINT NULL,
	CONSTRAINT `inst_pk` PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_danish_ci;

CREATE INDEX inst_uuid USING BTREE on waterworksdev.installation(`uuid`);



CREATE TABLE waterworksdev.instDevice (
	id INT auto_increment NOT NULL,
	uuid varchar(36) NOT NULL,
	startDate DATETIME NOT NULL,
	endDate DATETIME,
	deviceUUID varchar(36) NOT NULL,
	instUUID varchar(36) NOT NULL,
	CONSTRAINT `instDevice_pk` PRIMARY KEY (id),
	CONSTRAINT `instDevice_installation_fk` FOREIGN KEY (instUUID) references installation(uuid)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_danish_ci;

CREATE INDEX instDevice_uuid USING BTREE on waterworksdev.instDevice(`uuid`);


create table waterworksdev.instUser (
	id INT auto_increment NOT NULL,
	uuid varchar(36) NOT NULL,
	startDate DATETIME NOT NULL,
	endDate DATETIME,
	userUUID varchar(36) NOT NULL,
	instUUID varchar(36) NOT NULL,
	CONSTRAINT `instUser_pk` PRIMARY KEY (id),
	CONSTRAINT `instUser_installation_fk` FOREIGN KEY (instUUID) references installation(uuid)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_danish_ci;

CREATE INDEX instUser_uuid USING BTREE on waterworksdev.instUser(`uuid`);