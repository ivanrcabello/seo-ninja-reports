
-- Create a function to ensure the settings table exists
CREATE OR REPLACE FUNCTION create_settings_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the settings table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'settings'
  ) THEN
    -- Create the settings table
    CREATE TABLE public.settings (
      id BIGINT PRIMARY KEY,
      logo_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Insert default record
    INSERT INTO public.settings (id, logo_url) VALUES (1, NULL);
    
    -- Add RLS policies
    ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for authenticated users
    CREATE POLICY "Allow full access to authenticated users" ON public.settings
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END;
$$;

-- Execute the function to ensure the settings table exists
SELECT create_settings_table_if_not_exists();
