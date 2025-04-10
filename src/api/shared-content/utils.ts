
// This file contains utility functions for working with shared content

import { supabase } from '@/integrations/supabase/client';

/**
 * Check if content exists with the given ID
 */
export async function checkContentExists(contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract'): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('check_shared_content_exists', {
        content_id: contentId,
        content_type: contentType
      });
    
    if (error) {
      console.error('Error checking if content exists:', error);
      return false;
    }
    
    return data || false;
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
      // We need to specially handle reports to avoid infinite recursion
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('id')
        .eq('shared_url', contentId)
        .single();
      
      if (reportError) {
        console.error('Error getting report ID:', reportError);
        return false;
      }
      
      if (!reportData?.id) {
        return false;
      }
      
      // Use the security definer function to check password protection
      const { data, error } = await supabase
        .rpc('check_report_password_protection', {
          report_id_param: reportData.id
        });
      
      if (error) {
        console.error('Error checking report password protection:', error);
        return false;
      }
      
      return data || false;
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
      
      return data || false;
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
      // We need to specially handle reports to avoid infinite recursion
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('id')
        .eq('shared_url', contentId)
        .single();
      
      if (reportError) {
        console.error('Error getting report ID:', reportError);
        return false;
      }
      
      if (!reportData?.id) {
        return false;
      }
      
      // Use the security definer function to verify the password
      const { data, error } = await supabase
        .rpc('verify_shared_report_password', {
          report_id_param: reportData.id,
          password_param: password
        });
      
      if (error) {
        console.error('Error verifying report password:', error);
        return false;
      }
      
      return data || false;
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
      
      return data || false;
    }
  } catch (err) {
    console.error('Exception verifying content password:', err);
    return false;
  }
}
