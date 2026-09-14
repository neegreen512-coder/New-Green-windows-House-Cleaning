-- Timestamp media so the cleanup cron can age out orphaned uploads safely
-- (only removes ones older than a grace period, never a just-uploaded image).
ALTER TABLE media ADD COLUMN created_at TEXT NOT NULL DEFAULT (datetime('now'));
