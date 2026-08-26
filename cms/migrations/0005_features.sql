-- New Green CMS — feature set: blog, gallery, review ordering, lead notes.

-- Owner-managed blog posts.
CREATE TABLE IF NOT EXISTS posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  excerpt     TEXT DEFAULT '',
  body        TEXT DEFAULT '',                 -- paragraphs split by blank lines; "## " = heading
  cover       TEXT DEFAULT '',                 -- image url (/media/<id> or absolute)
  tag         TEXT DEFAULT '',
  read_min    INTEGER DEFAULT 4,
  published   INTEGER DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);

-- Before / after gallery of real jobs.
CREATE TABLE IF NOT EXISTS gallery (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  before_url  TEXT DEFAULT '',
  after_url   TEXT DEFAULT '',
  caption     TEXT DEFAULT '',
  service     TEXT DEFAULT '',
  sort        INTEGER DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Reviews: manual ordering + a "featured" flag so the owner can pin favourites.
ALTER TABLE reviews ADD COLUMN sort INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN featured INTEGER DEFAULT 0;

-- Leads: private owner notes (the visitor `notes` on quotes stays separate).
ALTER TABLE quotes ADD COLUMN admin_notes TEXT DEFAULT '';
ALTER TABLE messages ADD COLUMN admin_notes TEXT DEFAULT '';
