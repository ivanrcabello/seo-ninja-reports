
-- Drop and recreate the public_reports view to ensure it's defined correctly
DROP VIEW IF EXISTS public_reports;

CREATE VIEW public_reports AS
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

-- Grant proper permissions to the view
GRANT SELECT ON public_reports TO anon, authenticated;

-- Create policy to allow public access to reports table itself
DROP POLICY IF EXISTS "Allow public access to shared reports" ON public.reports;

CREATE POLICY "Allow public access to shared reports"
ON public.reports
FOR SELECT
TO anon, authenticated
USING (true);

-- Create a robust check_report_exists function
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
  
  RETURN report_exists;
END;
$$;
