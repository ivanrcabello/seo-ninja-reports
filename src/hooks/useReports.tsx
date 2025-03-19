
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import useAuth from './useAuth';

export interface Report {
  id: string;
  clientId: string;
  title: string;
  date: string;
  status: 'processing' | 'completed' | 'failed';
  url?: string;
  summary?: string;
  content?: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    recommendations: string;
  };
}

interface ReportsContextType {
  reports: Report[];
  isLoading: boolean;
  getReport: (id: string) => Report | undefined;
  getClientReports: (clientId: string) => Report[];
  createReport: (data: Omit<Report, 'id' | 'date' | 'status'>) => Promise<Report>;
  updateReport: (id: string, data: Partial<Report>) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (clientId: string, url: string, files: File[]) => Promise<Report>;
}

// Create context
const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load reports when user changes
  useEffect(() => {
    const loadReports = async () => {
      if (!user) {
        setReports([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get reports from Supabase
        const { data: reportsData, error } = await supabase
          .from('reports')
          .select('*, clients!inner(*)')
          .order('date', { ascending: false });
        
        if (error) {
          throw error;
        }

        // Format reports data
        const formattedReports: Report[] = reportsData.map((report: any) => {
          // Asegurar que content tiene la estructura correcta
          let formattedContent = report.content;
          
          // Si content existe pero no tiene la estructura correcta, formatearlo
          if (report.content && (
            typeof report.content.executiveSummary !== 'string' ||
            typeof report.content.technicalAnalysis !== 'string' ||
            typeof report.content.contentAnalysis !== 'string' ||
            typeof report.content.backlinksAnalysis !== 'string' ||
            typeof report.content.recommendations !== 'string'
          )) {
            formattedContent = {
              executiveSummary: '',
              technicalAnalysis: '',
              contentAnalysis: '',
              backlinksAnalysis: '',
              recommendations: ''
            };
          }
          
          return {
            id: report.id,
            clientId: report.client_id,
            title: report.title,
            date: report.date,
            status: report.status as 'processing' | 'completed' | 'failed',
            url: report.url,
            summary: report.summary,
            content: formattedContent
          };
        });
        
        setReports(formattedReports);
      } catch (error: any) {
        console.error('Error loading reports:', error);
        toast.error(error.message || 'Error al cargar informes');
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [user]);

  const getReport = (id: string) => {
    return reports.find(report => report.id === id);
  };

  const getClientReports = (clientId: string) => {
    return reports.filter(report => report.clientId === clientId);
  };

  const createReport = async (data: Omit<Report, 'id' | 'date' | 'status'>) => {
    try {
      const { clientId, title, url, summary, content } = data;
      
      const { data: newReport, error } = await supabase
        .from('reports')
        .insert({
          client_id: clientId,
          title,
          url,
          summary,
          content,
          status: 'completed' as 'processing' | 'completed' | 'failed'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const formattedReport: Report = {
        id: newReport.id,
        clientId: newReport.client_id,
        title: newReport.title,
        date: newReport.date,
        status: newReport.status as 'processing' | 'completed' | 'failed',
        url: newReport.url,
        summary: newReport.summary,
        content: newReport.content as Report['content']
      };
      
      setReports(prevReports => [formattedReport, ...prevReports]);
      toast.success('Informe creado exitosamente');
      
      return formattedReport;
    } catch (error: any) {
      console.error('Error creating report:', error);
      toast.error(error.message || 'Error al crear informe');
      throw error;
    }
  };

  const updateReport = async (id: string, data: Partial<Report>) => {
    try {
      // Convert from camelCase to snake_case for database
      const dbData: any = {};
      if (data.clientId !== undefined) dbData.client_id = data.clientId;
      if (data.title !== undefined) dbData.title = data.title;
      if (data.status !== undefined) dbData.status = data.status;
      if (data.url !== undefined) dbData.url = data.url;
      if (data.summary !== undefined) dbData.summary = data.summary;
      if (data.content !== undefined) dbData.content = data.content;
      
      const { data: updatedReport, error } = await supabase
        .from('reports')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const formattedReport: Report = {
        id: updatedReport.id,
        clientId: updatedReport.client_id,
        title: updatedReport.title,
        date: updatedReport.date,
        status: updatedReport.status as 'processing' | 'completed' | 'failed',
        url: updatedReport.url,
        summary: updatedReport.summary,
        content: updatedReport.content as Report['content']
      };
      
      setReports(prevReports => 
        prevReports.map(report => report.id === id ? formattedReport : report)
      );
      
      toast.success('Informe actualizado exitosamente');
      return formattedReport;
    } catch (error: any) {
      console.error('Error updating report:', error);
      toast.error(error.message || 'Error al actualizar informe');
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setReports(prevReports => prevReports.filter(report => report.id !== id));
      toast.success('Informe eliminado exitosamente');
    } catch (error: any) {
      console.error('Error deleting report:', error);
      toast.error(error.message || 'Error al eliminar informe');
      throw error;
    }
  };

  // Generate a new report
  const generateReport = async (clientId: string, url: string, files: File[]): Promise<Report> => {
    try {
      // Create a new report in processing state
      const { data: newReport, error } = await supabase
        .from('reports')
        .insert({
          client_id: clientId,
          title: `Análisis SEO - ${new URL(url).hostname}`,
          url,
          status: 'processing' as 'processing' | 'completed' | 'failed'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const processingReport: Report = {
        id: newReport.id,
        clientId: newReport.client_id,
        title: newReport.title,
        date: newReport.date,
        status: newReport.status as 'processing' | 'completed' | 'failed',
        url: newReport.url
      };
      
      setReports(prevReports => [processingReport, ...prevReports]);
      toast.success('Generación de informe iniciada');
      
      // Upload files if provided
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${clientId}/${newReport.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('seo-files')
            .upload(fileName, file);
            
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
          }
        }
      }
      
      // Simulate processing time (replace with actual processing later)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Crear el contenido del informe con la estructura correcta
      const demoContent = {
        executiveSummary: 'El sitio web demuestra buenos fundamentos técnicos con buena velocidad de carga y capacidad de respuesta móvil. La calidad del contenido es alta pero la cantidad podría mejorarse, especialmente para apuntar a palabras clave de cola larga. El perfil de backlinks muestra espacio para crecer.',
        technicalAnalysis: 'Puntuación móvil: 85/100\nPuntuación de escritorio: 92/100\nEl sitio se carga en 2,4 segundos en promedio.\nNo se detectaron errores de rastreo importantes.\n4 advertencias menores de contenido mixto en las páginas del blog.',
        contentAnalysis: 'Contenido bien estructurado con encabezados claros y buena legibilidad. La densidad de palabras clave es apropiada pero podría mejorarse en ciertas secciones. La frecuencia del blog está por debajo del promedio de la industria con 2 publicaciones/mes frente a las 6-8 recomendadas.',
        backlinksAnalysis: '137 backlinks de 48 dominios de referencia. La autoridad de dominio es 38/100, lo que es bueno pero por debajo de los principales competidores (promedio 45). El perfil de enlaces es limpio sin enlaces tóxicos detectados.',
        recommendations: '1. Aumentar la frecuencia de publicación de contenido a 6-8 publicaciones/mes\n2. Corregir las advertencias de contenido mixto en el blog\n3. Apuntar a 5 palabras clave de cola larga identificadas\n4. Implementar marcado de esquema para obtener mejores fragmentos enriquecidos\n5. Desarrollar una campaña de divulgación para mejorar el perfil de backlinks'
      };
      
      const { data: completedReport, error: updateError } = await supabase
        .from('reports')
        .update({
          status: 'completed' as 'processing' | 'completed' | 'failed',
          summary: 'El análisis muestra buenos fundamentos técnicos pero oportunidades de mejora en el contenido.',
          content: demoContent
        })
        .eq('id', newReport.id)
        .select()
        .single();
        
      if (updateError) {
        throw updateError;
      }
      
      const formattedCompletedReport: Report = {
        id: completedReport.id,
        clientId: completedReport.client_id,
        title: completedReport.title,
        date: completedReport.date,
        status: completedReport.status as 'processing' | 'completed' | 'failed',
        url: completedReport.url,
        summary: completedReport.summary,
        content: completedReport.content as Report['content']
      };
      
      setReports(prevReports => 
        prevReports.map(report => report.id === newReport.id ? formattedCompletedReport : report)
      );
      
      toast.success('Informe generado exitosamente');
      return formattedCompletedReport;
    } catch (error: any) {
      console.error('Error generating report:', error);
      
      // Try to update the report to failed state if we have an ID
      try {
        if (error.reportId) {
          await supabase
            .from('reports')
            .update({ status: 'failed' as 'processing' | 'completed' | 'failed' })
            .eq('id', error.reportId);
            
          setReports(prevReports => 
            prevReports.map(report => 
              report.id === error.reportId 
                ? { ...report, status: 'failed' as const } 
                : report
            )
          );
        }
      } catch (updateError) {
        console.error('Error updating report status to failed:', updateError);
      }
      
      toast.error(error.message || 'Error al generar informe');
      throw error;
    }
  };

  const value = {
    reports,
    isLoading,
    getReport,
    getClientReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};

const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export default useReports;
