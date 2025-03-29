
-- Create or replace view for public invoices to ensure shared invoices are accessible
CREATE OR REPLACE VIEW public_invoices AS
SELECT 
  ci.id,
  ci.title,
  ci.description,
  ci.amount,
  ci.status,
  ci.due_date,
  ci.payment_method,
  ci.payment_date,
  ci.payment_instructions,
  ci.shared_url,
  ci.created_at,
  ci.updated_at,
  c.name as client_name,
  c.website as client_website
FROM 
  client_invoices ci
JOIN
  clients c ON ci.client_id = c.id
WHERE 
  ci.shared_url IS NOT NULL;

-- Create or replace view for public reports to ensure shared reports are accessible
CREATE OR REPLACE VIEW public_reports AS
SELECT 
  r.id,
  r.title,
  r.summary,
  r.url,
  r.status,
  r.content,
  r.date,
  c.name as client_name,
  c.website as client_website
FROM 
  reports r
JOIN
  clients c ON r.client_id = c.id;

-- Create or replace view for public contracts
CREATE OR REPLACE VIEW public_contracts AS
SELECT 
  cc.id,
  cc.title,
  cc.content,
  c.name as client_name,
  c.website as client_website,
  cc.status,
  cc.created_at,
  cc.updated_at,
  cc.client_signed,
  cc.client_signed_at,
  cc.client_signature,
  cc.admin_signed,
  cc.admin_signed_at,
  cc.admin_signature,
  cc.shared_url
FROM 
  client_contracts cc
JOIN
  clients c ON cc.client_id = c.id
WHERE 
  cc.shared_url IS NOT NULL;

-- Create or replace view for public proposals
CREATE OR REPLACE VIEW public_proposals AS
SELECT 
  cp.id,
  cp.title,
  cp.description,
  cp.services,
  cp.status,
  cp.price,
  cp.shared_url,
  cp.created_at,
  cp.updated_at,
  c.name as client_name,
  c.website as client_website
FROM 
  client_proposals cp
JOIN
  clients c ON cp.client_id = c.id
WHERE 
  cp.shared_url IS NOT NULL;
