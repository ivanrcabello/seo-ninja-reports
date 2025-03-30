
-- First, ensure we have the public_reports view set up correctly
DROP VIEW IF EXISTS public_reports;

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

-- Grant proper permissions to the view
GRANT SELECT ON public_reports TO anon, authenticated;

-- Create a policy to allow anonymous access to reports for shared viewing
-- This policy is critical for ensuring reports can be accessed without authentication
DROP POLICY IF EXISTS "Allow public access to shared reports" ON public.reports;

CREATE POLICY "Allow public access to shared reports"
ON public.reports
FOR SELECT
TO anon, authenticated
USING (true);
