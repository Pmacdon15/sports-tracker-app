DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS experimental_features;
DROP TABLE IF EXISTS system_features;
DROP TABLE IF EXISTS organizations;

CREATE TABLE IF NOT EXISTS organizations (
  org_id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  equipment_limit INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, org_id)
);

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- e.g., 'Raft', 'Bike'
  unit_number VARCHAR(100) NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'CHECKED_OUT', 'RETIRED'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(unit_number, org_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER REFERENCES equipment(id),
  guest_id INTEGER REFERENCES guests(id),
  org_id VARCHAR(255) NOT NULL,
  checked_out_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  checked_in_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'OUT' -- 'OUT', 'RETURNED'
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) NOT NULL,
  value VARCHAR(255) NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(key, org_id)
);

CREATE TABLE IF NOT EXISTS system_features (
  name VARCHAR(255) PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experimental_features (
  org_id VARCHAR(255) NOT NULL,
  feature_name VARCHAR(255) REFERENCES system_features(name),
  is_enabled BOOLEAN DEFAULT FALSE,
  api_key TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (org_id, feature_name)
);

-- Seed system features
INSERT INTO system_features (name, description) VALUES ('test', 'A test feature for development.') ON CONFLICT DO NOTHING;
