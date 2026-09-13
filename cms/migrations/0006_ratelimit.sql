-- Rate limiting + brute-force lockout counters.
-- bucket is "<kind>:<ip>", e.g. "quotes:1.2.3.4" or "login:1.2.3.4".
CREATE TABLE IF NOT EXISTS rate_limit (
  bucket       TEXT PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL DEFAULT 0,  -- epoch ms of the current window
  locked_until INTEGER NOT NULL DEFAULT 0   -- epoch ms; used by the login lockout
);
