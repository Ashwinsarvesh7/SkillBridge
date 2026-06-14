-- Flyway migration: Add audit and admin metadata columns to users
-- Runbook: apply this migration in your test/staging DB before production.

-- Add user metadata fields used by admin UI and audit logging
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `disabled_by` VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `disabled_date` DATETIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `disabled_reason` TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `last_login` DATETIME DEFAULT NULL;

-- Ensure activity_log table exists (used for audit logs)
CREATE TABLE IF NOT EXISTS `activity_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `actor` VARCHAR(255) NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notes:
-- 1) This file is Flyway-compatible when Flyway is configured to read
--    SQL migrations from `classpath:db/migration`.
-- 2) If you use Liquibase or direct JDBC migration in production, convert
--    the above statements to your chosen migration format.