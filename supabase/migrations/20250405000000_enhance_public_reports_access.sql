
-- Create an improved check_report_exists function with better error handling
CREATE OR REPLACE FUNCTION public.check_report_exists(report_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  report_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM reports WHERE id = report_id_param
  ) INTO report_exists;
  
  RETURN COALESCE(report_exists, false);
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error checking if report exists: %', SQLERRM;
    RETURN false;
END;
$$;

-- Create a more robust function to get public report by ID
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
  LEFT JOIN
    clients c ON r.client_id = c.id
  WHERE 
    r.id = report_id_param;
    
  -- Add detailed logging for troubleshooting
  IF NOT FOUND THEN
    RAISE NOTICE 'No report found with ID: %', report_id_param;
  END IF;
END;
$$;

-- Ensure the public_reports view uses LEFT JOIN for better data retrieval
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
LEFT JOIN
  clients c ON r.client_id = c.id;

-- Grant explicit permissions to anonymous users to access reports and views
GRANT SELECT ON public.reports TO anon, authenticated;
GRANT SELECT ON public.public_reports TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_report_exists TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_report_by_id TO anon, authenticated;
