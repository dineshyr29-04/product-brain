-- ProductBrain V1 Full Supabase PostgreSQL Schema with Auth & Persona Roles

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Auth Users & Roles Table
CREATE TABLE IF NOT EXISTS auth_users (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('pm', 'sales', 'engineering')) DEFAULT 'pm',
  title TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  arr NUMERIC NOT NULL DEFAULT 0,
  account_owner TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  ticket_number SERIAL,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
  status TEXT CHECK (status IN ('Open', 'In Progress', 'Blocked', 'Resolved')) DEFAULT 'Open',
  category TEXT DEFAULT 'General',
  resolution_note TEXT,
  ai_customer_summary TEXT,
  technical_logs TEXT,
  import_batch_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 6. Product Opportunities Table
CREATE TABLE IF NOT EXISTS product_opportunities (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ticket_count INTEGER DEFAULT 0,
  customer_count INTEGER DEFAULT 0,
  affected_arr NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('Detected', 'PRD Created', 'In Roadmap')) DEFAULT 'Detected',
  prd_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Batch Imports & Document OCR Log Table
CREATE TABLE IF NOT EXISTS batch_imports (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  file_name TEXT NOT NULL,
  total_tickets_extracted INTEGER DEFAULT 0,
  raw_document_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Initial Seed Data
INSERT INTO auth_users (id, email, password_hash, full_name, role, title, avatar_url) VALUES
  ('usr-pm', 'sarah.pm@productbrain.io', '$2a$10$X8zY9z...', 'Sarah Jenkins', 'pm', 'Principal Product Manager', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
  ('usr-sales', 'michael.sales@productbrain.io', '$2a$10$X8zY9z...', 'Michael Chang', 'sales', 'VP Enterprise Sales', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('usr-eng', 'alex.eng@productbrain.io', '$2a$10$X8zY9z...', 'Alex Rivera', 'engineering', 'Staff Engineering Lead', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, name, arr, account_owner) VALUES
  ('cust-1', 'Acme Corp', 420000, 'Sarah Jenkins'),
  ('cust-2', 'Gamma Ltd', 750000, 'Michael Chang'),
  ('cust-3', 'Beta Inc', 180000, 'Elena Rostova'),
  ('cust-4', 'Delta Global', 520000, 'David Kim'),
  ('cust-5', 'Epsilon Tech', 310000, 'Sarah Jenkins')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name) VALUES
  ('prod-1', 'Product A (Core Platform)'),
  ('prod-2', 'Product B (Analytics Hub)'),
  ('prod-3', 'Product C (Integrations API)')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tickets (id, customer_id, product_id, title, description, priority, status, category, resolution_note, ai_customer_summary, technical_logs) VALUES
  ('tick-1024', 'cust-1', 'prod-1', 'Export is failing for large datasets', 'Query timeout occurs whenever exporting CSV reports > 50MB.', 'High', 'In Progress', 'Export Performance', NULL, NULL, 'QueryTimeoutException: connection closed after 30000ms at postgres.driver.js:142'),
  ('tick-1025', 'cust-3', 'prod-1', 'Login timeout on SSO redirect', 'SAML SSO authentication hangs on step 2 for enterprise users.', 'Medium', 'Open', 'Login Problems', NULL, NULL, 'SSOAuthError: SAML metadata validation failed for entityID https://sso.beta.com'),
  ('tick-1026', 'cust-2', 'prod-3', 'API Gateway rate-limiting failure', '502 Bad Gateway during peak hour payload bursts.', 'Critical', 'Resolved', 'API Reliability', 'Increased query timeout threshold and optimized database indexes.', 'The API Gateway export query timeout issue has been resolved by our engineering team.', '502 Bad Gateway: Upstream connection pool exhausted at gateway_lb.c:89'),
  ('tick-1027', 'cust-4', 'prod-1', 'Export memory leak during batch download', 'Server OOM crash when 3 users trigger export simultaneously.', 'High', 'Open', 'Export Performance', NULL, NULL, 'FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory'),
  ('tick-1028', 'cust-5', 'prod-2', 'Analytics dashboard chart rendering lag', 'Canvas takes 12s to render time-series widget.', 'Medium', 'Open', 'Dashboard Lag', NULL, NULL, 'Performance Warning: DOM layout reflow took 12,400ms on recharts_container.jsx')
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_opportunities (id, title, product_id, ticket_count, customer_count, affected_arr, status, prd_content) VALUES
  ('opp-1', 'Export Performance & Streaming Infrastructure', 'prod-1', 23, 17, 3200000, 'Detected', NULL),
  ('opp-2', 'API Gateway Reliability & Rate Limiting Engine', 'prod-3', 14, 9, 1100000, 'Detected', NULL)
ON CONFLICT (id) DO NOTHING;
