
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';
import { fetchPageSpeedData } from './pageSpeedService';
import { uploadReportFiles } from './reportFileService';
import { processOpenAIReport, markReportAsFailed } from './openaiProcessingService';
import { handleServiceError } from './baseService';

/**
 * Generates an SEO report using OpenAI
 */
export const generateSeoReport = async (
  clientId: string,
  url: string,
  files: File[],
  customPrompt?: string
): Promise<Report> => {
  try {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('No active session');
    }

    // Create a new report with status "processing"
    const { data: newReport, error: createError } = await supabase
      .from('reports')
      .insert({
        client_id: clientId,
        title: `SEO Report - ${url}`,
        url: url,
        status: 'processing',
        date: new Date().toISOString(),
        summary: 'Generating report...',
        content: {
          executiveSummary: '',
          technicalAnalysis: '',
          contentAnalysis: '',
          backlinksAnalysis: '',
          recommendations: ''
        },
        custom_prompt: customPrompt || ''
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    console.log('Created initial report:', newReport);

    // Start the report generation process
    processReportGeneration(newReport.id, clientId, url, files, customPrompt);

    // Return the initial report with status "processing"
    return {
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
  } catch (error: any) {
    return handleServiceError(error, 'Error al iniciar generación del informe');
  }
};

/**
 * Processes the report generation in the background
 */
const processReportGeneration = async (
  reportId: string,
  clientId: string,
  url: string,
  files: File[],
  customPrompt?: string
) => {
  try {
    // Upload supporting files if any
    if (files.length > 0) {
      await uploadReportFiles(clientId, reportId, files);
    }
    
    // Fetch PageSpeed Insights data if Google API key is available
    let pageSpeedData = null;
    try {
      pageSpeedData = await fetchPageSpeedData(url);
      
      if (pageSpeedData) {
        toast.success('Datos de PageSpeed obtenidos correctamente');
      } else {
        console.log('No se pudieron obtener datos de PageSpeed, continuando sin ellos');
      }
    } catch (pageSpeedError) {
      // No detenemos el proceso por un error en PageSpeed
      console.error('Error fetching PageSpeed data:', pageSpeedError);
      toast.error('Error al obtener datos de PageSpeed, continuando sin esta información');
    }
    
    // Process the report with OpenAI
    await processOpenAIReport(reportId, url, pageSpeedData, customPrompt);
    
  } catch (error: any) {
    console.error('Error generating report:', error);
    
    // Mark report as failed
    await markReportAsFailed(reportId, error.message || 'Error desconocido');
    
    toast.error('Error al generar informe');
    throw error;
  }
};
