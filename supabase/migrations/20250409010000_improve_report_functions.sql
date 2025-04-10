
-- Improve functions to completely avoid recursion issues

-- Function to check if a report is password protected 
CREATE OR REPLACE FUNCTION public.check_shared_content_password(content_id uuid, content_type text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_protected BOOLEAN;
BEGIN
  SELECT (password IS NOT NULL AND password != '')
  INTO is_protected
  FROM shared_content
  WHERE shared_url = content_id
  AND (content_type IS NULL OR content_type = check_shared_content_password.content_type);
  
  RETURN COALESCE(is_protected, FALSE);
END;
$$;

-- Function to verify a content password
CREATE OR REPLACE FUNCTION public.verify_shared_content_password(content_id uuid, content_type text, password_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_valid BOOLEAN;
BEGIN
  SELECT (password = password_param)
  INTO is_valid
  FROM shared_content
  WHERE shared_url = content_id
  AND (content_type IS NULL OR content_type = verify_shared_content_password.content_type);
  
  RETURN COALESCE(is_valid, FALSE);
END;
$$;

-- Add function to log shared content access
CREATE OR REPLACE FUNCTION public.log_shared_content_access(
  content_type text,
  content_id text,
  access_type text,
  successful boolean DEFAULT true,
  error_message text DEFAULT NULL,
  password_attempt boolean DEFAULT false,
  source text DEFAULT 'web_client'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_log_id UUID;
BEGIN
  INSERT INTO shared_content_access_logs (
    content_type,
    content_id,
    access_type,
    successful,
    error_message,
    ip_address,
    user_agent,
    password_attempt,
    source
  ) VALUES (
    content_type,
    content_id,
    access_type,
    successful,
    error_message,
    current_setting('request.headers', true)::json->>'cf-connecting-ip',
    current_setting('request.headers', true)::json->>'user-agent',
    password_attempt,
    source
  )
  RETURNING id INTO new_log_id;
  
  RETURN new_log_id;
END;
$$;
