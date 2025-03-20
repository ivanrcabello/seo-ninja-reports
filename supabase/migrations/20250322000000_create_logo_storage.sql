
-- Create a logos storage bucket if it doesn't exist
DO $$
BEGIN
  -- Check if the bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'logos'
  ) THEN
    -- Insert the logos bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('logos', 'Logos', true);
    
    -- Create a policy to allow public access to read logos
    INSERT INTO storage.policies (name, definition, bucket_id, action)
    VALUES ('Public Read Access', '()', 'logos', 'SELECT');
    
    -- Create a policy to allow authenticated users to upload logos
    INSERT INTO storage.policies (name, definition, bucket_id, action)
    VALUES ('Auth Upload Access', '(auth.role() = ''authenticated'')', 'logos', 'INSERT');
    
    -- Create a policy to allow authenticated users to update logos
    INSERT INTO storage.policies (name, definition, bucket_id, action)
    VALUES ('Auth Update Access', '(auth.role() = ''authenticated'')', 'logos', 'UPDATE');
    
    -- Create a policy to allow authenticated users to delete logos
    INSERT INTO storage.policies (name, definition, bucket_id, action)
    VALUES ('Auth Delete Access', '(auth.role() = ''authenticated'')', 'logos', 'DELETE');
  END IF;
END
$$;

-- Create or update the create_settings_table_if_not_exists function
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
      openai_key TEXT,
      google_key TEXT,
      default_prompt TEXT,
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
