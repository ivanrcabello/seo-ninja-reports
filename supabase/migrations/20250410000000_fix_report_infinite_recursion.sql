
-- This migration fixes the infinite recursion issue in the reports table RLS policies
-- by ensuring all functions accessing reports use the SECURITY DEFINER attribute
-- and properly bypass row level security

-- Create a view for public access to reports that can be used without triggering RLS
CREATE OR REPLACE VIEW public_reports AS
SELECT 
  r.id,
  r.title,
  r.summary,
  r.url,
  r.status,
  r.content,
  r.date,
  r.shared_url,
  r.password,
  r.updated_at,
  r.created_at,
  c.name as client_name,
  c.website as client_website
FROM 
  reports r
JOIN
  clients c ON r.client_id = c.id;

-- Create a function to check if a report exists by shared URL
-- This function is SECURITY DEFINER to avoid RLS recursive checks
CREATE OR REPLACE FUNCTION public.check_report_exists_by_shared_url(shared_url_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public_reports WHERE shared_url = shared_url_param
  );
END;
$$;

-- Function to get report by shared URL - using the public_reports view
-- to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_report_by_shared_url(shared_url_param uuid)
RETURNS TABLE(
  id uuid, 
  title text, 
  summary text, 
  url text, 
  status text, 
  content jsonb, 
  date timestamp with time zone, 
  client_name text, 
  client_website text, 
  shared_url uuid, 
  password text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.title,
    pr.summary,
    pr.url,
    pr.status,
    pr.content,
    pr.date,
    pr.client_name,
    pr.client_website,
    pr.shared_url,
    pr.password
  FROM 
    public_reports pr
  WHERE 
    pr.shared_url = shared_url_param;
END;
$$;

-- Function to check if report is password protected
CREATE OR REPLACE FUNCTION public.check_report_password_protection(report_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_protected boolean;
BEGIN
  SELECT (password IS NOT NULL AND password != '') INTO is_protected
  FROM public_reports
  WHERE id = report_id_param;
  
  RETURN COALESCE(is_protected, false);
END;
$$;

-- Function to check if report is password protected by shared URL
CREATE OR REPLACE FUNCTION public.check_report_password_protection_by_url(shared_url_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_protected boolean;
BEGIN
  SELECT (password IS NOT NULL AND password != '') INTO is_protected
  FROM public_reports
  WHERE shared_url = shared_url_param;
  
  RETURN COALESCE(is_protected, false);
END;
$$;

-- Function to verify a report password
CREATE OR REPLACE FUNCTION public.verify_shared_report_password(report_id_param uuid, password_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  valid boolean;
BEGIN
  SELECT (password = password_param) INTO valid
  FROM public_reports
  WHERE id = report_id_param;
  
  RETURN COALESCE(valid, false);
END;
$$;

-- Function to verify a report password by shared URL
CREATE OR REPLACE FUNCTION public.verify_shared_report_password_by_url(shared_url_param uuid, password_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  valid boolean;
BEGIN
  SELECT (password = password_param) INTO valid
  FROM public_reports
  WHERE shared_url = shared_url_param;
  
  RETURN COALESCE(valid, false);
END;
$$;
