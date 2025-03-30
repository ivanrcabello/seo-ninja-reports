
-- Add shared_url field to reports table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'reports'
    AND column_name = 'shared_url'
  ) THEN
    ALTER TABLE public.reports
    ADD COLUMN shared_url uuid;
  END IF;
END
$$;

-- Make sure the shared_url field is indexed
CREATE INDEX IF NOT EXISTS reports_shared_url_idx ON public.reports (shared_url);

-- Update public_reports view to include the shared_url field
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
  c.name as client_name,
  c.website as client_website
FROM 
  reports r
LEFT JOIN
  clients c ON r.client_id = c.id;

-- Create or update function to get public reports by shared URL
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
    c.website as client_website,
    r.shared_url,
    r.password
  FROM 
    reports r
  LEFT JOIN
    clients c ON r.client_id = c.id
  WHERE 
    r.shared_url = shared_url_param;
    
  -- Add detailed logging for troubleshooting
  IF NOT FOUND THEN
    RAISE NOTICE 'No report found with shared URL: %', shared_url_param;
  END IF;
END;
$$;

-- Create a view or function for client portal reports that includes the shared_url
CREATE OR REPLACE VIEW client_portal_reports AS
SELECT
  r.id,
  r.title,
  r.created_at,
  r.client_id,
  r.shared_url
FROM
  reports r
WHERE
  r.shared_url IS NOT NULL;

-- Grant permissions to access this view to the client_portal role
GRANT SELECT ON public.client_portal_reports TO anon, authenticated;
