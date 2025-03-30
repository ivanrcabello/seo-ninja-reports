
-- Drop and recreate the check_report_exists function to fix return type issues
CREATE OR REPLACE FUNCTION public.check_report_exists(report_id_param uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  report_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM reports WHERE id = report_id_param
  ) INTO report_exists;
  
  RETURN json_build_object('exists', COALESCE(report_exists, false));
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error checking if report exists: %', SQLERRM;
    RETURN json_build_object('exists', false);
END;
$$;

-- Also fix the get_public_report_by_id function to ensure it returns an array
CREATE OR REPLACE FUNCTION public.get_public_report_by_id(report_id_param uuid)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', r.id,
      'title', r.title,
      'summary', r.summary,
      'url', r.url,
      'status', r.status,
      'content', r.content,
      'date', r.date,
      'client_name', c.name,
      'client_website', c.website
    )
  FROM 
    reports r
  LEFT JOIN
    clients c ON r.client_id = c.id
  WHERE 
    r.id = report_id_param;
END;
$$;
