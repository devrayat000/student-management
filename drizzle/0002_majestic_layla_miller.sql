PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_payments` (
	`studentId` integer NOT NULL,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`amount` integer NOT NULL,
	`paymentDate` integer NOT NULL,
	PRIMARY KEY(`studentId`, `month`, `year`),
	FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_payments`("studentId", "month", "year", "amount", "paymentDate") SELECT "studentId", "month", "year", "amount", "paymentDate" FROM `payments`;--> statement-breakpoint
DROP TABLE `payments`;--> statement-breakpoint
ALTER TABLE `__new_payments` RENAME TO `payments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;