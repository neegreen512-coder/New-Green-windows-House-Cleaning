-- New Green CMS schema

CREATE TABLE IF NOT EXISTS reviews (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  context     TEXT DEFAULT '',
  service     TEXT DEFAULT '',
  quote       TEXT NOT NULL,
  rating      INTEGER DEFAULT 5,
  status      TEXT NOT NULL DEFAULT 'pending',   -- pending | approved
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

CREATE TABLE IF NOT EXISTS pricing (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  blurb       TEXT DEFAULT '',
  price       TEXT DEFAULT '',                   -- free-text, e.g. "From $149"
  unit        TEXT DEFAULT '',                   -- e.g. "per visit"
  features    TEXT DEFAULT '[]',                 -- JSON array of strings
  featured    INTEGER DEFAULT 0,
  sort        INTEGER DEFAULT 0,
  active      INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS content (
  key         TEXT PRIMARY KEY,
  value       TEXT DEFAULT ''
);
