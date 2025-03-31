
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if content exists (works for all content types)
 */
export const checkContentExists = async (contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract'): Promise<{ exists: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('check_content_exists', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) throw error;
    
    return { exists: data, error: null };
  } catch (err: any) {
    console.error(`Error checking if ${contentType} exists:`, err);
    return { exists: false, error: err };
  }
};

/**
 * Check if content is password protected (works for all content types)
 */
export const checkContentPasswordProtection = async (contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract'): Promise<{ isProtected: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('check_content_password_protected', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) throw error;
    
    return { isProtected: data, error: null };
  } catch (err: any) {
    console.error(`Error checking if ${contentType} is password protected:`, err);
    return { isProtected: false, error: err };
  }
};

/**
 * Verify content password (works for all content types)
 */
export const verifyContentPassword = async (contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract', password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_content_password', {
      content_id: contentId,
      content_type: contentType,
      password_param: password
    });
    
    if (error) throw error;
    
    return data;
  } catch (err) {
    console.error(`Error verifying ${contentType} password:`, err);
    return false;
  }
};

/**
 * Log content access (useful for analytics)
 */
export const logContentAccess = async (contentId: string, contentType: string, options: any = {}, eventType: string = 'access') => {
  try {
    // You could implement actual logging here
    // For now we just console.log
    console.log(`Content access logged: ${contentType} ${contentId} - ${eventType}`, options);
    return true;
  } catch (err) {
    console.error(`Error logging ${contentType} access:`, err);
    return false;
  }
};
