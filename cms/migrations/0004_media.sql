-- Image storage in D1 (no R2 needed). Photos are resized client-side, kept small.

CREATE TABLE IF NOT EXISTS media (
  id          TEXT PRIMARY KEY,
  mime        TEXT NOT NULL,
  data        BLOB NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Reviewer photo already exists as `avatar`; add house photos (JSON array of urls).
ALTER TABLE reviews ADD COLUMN photos TEXT DEFAULT '[]';

-- Package media image (a /media/<id> url).
ALTER TABLE pricing ADD COLUMN image TEXT DEFAULT '';
