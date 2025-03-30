
-- Create a policy to allow anonymous access to public_reports view
CREATE POLICY "Allow public access to public_reports"
ON public.public_reports
FOR SELECT
TO anon, authenticated
USING (true);

-- Create a policy to allow anonymous access to reports for shared viewing
CREATE POLICY "Allow public access to shared reports"
ON public.reports
FOR SELECT
TO anon, authenticated
USING (true);

-- Create a function to check if a report exists by ID
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

-- Ensure public_reports view has proper definition
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
