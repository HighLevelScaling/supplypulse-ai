CREATE TABLE `alertRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`ruleType` enum('risk_threshold','certification_expiry','financial_change','news_keyword','competitor_switch','custom') NOT NULL,
	`conditions` json NOT NULL,
	`notifyEmail` boolean DEFAULT true,
	`notifySlack` boolean DEFAULT false,
	`notifyInApp` boolean DEFAULT true,
	`appliesTo` enum('all_suppliers','specific_suppliers','supplier_tier') DEFAULT 'all_suppliers',
	`supplierIds` json,
	`supplierTiers` json,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alertRules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`supplierId` int,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`alertType` enum('financial_risk','quality_issue','certification_expiry','news_alert','price_change','supply_disruption','geopolitical','competitor_activity','system') NOT NULL,
	`severity` enum('info','low','medium','high','critical') DEFAULT 'medium',
	`priority` int DEFAULT 50,
	`status` enum('unread','read','acknowledged','resolved','dismissed') DEFAULT 'unread',
	`emailSent` boolean DEFAULT false,
	`slackSent` boolean DEFAULT false,
	`inAppShown` boolean DEFAULT false,
	`sourceUrl` text,
	`metadata` json,
	`triggeredAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100),
	`entityId` int,
	`oldValues` json,
	`newValues` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`tokensUsed` int,
	`modelUsed` varchar(100),
	`relatedSupplierIds` json,
	`relatedAlertIds` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255),
	`context` json,
	`isActive` boolean DEFAULT true,
	`messageCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `competitorSuppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competitorId` int NOT NULL,
	`supplierId` int NOT NULL,
	`relationshipType` enum('confirmed','suspected','former') DEFAULT 'suspected',
	`confidence` int DEFAULT 50,
	`sourceUrl` text,
	`notes` text,
	`discoveredAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `competitorSuppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `competitors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`website` text,
	`description` text,
	`industry` varchar(100),
	`logoUrl` text,
	`isActive` boolean DEFAULT true,
	`lastCheckedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `competitors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`integrationType` enum('slack','email','erp','crm','webhook') NOT NULL,
	`name` varchar(255) NOT NULL,
	`config` json,
	`isActive` boolean DEFAULT true,
	`lastSyncAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `integrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leadActivities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`userId` int,
	`activityType` enum('email_sent','email_opened','email_clicked','call_made','meeting_scheduled','meeting_completed','demo_requested','demo_completed','proposal_sent','contract_sent','page_visit','form_submission','note_added','status_changed') NOT NULL,
	`description` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leadActivities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`company` varchar(255),
	`jobTitle` varchar(255),
	`companySize` varchar(50),
	`industry` varchar(100),
	`country` varchar(100),
	`source` enum('website','demo_request','contact_form','newsletter','referral','linkedin','event','other') DEFAULT 'website',
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`landingPage` text,
	`referrerUrl` text,
	`status` enum('new','contacted','qualified','proposal','negotiation','won','lost') DEFAULT 'new',
	`score` int DEFAULT 0,
	`interestedIn` json,
	`budget` varchar(50),
	`timeline` varchar(50),
	`message` text,
	`notes` text,
	`lastContactedAt` timestamp,
	`nextFollowUpAt` timestamp,
	`assignedTo` int,
	`marketingConsent` boolean DEFAULT false,
	`privacyAccepted` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pageViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`sessionId` varchar(64),
	`pageUrl` text NOT NULL,
	`pageTitle` varchar(255),
	`referrerUrl` text,
	`timeOnPage` int,
	`scrollDepth` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pageViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`reportType` enum('weekly_digest','monthly_summary','supplier_assessment','risk_analysis','competitive_intel','custom') NOT NULL,
	`content` json,
	`summary` text,
	`status` enum('pending','generating','completed','failed') DEFAULT 'pending',
	`generatedAt` timestamp,
	`fileUrl` text,
	`format` enum('pdf','excel','html') DEFAULT 'pdf',
	`isScheduled` boolean DEFAULT false,
	`scheduleFrequency` enum('daily','weekly','monthly','quarterly'),
	`nextScheduledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `riskPredictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`predictionType` enum('bankruptcy','quality_decline','delivery_delay','price_increase','supply_disruption') NOT NULL,
	`probability` decimal(5,4) NOT NULL,
	`confidence` decimal(5,4),
	`timeframe` varchar(50),
	`modelVersion` varchar(50),
	`features` json,
	`actualOutcome` boolean,
	`outcomeDate` timestamp,
	`predictedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `riskPredictions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplierCertifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`certificationName` varchar(255) NOT NULL,
	`certificationBody` varchar(255),
	`certificationType` enum('iso','quality','environmental','safety','industry','other') DEFAULT 'other',
	`certificateNumber` varchar(100),
	`issueDate` timestamp,
	`expiryDate` timestamp,
	`status` enum('valid','expiring_soon','expired','revoked') DEFAULT 'valid',
	`documentUrl` text,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplierCertifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplierContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`jobTitle` varchar(255),
	`department` varchar(100),
	`isPrimary` boolean DEFAULT false,
	`linkedinUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplierContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplierFinancials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`fiscalYear` int NOT NULL,
	`fiscalQuarter` int,
	`revenue` decimal(15,2),
	`grossProfit` decimal(15,2),
	`operatingIncome` decimal(15,2),
	`netIncome` decimal(15,2),
	`totalAssets` decimal(15,2),
	`totalLiabilities` decimal(15,2),
	`totalEquity` decimal(15,2),
	`currentAssets` decimal(15,2),
	`currentLiabilities` decimal(15,2),
	`currentRatio` decimal(8,4),
	`debtToEquity` decimal(8,4),
	`profitMargin` decimal(8,4),
	`dataSource` varchar(100),
	`filingUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplierFinancials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplierNews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`content` text,
	`sourceUrl` text,
	`sourceName` varchar(255),
	`publishedAt` timestamp,
	`sentiment` enum('positive','neutral','negative') DEFAULT 'neutral',
	`sentimentScore` decimal(5,4),
	`category` enum('financial','operational','legal','partnership','product','leadership','other') DEFAULT 'other',
	`relevanceScore` int DEFAULT 50,
	`isAlert` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supplierNews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplierPatents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`patentNumber` varchar(100) NOT NULL,
	`title` text NOT NULL,
	`abstract` text,
	`inventors` json,
	`filingDate` timestamp,
	`grantDate` timestamp,
	`expiryDate` timestamp,
	`patentOffice` varchar(50),
	`status` enum('pending','granted','expired','abandoned') DEFAULT 'granted',
	`classifications` json,
	`patentUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplierPatents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplierRelationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceSupplierId` int NOT NULL,
	`targetSupplierId` int NOT NULL,
	`relationshipType` enum('subsidiary','partner','competitor','customer','vendor','joint_venture') NOT NULL,
	`strength` int DEFAULT 50,
	`description` text,
	`startDate` timestamp,
	`endDate` timestamp,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplierRelationships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`ticker` varchar(20),
	`industry` varchar(100),
	`country` varchar(100),
	`region` varchar(100),
	`website` text,
	`description` text,
	`logoUrl` text,
	`annualRevenue` decimal(15,2),
	`employeeCount` int,
	`foundedYear` int,
	`publicCompany` boolean DEFAULT false,
	`overallRiskScore` int DEFAULT 50,
	`financialRiskScore` int DEFAULT 50,
	`qualityRiskScore` int DEFAULT 50,
	`geopoliticalRiskScore` int DEFAULT 50,
	`operationalRiskScore` int DEFAULT 50,
	`status` enum('active','monitoring','at_risk','critical','inactive') DEFAULT 'active',
	`tier` enum('strategic','preferred','approved','conditional') DEFAULT 'approved',
	`parentSupplierId` int,
	`lastAssessmentDate` timestamp,
	`nextReviewDate` timestamp,
	`tags` json,
	`customFields` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`leadId` int,
	`userId` int,
	`userAgent` text,
	`deviceType` varchar(50),
	`browser` varchar(50),
	`os` varchar(50),
	`ipAddress` varchar(45),
	`country` varchar(100),
	`city` varchar(100),
	`totalSessions` int DEFAULT 1,
	`totalPageViews` int DEFAULT 0,
	`totalTimeOnSite` int DEFAULT 0,
	`firstVisitAt` timestamp NOT NULL DEFAULT (now()),
	`lastVisitAt` timestamp NOT NULL DEFAULT (now()),
	`firstUtmSource` varchar(100),
	`firstUtmMedium` varchar(100),
	`firstUtmCampaign` varchar(100),
	`firstReferrer` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visitors_id` PRIMARY KEY(`id`),
	CONSTRAINT `visitors_visitorId_unique` UNIQUE(`visitorId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `company` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `jobTitle` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `timezone` varchar(64) DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE `users` ADD `notificationPreferences` json;