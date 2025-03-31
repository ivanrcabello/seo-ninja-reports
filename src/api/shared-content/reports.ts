
import { supabase } from '@/integrations/supabase/client';
import { SharedReport, SharedReportResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Obtiene un informe por su URL compartida
 */
export const fetchReportBySharedUrl = async (sharedUrl: string): Promise<SharedReportResponse> => {
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', sharedUrl)
      .eq('content_type', 'report')
      .single();
    
    if (error) {
      console.error('Error fetching report by shared URL:', error);
      return { data: null, error };
    }
    
    return { data: data as SharedReport, error: null };
  } catch (error: any) {
    console.error('Error fetching report by shared URL:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene un informe por cualquier ID (directo o compartido)
 */
export const fetchReportByAnyId = async (reportId: string): Promise<SharedReportResponse> => {
  try {
    // First try by shared_url
    const { data: sharedData, error: sharedError } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', reportId)
      .eq('content_type', 'report')
      .single();
    
    if (sharedData) {
      return { data: sharedData as SharedReport, error: null };
    }
    
    // If not found, try by original_id
    const { data: originalData, error: originalError } = await supabase
      .from('shared_content')
      .select('*')
      .eq('original_id', reportId)
      .eq('content_type', 'report')
      .single();
    
    if (originalData) {
      return { data: originalData as SharedReport, error: null };
    }
    
    return { data: null, error: originalError || sharedError };
  } catch (error: any) {
    console.error('Error fetching report by ID:', error);
    return { data: null, error };
  }
};

/**
 * Verifica si un informe existe
 */
export const checkReportExists = async (reportId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_exists', {
      content_id: reportId,
      content_type: 'report'
    });
    
    return !!data;
  } catch (error) {
    console.error('Error checking report existence:', error);
    return false;
  }
};

/**
 * Verifica si un informe está protegido con contraseña
 */
export const checkReportPassword = async (reportId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_password', {
      content_id: reportId,
      content_type: 'report'
    });
    
    return !!data;
  } catch (error) {
    console.error('Error checking report password protection:', error);
    return false;
  }
};

/**
 * Verifica la contraseña de un informe
 */
export const verifyReportPassword = async (reportId: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_shared_content_password', {
      content_id: reportId,
      content_type: 'report',
      password_param: password
    });
    
    return !!data;
  } catch (error) {
    console.error('Error verifying report password:', error);
    return false;
  }
};

/**
 * Registra acceso a un informe compartido
 */
export const logReportAccess = async (
  reportId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  await logContentAccess('report', reportId, options, eventType);
};

/**
 * Actualiza un informe compartido con contraseña
 */
export const updateReportWithPassword = async (
  reportId: string, 
  password: string | null
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .update({ password })
      .eq('shared_url', reportId)
      .eq('content_type', 'report');
    
    if (error) {
      console.error('Error updating report with password:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating report with password:', error);
    return false;
  }
};
