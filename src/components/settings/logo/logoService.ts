
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates the settings table if it doesn't exist
 */
export const createSettingsTableIfNeeded = async (): Promise<void> => {
  try {
    // Create the settings table if it doesn't exist
    const { data, error } = await supabase.rpc(
      'create_settings_table_if_not_exists',
      {} // Empty object for the parameters
    );
    
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
    await createSettingsTableIfNeeded();
    
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
  try {
    // Upload file to Supabase storage
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('logos') 
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
    
    // Get public URL
    const { data: publicURL } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);
    
    if (!publicURL) {
      throw new Error('Could not get public URL for uploaded logo');
    }
    
    console.log('Logo uploaded successfully:', publicURL.publicUrl);
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Logo upload failed:', error);
    throw error;
  }
};

/**
 * Updates the logo URL in the settings table
 */
export const updateLogoInSettings = async (logoUrl: string | null): Promise<void> => {
  try {
    // Ensure settings table exists
    await createSettingsTableIfNeeded();
    
    // Check if settings record exists
    const { count, error: countError } = await supabase
      .from('settings')
      .select('*', { count: 'exact', head: true });
      
    if (countError || count === 0) {
      console.log('Creating settings record...');
      await createSettingsRecord();
    }
    
    // Save URL to settings table
    const { error: updateError } = await supabase
      .from('settings')
      .upsert({ id: 1, logo_url: logoUrl })
      .select();
    
    if (updateError) {
      console.error('Error updating logo in settings:', updateError);
      throw updateError;
    }
    
    console.log('Logo URL updated in settings:', logoUrl);
  } catch (error) {
    console.error('Error updating logo in settings:', error);
    throw error;
  }
};
