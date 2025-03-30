
-- Create table for tracking access to shared reports
CREATE TABLE IF NOT EXISTS public.shared_report_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  is_password_attempt BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  access_source TEXT,
  action_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on report_id for better query performance
CREATE INDEX IF NOT EXISTS shared_report_access_logs_report_id_idx 
  ON public.shared_report_access_logs (report_id);

-- Create index on timestamp for better sorting and filtering
CREATE INDEX IF NOT EXISTS shared_report_access_logs_timestamp_idx 
  ON public.shared_report_access_logs (timestamp);

-- Enable Row Level Security
ALTER TABLE public.shared_report_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read logs
CREATE POLICY "Allow authenticated users to read access logs"
  ON public.shared_report_access_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow all users to insert logs
CREATE POLICY "Allow all users to insert access logs"
  ON public.shared_report_access_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Grant permission to use the table
GRANT SELECT, INSERT ON public.shared_report_access_logs TO anon, authenticated;
