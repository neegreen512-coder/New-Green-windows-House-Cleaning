-- Lead capture: quote requests and contact messages.

CREATE TABLE IF NOT EXISTS quotes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  services      TEXT DEFAULT '',
  property_type TEXT DEFAULT '',
  bedrooms      TEXT DEFAULT '',
  bathrooms     TEXT DEFAULT '',
  frequency     TEXT DEFAULT '',
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT DEFAULT '',
  address       TEXT DEFAULT '',
  notes         TEXT DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'new',   -- new | handled
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT DEFAULT '',
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new',   -- new | handled
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
