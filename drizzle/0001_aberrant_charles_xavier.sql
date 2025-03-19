PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_payments` (
	`id` integer PRIMARY KEY NOT NULL,
	`studentId` integer NOT NULL,
	`month` integer NOT NULL,
	`amount` integer NOT NULL,
	`paymentDate` integer NOT NULL,
	FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_payments`("id", "studentId", "month", "amount", "paymentDate") SELECT "id", "studentId", "month", "amount", "paymentDate" FROM `payments`;--> statement-breakpoint
DROP TABLE `payments`;--> statement-breakpoint
ALTER TABLE `__new_payments` RENAME TO `payments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_students` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`classId` integer,
	`batchId` integer,
	`phone` text NOT NULL,
	FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`batchId`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_students`("id", "name", "classId", "batchId", "phone") SELECT "id", "name", "classId", "batchId", "phone" FROM `students`;--> statement-breakpoint
DROP TABLE `students`;--> statement-breakpoint
ALTER TABLE `__new_students` RENAME TO `students`;