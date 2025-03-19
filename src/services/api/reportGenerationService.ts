
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';
import { fetchPageSpeedData, formatPageSpeedData } from './pageSpeedService';
import { generateOpenAIReport } from './openaiService';

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
    console.error('Error in generateSeoReport:', error);
    toast.error('Error al iniciar generación del informe');
    throw error;
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
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${clientId}/${reportId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('seo-files')
          .upload(fileName, file);
          
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
        }
      }
    }
    
    // Fetch PageSpeed Insights data if Google API key is available
    let pageSpeedData = null;
    try {
      pageSpeedData = await fetchPageSpeedData(url);
      
      if (pageSpeedData) {
        toast.success('Datos de PageSpeed obtenidos correctamente');
      }
    } catch (pageSpeedError) {
      console.error('Error fetching PageSpeed data:', pageSpeedError);
      toast.error('Error al obtener datos de PageSpeed');
    }
    
    let prompt = customPrompt || localStorage.getItem('default_seo_prompt') || '';
    prompt = prompt.replace('[DOMINIO]', new URL(url).hostname);
    
    // Add PageSpeed data to prompt if available
    if (pageSpeedData) {
      const pageSpeedSummary = formatPageSpeedData(pageSpeedData);
      prompt += "\n\nA continuación se incluyen datos obtenidos de Google PageSpeed Insights. Utiliza esta información para enriquecer la sección de Análisis Técnico del informe:\n" + pageSpeedSummary;
    }
    
    try {
      const { sections } = await generateOpenAIReport(url, prompt);
      
      // Update report with generated content and PageSpeed data
      const updateData: any = {
        content: {
          executiveSummary: sections.executiveSummary || '',
          technicalAnalysis: sections.technicalAnalysis || '',
          contentAnalysis: sections.contentAnalysis || '',
          backlinksAnalysis: sections.backlinksAnalysis || '',
          recommendations: sections.recommendations || ''
        },
        summary: sections.summary || 'Análisis SEO completo del sitio web.',
        status: 'completed',
        updated_at: new Date().toISOString()
      };
      
      // Add PageSpeed data if available
      if (pageSpeedData) {
        updateData.page_speed_data = pageSpeedData;
      }
      
      const { data: completedReport, error: updateError } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', reportId)
        .select()
        .single();
        
      if (updateError) {
        throw updateError;
      }
      
      // Convert the database column names to camelCase for the Report interface
      const formattedCompletedReport: Report = {
        id: completedReport.id,
        clientId: completedReport.client_id,
        title: completedReport.title,
        date: completedReport.date,
        status: completedReport.status as 'processing' | 'completed' | 'failed',
        url: completedReport.url,
        summary: completedReport.summary,
        content: completedReport.content as Report['content'],
        customPrompt: completedReport.custom_prompt,
        pageSpeedData: (completedReport as any).page_speed_data as Report['pageSpeedData']
      };
      
      toast.success('Informe generado exitosamente');
      return formattedCompletedReport;
      
    } catch (apiError: any) {
      console.error('Error calling OpenAI API:', apiError);
      
      // Update report status to failed
      await supabase
        .from('reports')
        .update({ 
          status: 'failed' as 'processing' | 'completed' | 'failed',
          summary: `Error: ${apiError.message}`
        })
        .eq('id', reportId);
        
      toast.error('Error al generar el informe con la API de OpenAI');
      throw apiError;
    }
    
  } catch (error: any) {
    console.error('Error generating report:', error);
    
    try {
      if (reportId) {
        await supabase
          .from('reports')
          .update({ status: 'failed' as 'processing' | 'completed' | 'failed' })
          .eq('id', reportId);
      }
    } catch (updateError) {
      console.error('Error updating report status to failed:', updateError);
    }
    
    toast.error('Error al generar informe');
    throw error;
  }
};
