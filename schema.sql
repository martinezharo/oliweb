-- Cloudflare D1 schema for oliweb
-- Apply locally:  wrangler d1 execute oliweb --local --file=./schema.sql
-- Apply remote:   wrangler d1 execute oliweb --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  content_es  TEXT NOT NULL,
  content_en  TEXT NOT NULL,
  -- JSON-encoded array of image URLs (e.g. '["/a.png","/b.png"]')
  image_urls  TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id                    TEXT PRIMARY KEY,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  slug                  TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  -- stored as 0/1
  is_active             INTEGER,
  start_date            TEXT,
  end_date              TEXT,
  url                   TEXT,
  logo_url              TEXT,
  short_description_es  TEXT,
  short_description_en  TEXT,
  history_es            TEXT,
  history_en            TEXT
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
