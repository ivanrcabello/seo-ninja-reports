
import { supabase } from '@/integrations/supabase/client';
import { SharedReport, SharedReportResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';
import { logError } from '@/lib/errorLogger';
import { SharedContentRow } from '@/types/supabase-types';

/**
 * Alias para checkContentExists específico para informes
 */
export const checkReportExists = async (reportId: string): Promise<{ exists: boolean; error: Error | null }> => {
  return checkContentExists(reportId, 'report');
};

/**
 * Alias para checkContentPasswordProtection específico para informes
 */
export const checkReportPassword = async (reportId: string): Promise<{ isProtected: boolean; error: Error | null }> => {
  return checkContentPasswordProtection(reportId, 'report');
};

/**
 * Alias para verifyContentPassword específico para informes
 */
export const verifyReportPassword = async (reportId: string, password: string): Promise<boolean> => {
  return verifyContentPassword(reportId, 'report', password);
};

/**
 * Alias para logContentAccess específico para informes
 */
export const logReportAccess = (reportId: string, options: AccessLogOptions, eventType: AccessLogType = 'view') => {
  return logContentAccess('report', reportId, options, eventType);
};

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
      logError('fetchReportBySharedUrl', error);
      throw error;
    }
    
    if (!data) {
      logReportAccess(sharedUrl, { 
        successful: false, 
        error: 'Report not found' 
      }, 'not_found');
      
      return { data: null, error: new Error('Report not found') };
    }
    
    const rowData = data as SharedContentRow;
    
    // Mapear a la estructura de SharedReport
    const report: SharedReport = {
      id: rowData.id,
      original_id: rowData.original_id,
      content_type: 'report',
      title: rowData.title,
      description: rowData.description || '',
      content: rowData.content,
      status: rowData.status as any,
      shared_url: rowData.shared_url,
      client_name: rowData.client_name,
      client_website: rowData.client_website,
      summary: rowData.description,
      url: rowData.content?.url,
      created_at: rowData.created_at,
      updated_at: rowData.updated_at
    };
    
    // Registrar acceso exitoso
    logReportAccess(sharedUrl, { successful: true }, 'view');
    
    return { data: report, error: null };
  } catch (error: any) {
    logError('fetchReportBySharedUrl', error);
    
    // Registrar acceso fallido
    logReportAccess(sharedUrl, { 
      successful: false, 
      error: error.message || 'Unknown error' 
    }, 'error');
    
    return { data: null, error };
  }
};

/**
 * Alias para fetchReportBySharedUrl para consistencia con la API anterior
 */
export const fetchReportByAnyId = fetchReportBySharedUrl;

/**
 * Actualiza un informe con una nueva contraseña
 */
export const updateReportWithPassword = async (
  reportId: string, 
  password: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .update({ password })
      .eq('shared_url', reportId)
      .eq('content_type', 'report');
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    logError('updateReportWithPassword', error);
    return false;
  }
};
