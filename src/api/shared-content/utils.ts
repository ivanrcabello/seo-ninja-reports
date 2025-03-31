
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
    await supabase.rpc('log_shared_content_access', {
      content_type: contentType,
      content_id: contentId,
      access_type: accessType,
      successful: options.success !== undefined ? options.success : true,
      error_message: options.error_message || null,
      password_attempt: options.password_attempt || false,
      source: options.source || 'web_client'
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
    const { data, error } = await supabase.rpc('check_shared_content_exists', {
      content_id: contentId,
      content_type: contentType
    });
    
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
    const { data, error } = await supabase.rpc('check_shared_content_password', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) throw error;
    
    return !!data;
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
    const { data, error } = await supabase.rpc('verify_shared_content_password', {
      content_id: contentId,
      content_type: contentType,
      password_param: password
    });
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error verifying content password:', error);
    return false;
  }
};
