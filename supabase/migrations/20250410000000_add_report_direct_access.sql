
-- Create a new RPC function to get report by any ID (report ID or shared URL)
CREATE OR REPLACE FUNCTION public.get_report_by_any_id(id_param TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  report_data jsonb;
BEGIN
  -- First try by direct ID
  SELECT 
    jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'summary', r.summary,
      'url', r.url,
      'status', r.status,
      'content', r.content,
      'date', r.date,
      'client_name', c.name,
      'client_website', c.website
    ) INTO report_data
  FROM 
    reports r
  LEFT JOIN
    clients c ON r.client_id = c.id
  WHERE 
    r.id::TEXT = id_param
  LIMIT 1;
  
  -- If not found, try by shared_url
  IF report_data IS NULL THEN
    SELECT 
      jsonb_build_object(
        'id', r.id,
        'title', r.title,
        'summary', r.summary,
        'url', r.url,
        'status', r.status,
        'content', r.content,
        'date', r.date,
        'client_name', c.name,
        'client_website', c.website
      ) INTO report_data
    FROM 
      reports r
    LEFT JOIN
      clients c ON r.client_id = c.id
    WHERE 
      r.shared_url = id_param
    LIMIT 1;
  END IF;
  
  RETURN report_data;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.get_report_by_any_id TO anon, authenticated;
