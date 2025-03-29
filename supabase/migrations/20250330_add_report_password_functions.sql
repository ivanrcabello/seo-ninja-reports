
-- Function to check if a report is password protected
CREATE OR REPLACE FUNCTION public.check_report_password_protection(report_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_protected BOOLEAN;
BEGIN
  SELECT (password IS NOT NULL AND password != '') INTO is_protected
  FROM reports
  WHERE id = report_id_param;
  
  RETURN COALESCE(is_protected, FALSE);
END;
$$;

-- Function to verify a report password
CREATE OR REPLACE FUNCTION public.verify_shared_report_password(report_id_param UUID, password_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  valid BOOLEAN;
BEGIN
  SELECT (password = password_param) INTO valid
  FROM reports
  WHERE id = report_id_param;
  
  RETURN COALESCE(valid, FALSE);
END;
$$;
