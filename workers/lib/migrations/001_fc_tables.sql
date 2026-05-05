-- FC tables extending the existing nac-os-licenses D1 database

CREATE TABLE IF NOT EXISTS fc_license_mapping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_id TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL,
  client_page_id TEXT NOT NULL,
  sites_db_id TEXT NOT NULL,
  photos_db_id TEXT NOT NULL,
  inspections_db_id TEXT NOT NULL,
  workers_db_id TEXT NOT NULL,
  reports_db_id TEXT NOT NULL,
  checklists_db_id TEXT NOT NULL,
  style_samples_db_id TEXT,
  provisioned_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fc_idempotency (
  key TEXT PRIMARY KEY,
  result TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fc_audit_index (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id TEXT NOT NULL,
  report_notion_page_id TEXT NOT NULL,
  pdf_hash TEXT NOT NULL,
  locked_at TEXT NOT NULL,
  license_id TEXT NOT NULL,
  site_id TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fc_audit_license ON fc_audit_index(license_id);
CREATE INDEX IF NOT EXISTS idx_fc_idempotency_created ON fc_idempotency(created_at);
