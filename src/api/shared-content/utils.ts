
import { supabase } from '@/integrations/supabase/client';
import { AccessLogOptions, AccessLogType, SharedContentType } from '@/types/shared-content';

export const logSharedContentAccess = async ({
  contentType,
  contentId,
  accessType,
  options = {}
}: {
  contentType: SharedContentType;
  contentId: string;
  accessType: AccessLogType;
  options?: AccessLogOptions;
}) => {
  try {
    await supabase.functions.invoke('log-content-access', {
      body: {
        content_type: contentType,
        content_id: contentId,
        access_type: accessType,
        successful: options.success !== undefined ? options.success : true,
        error_message: options.error_message || null,
        password_attempt: options.password_attempt || false,
        source: options.source || 'web_client'
      }
    });
  } catch (error) {
    console.error('Error logging shared content access:', error);
  }
};

export const checkContentExists = async (
  contentId: string,
  contentType: SharedContentType
): Promise<boolean> => {
  try {
    // Use direct query to check if content exists
    const { data, error } = await supabase
      .from('shared_content')
      .select('id')
      .eq('shared_url', contentId)
      .eq('content_type', contentType)
      .single();
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking content existence:', error);
    return false;
  }
};

export const checkContentPasswordProtection = async (
  contentId: string,
  contentType: SharedContentType
): Promise<boolean> => {
  try {
    // Use direct query to check if content is password protected
    const { data, error } = await supabase
      .from('shared_content')
      .select('password')
      .eq('shared_url', contentId)
      .eq('content_type', contentType)
      .single();
    
    if (error) throw error;
    
    return data && data.password ? true : false;
  } catch (error) {
    console.error('Error checking content password protection:', error);
    return false;
  }
};

export const verifyContentPassword = async (
  contentId: string,
  contentType: SharedContentType,
  password: string
): Promise<boolean> => {
  try {
    // Use direct query to verify password
    const { data, error } = await supabase
      .from('shared_content')
      .select('id')
      .eq('shared_url', contentId)
      .eq('content_type', contentType)
      .eq('password', password)
      .single();
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error verifying content password:', error);
    return false;
  }
};
