
-- Create or replace a function to get public report data by report ID
-- This fixes the issue with single row requirement for reports
CREATE OR REPLACE FUNCTION public.get_public_report_by_id(report_id_param uuid)
RETURNS TABLE(
  id uuid, 
  title text, 
  summary text,
  url text,
  status text,
  content jsonb,
  date timestamp with time zone,
  client_name text,
  client_website text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
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
    clients c ON r.client_id = c.id
  WHERE 
    r.id = report_id_param;
END;
$$;
