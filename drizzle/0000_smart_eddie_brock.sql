CREATE TABLE `batches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY NOT NULL,
	`studentId` integer NOT NULL,
	`month` integer NOT NULL,
	`amount` integer NOT NULL,
	`paymentDate` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`classId` integer,
	`batchId` integer,
	`phone` text NOT NULL
);
