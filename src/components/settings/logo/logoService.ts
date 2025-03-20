import { supabase } from '@/integrations/supabase/client';

/**
 * Creates the settings table if it doesn't exist
 */
export const createSettingsTableIfNeeded = async (): Promise<void> => {
  try {
    // Create the settings table if it doesn't exist
    const { error } = await supabase.rpc('create_settings_table_if_not_exists');
    
    if (error) {
      console.error('Error creating settings table:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating settings table:', error);
    throw error;
  }
};

/**
 * Creates a default settings record if none exists
 */
export const createSettingsRecord = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('settings')
      .insert({ id: 1, logo_url: null })
      .select();
      
    if (error) {
      console.error('Error creating settings record:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating settings record:', error);
    throw error;
  }
};

/**
 * Fetches the logo URL from the settings table
 */
export const fetchLogoFromSettings = async (): Promise<string | null> => {
  try {
    // Check if settings table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('settings')
      .select('count(*)', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('Error checking settings table:', tableError);
      // Create settings table if it doesn't exist
      await createSettingsTableIfNeeded();
      return null;
    }
    
    const { data, error } = await supabase
      .from('settings')
      .select('logo_url')
      .eq('id', 1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No settings record, create one
        await createSettingsRecord();
      } else {
        console.error('Error fetching logo:', error);
      }
      return null;
    }
    
    return data?.logo_url || null;
  } catch (error) {
    console.error('Error fetching logo:', error);
    return null;
  }
};

/**
 * Uploads the logo file to Supabase storage
 */
export const uploadLogoToStorage = async (file: File): Promise<string> => {
  // Upload file to Supabase storage
  const fileExt = file.name.split('.').pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('blog_images') // Using the same bucket we created for blog images
    .upload(fileName, file);
  
  if (error) {
    throw error;
  }
  
  // Get public URL
  const { data: publicURL } = supabase.storage
    .from('blog_images')
    .getPublicUrl(fileName);
  
  if (!publicURL) {
    throw new Error('Could not get public URL for uploaded logo');
  }
  
  return publicURL.publicUrl;
};

/**
 * Updates the logo URL in the settings table
 */
export const updateLogoInSettings = async (logoUrl: string | null): Promise<void> => {
  // Check if settings table has data
  const { count, error: countError } = await supabase
    .from('settings')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error('Error checking settings count:', countError);
    await createSettingsRecord();
  }
  
  // Save URL to settings table
  const { error: updateError } = await supabase
    .from('settings')
    .upsert({ id: 1, logo_url: logoUrl })
    .select();
  
  if (updateError) {
    throw updateError;
  }
};
