
-- Function to check if a report is password protected
CREATE OR REPLACE FUNCTION public.check_report_password_protection(report_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_protected boolean;
BEGIN
  SELECT (password IS NOT NULL AND password != '') INTO is_protected
  FROM reports
  WHERE id = report_id_param;
  
  RETURN COALESCE(is_protected, false);
END;
$$;

-- Function to verify a report password
CREATE OR REPLACE FUNCTION public.verify_shared_report_password(report_id_param uuid, password_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  valid boolean;
BEGIN
  SELECT (password = password_param) INTO valid
  FROM reports
  WHERE id = report_id_param;
  
  RETURN COALESCE(valid, false);
END;
$$;
