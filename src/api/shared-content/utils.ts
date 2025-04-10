
// This file contains utility functions for working with shared content

import { supabase } from '@/integrations/supabase/client';

/**
 * Check if content exists with the given ID
 */
export async function checkContentExists(contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract'): Promise<boolean> {
  try {
    if (contentType === 'report') {
      // Para informes, usamos una función RPC personalizada
      const { data, error } = await supabase
        .rpc('check_report_exists_by_shared_url', {
          shared_url_param: contentId
        } as any);
      
      if (error) {
        console.error('Error checking if report exists:', error);
        return false;
      }
      
      return Boolean(data);
    } else {
      const { data, error } = await supabase
        .rpc('check_shared_content_exists', {
          content_id: contentId,
          content_type: contentType
        });
      
      if (error) {
        console.error('Error checking if content exists:', error);
        return false;
      }
      
      return Boolean(data);
    }
  } catch (err) {
    console.error('Exception checking if content exists:', err);
    return false;
  }
}

/**
 * Check if content is password protected
 */
export async function checkContentPasswordProtection(contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract'): Promise<boolean> {
  try {
    // Use the appropriate RPC function based on content type
    if (contentType === 'report') {
      // Use the dedicated function for reports to avoid recursion
      const { data, error } = await supabase
        .rpc('check_report_password_protection_by_url', {
          shared_url_param: contentId
        } as any);
      
      if (error) {
        console.error('Error checking report password protection:', error);
        return false;
      }
      
      return Boolean(data);
    } else {
      // For other content types, use the generic function
      const { data, error } = await supabase
        .rpc('check_shared_content_password', {
          content_id: contentId,
          content_type: contentType
        });
      
      if (error) {
        console.error('Error checking content password protection:', error);
        return false;
      }
      
      return Boolean(data);
    }
  } catch (err) {
    console.error('Exception checking content password protection:', err);
    return false;
  }
}

/**
 * Verify a content password
 */
export async function verifyContentPassword(contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract', password: string): Promise<boolean> {
  try {
    // Log the password verification attempt (without the actual password)
    await supabase.rpc('log_shared_content_access', {
      content_type: contentType,
      content_id: contentId,
      access_type: 'password_verification',
      password_attempt: true
    });
    
    // Use the appropriate RPC function based on content type
    if (contentType === 'report') {
      // Use the dedicated function for reports to avoid recursion
      const { data, error } = await supabase
        .rpc('verify_shared_report_password_by_url', {
          shared_url_param: contentId,
          password_param: password
        } as any);
      
      if (error) {
        console.error('Error verifying report password:', error);
        return false;
      }
      
      return Boolean(data);
    } else {
      // For other content types, use the generic function
      const { data, error } = await supabase
        .rpc('verify_shared_content_password', {
          content_id: contentId,
          content_type: contentType,
          password_param: password
        });
      
      if (error) {
        console.error('Error verifying content password:', error);
        return false;
      }
      
      return Boolean(data);
    }
  } catch (err) {
    console.error('Exception verifying content password:', err);
    return false;
  }
}

/**
 * Log access to shared content
 */
export interface AccessLogOptions {
  success?: boolean;
  password_attempt?: boolean;
  error_message?: string;
}

export type AccessLogType = 'view' | 'password_verification' | 'signature' | 'payment';

/**
 * Log access to shared content
 */
export async function logSharedContentAccess(params: {
  contentType: 'report' | 'invoice' | 'proposal' | 'contract';
  contentId: string;
  accessType: AccessLogType;
  options?: AccessLogOptions;
}): Promise<void> {
  try {
    const { contentType, contentId, accessType, options = {} } = params;
    
    // Log the access attempt
    await supabase.rpc('log_shared_content_access', {
      content_type: contentType,
      content_id: contentId,
      access_type: accessType,
      successful: options.success,
      password_attempt: options.password_attempt,
      error_message: options.error_message
    });
  } catch (err) {
    console.error('Error logging shared content access:', err);
    // Don't throw, just log the error
  }
}
