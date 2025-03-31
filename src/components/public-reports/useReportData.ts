
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSharedReportAccess } from '@/utils/sharedContentLogger';
import { SharedContentStatus } from '@/types/shared-content';

interface PublicReport {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  status: SharedContentStatus;
  content?: any;
  date?: string;
  client_name?: string;
  client_website?: string;
}

interface AccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  source?: string;
}

/**
 * Hook para obtener y gestionar los datos de un informe por su ID
 */
const useReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(true); // Por defecto concedido ya que eliminamos contraseñas
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Función simplificada para obtener informe directamente
  const fetchReport = useCallback(async () => {
    if (!reportId || reportId.trim() === '') {
      setError('ID de informe no proporcionado');
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Intentando obtener informe con ID/URL: ${reportId}`);
      
      // Primero intentar desde shared_content
      const { data: sharedData, error: sharedError } = await supabase
        .from('shared_content')
        .select('*')
        .or(`shared_url.eq.${reportId},id.eq.${reportId}`)
        .eq('content_type', 'report')
        .maybeSingle();
        
      if (!sharedError && sharedData) {
        console.log('Informe encontrado en shared_content:', sharedData);
        
        const reportData: PublicReport = {
          id: sharedData.id,
          title: sharedData.title || 'Informe sin título',
          status: parseStatusFromString(sharedData.status),
          content: sharedData.content,
          date: sharedData.created_at,
          client_name: sharedData.client_name,
          client_website: sharedData.client_website
        };
        
        setReport(reportData);
        setNotFound(false);
        
        // Log de acceso exitoso
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'shared_content_tabla' 
        });
        
        setIsLoading(false);
        return;
      }
      
      // Si no está en shared_content, intentar desde public_reports vista
      const { data: publicData, error: publicError } = await supabase
        .from('public_reports')
        .select('*')
        .or(`shared_url.eq.${reportId},id.eq.${reportId}`)
        .maybeSingle();
        
      if (!publicError && publicData) {
        console.log('Informe encontrado en public_reports:', publicData);
        
        const reportData: PublicReport = {
          id: publicData.id,
          title: publicData.title || 'Informe sin título',
          summary: publicData.summary,
          url: publicData.url,
          status: parseStatusFromString(publicData.status),
          content: publicData.content,
          date: publicData.date,
          client_name: publicData.client_name,
          client_website: publicData.client_website
        };
        
        setReport(reportData);
        setNotFound(false);
        
        // Log de acceso exitoso
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'public_reports_vista' 
        });
        
        setIsLoading(false);
        return;
      }
      
      // Como último recurso, intentar directamente desde la tabla reports
      const { data: directData, error: directError } = await supabase
        .from('reports')
        .select(`
          id, 
          title, 
          summary,
          url,
          status,
          content,
          date,
          shared_url,
          clients (name, website)
        `)
        .or(`shared_url.eq.${reportId},id.eq.${reportId}`)
        .maybeSingle();
        
      if (!directError && directData) {
        console.log('Informe encontrado directamente en reports:', directData);
        
        const reportData: PublicReport = {
          id: directData.id,
          title: directData.title || 'Informe sin título',
          summary: directData.summary,
          url: directData.url,
          status: parseStatusFromString(directData.status),
          content: directData.content,
          date: directData.date,
          client_name: directData.clients?.name,
          client_website: directData.clients?.website
        };
        
        setReport(reportData);
        setNotFound(false);
        
        // Log de acceso exitoso
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'reports_tabla_directa' 
        });
        
        setIsLoading(false);
        return;
      }
      
      // Si llegamos aquí, no encontramos el informe
      console.error('No se pudo encontrar el informe con ningún método');
      console.error('Error shared_content:', sharedError);
      console.error('Error public_reports:', publicError);
      console.error('Error directamente reports:', directError);
      
      setNotFound(true);
      setError('Informe no encontrado');
      
      // Log de acceso fallido
      logSharedReportAccess(reportId, { 
        successful: false, 
        error: 'Informe no encontrado',
        source: 'no_encontrado'
      });
      
    } catch (err: any) {
      console.error('Error al obtener informe:', err);
      setError(err.message || 'Error al cargar el informe');
      
      // Solo reintentar un número limitado de veces
      if (retryCount < 2) {
        console.log(`Reintentando búsqueda (intento ${retryCount + 1}/2)`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchReport();
        }, 1000 * Math.pow(2, retryCount)); // Backoff exponencial
      } else {
        setNotFound(true);
        logSharedReportAccess(reportId, { 
          successful: false, 
          error: err.message || 'Error después de reintentos',
          source: 'error_con_reintentos'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [reportId, retryCount]);

  // Ya no necesitamos verificación de contraseña, pero mantenemos la función
  // para mantener compatibilidad con código existente
  const verifyPassword = async (password: string): Promise<boolean> => {
    return true; // Siempre devolver true ya que eliminamos la protección con contraseña
  };

  // Cargar informe inicialmente
  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [fetchReport]);

  return {
    report,
    isLoading,
    error,
    isPasswordProtected: false,
    accessGranted: true,
    verifyPassword,
    refetch: fetchReport,
    notFound
  };
};

export default useReportData;

// Función auxiliar para convertir string de estado a tipo SharedContentStatus
const parseStatusFromString = (status: string): SharedContentStatus => {
  const validStatuses: SharedContentStatus[] = [
    "processing", "completed", "failed", "draft", "sent", 
    "accepted", "rejected", "pending", "paid", "signed", 
    "expired", "cancelled"
  ];
  
  if (validStatuses.includes(status as SharedContentStatus)) {
    return status as SharedContentStatus;
  }
  
  // Fallback predeterminado
  return "draft";
};
