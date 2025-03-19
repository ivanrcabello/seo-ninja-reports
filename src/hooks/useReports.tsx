import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import useAuth from './useAuth';
import { Report } from '@/types/report.types';

interface ReportsContextType {
  reports: Report[];
  isLoading: boolean;
  getReport: (id: string) => Report | undefined;
  getClientReports: (clientId: string) => Report[];
  createReport: (data: Omit<Report, 'id' | 'date' | 'status'>) => Promise<Report>;
  updateReport: (id: string, data: Partial<Report>) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (clientId: string, url: string, files: File[], customPrompt?: string) => Promise<Report>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadReports = async () => {
      if (!user) {
        setReports([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data: reportsData, error } = await supabase
          .from('reports')
          .select('*, clients!inner(*)')
          .order('date', { ascending: false });
        
        if (error) {
          throw error;
        }

        const formattedReports: Report[] = reportsData.map((report: any) => {
          let formattedContent = report.content;
          
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
            content: formattedContent,
            customPrompt: report.custom_prompt
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
      const { clientId, title, url, summary, content, customPrompt } = data;
      
      const { data: newReport, error } = await supabase
        .from('reports')
        .insert({
          client_id: clientId,
          title,
          url,
          summary,
          content,
          custom_prompt: customPrompt,
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
        content: newReport.content as Report['content'],
        customPrompt: newReport.custom_prompt
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
      const dbData: any = {};
      if (data.clientId !== undefined) dbData.client_id = data.clientId;
      if (data.title !== undefined) dbData.title = data.title;
      if (data.status !== undefined) dbData.status = data.status;
      if (data.url !== undefined) dbData.url = data.url;
      if (data.summary !== undefined) dbData.summary = data.summary;
      if (data.content !== undefined) dbData.content = data.content;
      if (data.customPrompt !== undefined) dbData.custom_prompt = data.customPrompt;
      
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
        content: updatedReport.content as Report['content'],
        customPrompt: updatedReport.custom_prompt
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

  const generateReport = async (clientId: string, url: string, files: File[], customPrompt?: string): Promise<Report> => {
    try {
      const apiKey = localStorage.getItem('openai_api_key') || '';
      
      if (!apiKey) {
        toast.error('No se ha configurado la API key de OpenAI');
        throw new Error('No se ha configurado la API key de OpenAI');
      }
      
      const { data: newReport, error } = await supabase
        .from('reports')
        .insert({
          client_id: clientId,
          title: `Análisis SEO - ${new URL(url).hostname}`,
          url,
          custom_prompt: customPrompt,
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
        url: newReport.url,
        customPrompt: newReport.custom_prompt
      };
      
      setReports(prevReports => [processingReport, ...prevReports]);
      toast.success('Generación de informe iniciada');
      
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
      
      let prompt = customPrompt || localStorage.getItem('default_seo_prompt') || '';
      prompt = prompt.replace('[DOMINIO]', new URL(url).hostname);
      
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: prompt
              },
              {
                role: "user",
                content: `Analiza el sitio web ${url}. Genera un informe SEO basado en el prompt proporcionado.`
              }
            ],
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error en la API de OpenAI: ${response.statusText}`);
        }
        
        const data = await response.json();
        const generatedText = data.choices[0].message.content;
        
        const sections = extractSectionsFromText(generatedText);
        
        const { data: completedReport, error: updateError } = await supabase
          .from('reports')
          .update({
            status: 'completed' as 'processing' | 'completed' | 'failed',
            summary: sections.summary || 'Análisis SEO completo del sitio web.',
            content: {
              executiveSummary: sections.executiveSummary || '',
              technicalAnalysis: sections.technicalAnalysis || '',
              contentAnalysis: sections.contentAnalysis || '',
              backlinksAnalysis: sections.backlinksAnalysis || '',
              recommendations: sections.recommendations || ''
            }
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
          content: completedReport.content as Report['content'],
          customPrompt: completedReport.custom_prompt
        };
        
        setReports(prevReports => 
          prevReports.map(report => report.id === newReport.id ? formattedCompletedReport : report)
        );
        
        toast.success('Informe generado exitosamente');
        return formattedCompletedReport;
        
      } catch (apiError: any) {
        console.error('Error calling OpenAI API:', apiError);
        
        await supabase
          .from('reports')
          .update({ 
            status: 'failed' as 'processing' | 'completed' | 'failed',
            summary: `Error: ${apiError.message}`
          })
          .eq('id', newReport.id);
          
        setReports(prevReports => 
          prevReports.map(report => 
            report.id === newReport.id 
              ? { 
                  ...report, 
                  status: 'failed' as const,
                  summary: `Error: ${apiError.message}`
                } 
              : report
          )
        );
        
        toast.error('Error al generar el informe con la API de OpenAI');
        throw apiError;
      }
      
    } catch (error: any) {
      console.error('Error generating report:', error);
      
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

  const extractSectionsFromText = (text: string) => {
    const sections = {
      summary: '',
      executiveSummary: '',
      technicalAnalysis: '',
      contentAnalysis: '',
      backlinksAnalysis: '',
      recommendations: ''
    };

    const execSummaryMatch = text.match(/(?:Resumen Ejecutivo|Executive Summary)(?:[\s\S]*?)(?=(?:Análisis Técnico|Technical Analysis|2\.|$))/i);
    if (execSummaryMatch) {
      sections.executiveSummary = execSummaryMatch[0].replace(/(?:Resumen Ejecutivo|Executive Summary)(?:\s*):?/i, '').trim();
      const summaryParagraph = sections.executiveSummary.split('\n\n')[0];
      if (summaryParagraph) {
        sections.summary = summaryParagraph;
      }
    }

    const techAnalysisMatch = text.match(/(?:Análisis Técnico|Technical Analysis)(?:[\s\S]*?)(?=(?:Análisis de Contenido|Content Analysis|3\.|$))/i);
    if (techAnalysisMatch) {
      sections.technicalAnalysis = techAnalysisMatch[0].replace(/(?:Análisis Técnico|Technical Analysis)(?:\s*):?/i, '').trim();
    }

    const contentAnalysisMatch = text.match(/(?:Análisis de Contenido|Content Analysis)(?:[\s\S]*?)(?=(?:Backlinks y Autoridad|Backlinks and Authority|4\.|$))/i);
    if (contentAnalysisMatch) {
      sections.contentAnalysis = contentAnalysisMatch[0].replace(/(?:Análisis de Contenido|Content Analysis)(?:\s*):?/i, '').trim();
    }

    const backlinksMatch = text.match(/(?:Backlinks y Autoridad|Backlinks and Authority)(?:[\s\S]*?)(?=(?:Recomendaciones|Recommendations|5\.|$))/i);
    if (backlinksMatch) {
      sections.backlinksAnalysis = backlinksMatch[0].replace(/(?:Backlinks y Autoridad|Backlinks and Authority)(?:\s*):?/i, '').trim();
    }

    const recommendationsMatch = text.match(/(?:Recomendaciones|Recommendations)(?:[\s\S]*?)(?=$)/i);
    if (recommendationsMatch) {
      sections.recommendations = recommendationsMatch[0].replace(/(?:Recomendaciones|Recommendations)(?:\s*):?/i, '').trim();
    }

    return sections;
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
