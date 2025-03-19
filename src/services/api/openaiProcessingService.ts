
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';
import { formatPageSpeedData } from './pageSpeedService';
import { generateOpenAIReport } from './openaiService';

/**
 * Processes the report generation using OpenAI
 */
export const processOpenAIReport = async (
  reportId: string,
  url: string,
  pageSpeedData: any = null,
  customPrompt?: string
): Promise<Report | null> => {
  try {
    let prompt = customPrompt || localStorage.getItem('default_seo_prompt') || '';
    prompt = prompt.replace('[DOMINIO]', new URL(url).hostname);
    
    // Add PageSpeed data to prompt if available
    if (pageSpeedData) {
      const pageSpeedSummary = formatPageSpeedData(pageSpeedData);
      prompt += "\n\nA continuación se incluyen datos obtenidos de Google PageSpeed Insights. Utiliza esta información para enriquecer la sección de Análisis Técnico del informe:\n" + pageSpeedSummary;
    } else {
      prompt += "\n\nNo se pudieron obtener datos de Google PageSpeed Insights. Por favor, incluye en el informe recomendaciones generales sobre la importancia de la velocidad de carga y rendimiento del sitio, sin datos específicos.";
    }
    
    const { sections } = await generateOpenAIReport(url, prompt);
    
    // Update report with generated content and PageSpeed data
    const updateData: any = {
      content: {
        executiveSummary: sections.executiveSummary || '',
        technicalAnalysis: sections.technicalAnalysis || '',
        contentAnalysis: sections.contentAnalysis || '',
        backlinksAnalysis: sections.backlinksAnalysis || '',
        recommendations: sections.recommendations || '',
        seoLocal: sections.seoLocal || '',
        propuesta: sections.propuesta || ''
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
};

/**
 * Updates report status to failed in case of error
 */
export const markReportAsFailed = async (reportId: string, errorMessage: string): Promise<void> => {
  try {
    if (reportId) {
      await supabase
        .from('reports')
        .update({ 
          status: 'failed' as 'processing' | 'completed' | 'failed',
          summary: `Error: ${errorMessage}`
        })
        .eq('id', reportId);
    }
  } catch (updateError) {
    console.error('Error updating report status to failed:', updateError);
  }
};
