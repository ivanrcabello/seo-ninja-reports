
-- Create RPC function to create a public report
CREATE OR REPLACE FUNCTION public.create_public_report(
  report_id_param UUID,
  title_param TEXT,
  summary_param TEXT,
  url_param TEXT,
  status_param TEXT,
  content_param JSONB,
  date_param TIMESTAMP WITH TIME ZONE,
  shared_url_param UUID,
  password_param TEXT,
  client_name_param TEXT,
  client_website_param TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Check if entry already exists
  SELECT id INTO new_id FROM public_reports
  WHERE shared_url = shared_url_param;
  
  -- If it exists, update it
  IF FOUND THEN
    UPDATE public_reports
    SET
      title = title_param,
      summary = summary_param,
      url = url_param,
      status = status_param,
      content = content_param,
      date = date_param,
      password = password_param,
      client_name = client_name_param,
      client_website = client_website_param
    WHERE shared_url = shared_url_param;
  -- Otherwise insert a new record
  ELSE
    INSERT INTO public_reports (
      id,
      title,
      summary,
      url,
      status,
      content,
      date,
      shared_url,
      password,
      client_name,
      client_website
    ) VALUES (
      report_id_param,
      title_param,
      summary_param,
      url_param,
      status_param,
      content_param,
      date_param,
      shared_url_param,
      password_param,
      client_name_param,
      client_website_param
    )
    RETURNING id INTO new_id;
  END IF;
  
  RETURN new_id;
END;
$$;

-- Create RPC function to update public report password
CREATE OR REPLACE FUNCTION public.update_public_report_password(
  shared_url_param UUID,
  password_param TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public_reports
  SET password = password_param
  WHERE shared_url = shared_url_param;
  
  RETURN FOUND;
END;
$$;

-- Create RPC function for access logging
CREATE OR REPLACE FUNCTION public.log_content_access(
  content_type_param TEXT,
  content_id_param TEXT,
  access_type_param TEXT,
  successful_param BOOLEAN DEFAULT TRUE,
  error_message_param TEXT DEFAULT NULL,
  password_attempt_param BOOLEAN DEFAULT FALSE,
  source_param TEXT DEFAULT 'web_client'
)
RETURNS UUID
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
    content_type_param,
    content_id_param,
    access_type_param,
    successful_param,
    error_message_param,
    NULL, -- IP is handled on server side for security
    current_setting('request.headers', true)::json->>'user-agent',
    password_attempt_param,
    source_param
  )
  RETURNING id INTO new_log_id;
  
  RETURN new_log_id;
END;
$$;
