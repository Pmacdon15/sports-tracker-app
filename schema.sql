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
  remind_workflow_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,  
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, org_id)
);

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  unit_number VARCHAR(100) NOT NULL, 
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'AVAILABLE', 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(unit_number, org_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
  guest_id INTEGER REFERENCES guests(id) ON DELETE SET NULL,  
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
  checked_out_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  checked_in_at TIMESTAMP,
  checked_in_by VARCHAR(40),
   checked_out_by VARCHAR(40),
  status VARCHAR(20) DEFAULT 'OUT'
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) NOT NULL,
  value VARCHAR(255) NOT NULL,  
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(key, org_id)
);

CREATE TABLE IF NOT EXISTS system_features (
  name VARCHAR(255) PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experimental_features (
  -- Added FK constraint (Part of Composite PK)
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
  feature_name VARCHAR(255) REFERENCES system_features(name) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT FALSE,
  api_key TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (org_id, feature_name)
);

CREATE TABLE IF NOT EXISTS unit_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, org_id)
);