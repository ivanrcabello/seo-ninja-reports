
-- Create a table for tracking access to shared content
CREATE TABLE IF NOT EXISTS public.shared_content_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL, -- 'report', 'invoice', 'proposal', 'contract'
  content_id UUID NOT NULL,
  access_type TEXT NOT NULL, -- 'view', 'print', 'download', 'password', 'not_found', 'error', etc.
  access_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  successful BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  password_attempt BOOLEAN NOT NULL DEFAULT false,
  source TEXT
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS shared_content_access_logs_content_id_idx ON public.shared_content_access_logs(content_id);
CREATE INDEX IF NOT EXISTS shared_content_access_logs_content_type_idx ON public.shared_content_access_logs(content_type);
CREATE INDEX IF NOT EXISTS shared_content_access_logs_access_time_idx ON public.shared_content_access_logs(access_time);

-- Grant access permissions to authenticated users
ALTER TABLE public.shared_content_access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert for authenticated users" ON public.shared_content_access_logs FOR INSERT TO authenticated USING (true);
CREATE POLICY "Allow select for authenticated users" ON public.shared_content_access_logs FOR SELECT TO authenticated USING (true);

-- Create function to get report access stats
CREATE OR REPLACE FUNCTION public.get_report_access_stats(report_id_param UUID)
RETURNS TABLE(
  total_views INT,
  total_prints INT,
  total_downloads INT,
  last_accessed TIMESTAMP WITH TIME ZONE,
  password_attempts INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE access_type = 'view' AND successful = true)::INT as total_views,
    COUNT(*) FILTER (WHERE access_type = 'print' AND successful = true)::INT as total_prints,
    COUNT(*) FILTER (WHERE access_type = 'download' AND successful = true)::INT as total_downloads,
    MAX(access_time) as last_accessed,
    COUNT(*) FILTER (WHERE password_attempt = true)::INT as password_attempts
  FROM 
    shared_content_access_logs
  WHERE 
    content_id = report_id_param AND
    content_type = 'report';
END;
$$;
