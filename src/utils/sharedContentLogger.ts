
import { supabase } from '@/integrations/supabase/client';

interface LogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  action?: string;
  source?: string;
}

export const logSharedReportAccess = async (
  reportId: string,
  options: LogOptions,
  eventType?: string
) => {
  try {
    const { successful, passwordAttempt, error, action, source } = options;
    
    // Simplemente guardar un registro en la consola por ahora
    console.log('Shared report access:', {
      reportId,
      successful,
      passwordAttempt,
      error,
      action: action || (passwordAttempt ? 'password_verification' : 'view'),
      source,
      timestamp: new Date().toISOString(),
      eventType: eventType || 'report_access'
    });
    
    // Aquí se podría implementar el envío a un servicio de analytics o guardar en Supabase
    // si se quisiera hacer un seguimiento más detallado de los accesos
  } catch (e) {
    // No hacemos fallar la aplicación si falla el logging
    console.error('Error logging shared report access:', e);
  }
};
