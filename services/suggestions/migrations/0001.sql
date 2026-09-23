CREATE TABLE suggestions (
  id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt INTEGER NOT NULL DEFAULT 0,
  lease_until INTEGER NOT NULL DEFAULT 0,
  github_number INTEGER,
  github_kind TEXT,
  message TEXT
);
CREATE INDEX suggestions_delivery ON suggestions(status, next_attempt, lease_until);
CREATE INDEX suggestions_github ON suggestions(github_number);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires_at INTEGER NOT NULL);
