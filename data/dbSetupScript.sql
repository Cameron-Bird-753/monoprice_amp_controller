CREATE TABLE IF NOT EXISTS "zones" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL DEFAULT 'Zone Name',
	PRIMARY KEY("name")
);

CREATE TABLE IF NOT EXISTS "channels" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT UNIQUE,
	"active"	NUMERIC NOT NULL DEFAULT 0,
	PRIMARY KEY("id")
)

-- Channels Setup Data
INSERT INTO channels 
VALUES (1,"Source 1",0);
INSERT INTO channels 
VALUES (2,"Source 2",0);
INSERT INTO channels 
VALUES (3,"Source 3",0);
INSERT INTO channels 
VALUES (4,"Source 4",0);
INSERT INTO channels 
VALUES (5,"Source 5",0);
INSERT INTO channels 
VALUES (6,"Source 6",0);

-- Zones Setup Data

INSERT INTO zones 
VALUES (11,"Zone 11");
INSERT INTO zones 
VALUES (12,"Zone 12");
INSERT INTO zones 
VALUES (13,"Zone 13");
INSERT INTO zones 
VALUES (14,"Zone 14");
INSERT INTO zones 
VALUES (15,"Zone 15");
INSERT INTO zones 
VALUES (16,"Zone 16");