
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
    console.log('Procesando informe con OpenAI para:', url);
    console.log('ID del informe:', reportId);
    console.log('¿Hay datos de PageSpeed?', !!pageSpeedData);
    
    let prompt = customPrompt || localStorage.getItem('default_seo_prompt') || '';
    prompt = prompt.replace('[DOMINIO]', new URL(url).hostname);
    
    // Add PageSpeed data to prompt if available
    if (pageSpeedData) {
      const pageSpeedSummary = formatPageSpeedData(pageSpeedData);
      prompt += "\n\nA continuación se incluyen datos obtenidos de Google PageSpeed Insights. Utiliza esta información para enriquecer la sección de Análisis Técnico del informe:\n" + pageSpeedSummary;
    } else {
      prompt += "\n\nNo se pudieron obtener datos de Google PageSpeed Insights. Por favor, incluye en el informe recomendaciones generales sobre la importancia de la velocidad de carga y rendimiento del sitio, sin datos específicos.";
    }
    
    console.log('Generando informe con OpenAI...');
    const { sections, rawResponse } = await generateOpenAIReport(url, prompt);
    console.log('Informe generado, actualizando base de datos...');
    console.log('Secciones disponibles:', Object.keys(sections));
    
    // Get current report content to preserve any existing data
    const { data: currentReport } = await supabase
      .from('reports')
      .select('content')
      .eq('id', reportId)
      .single();
    
    // Ensure content is an object
    const currentContent = currentReport?.content ? 
      (typeof currentReport.content === 'object' ? currentReport.content : {}) : 
      {};
    
    // Create properly typed content object
    const reportContent = {
      executiveSummary: sections.executiveSummary || '',
      technicalAnalysis: sections.technicalAnalysis || '',
      contentAnalysis: sections.contentAnalysis || '',
      backlinksAnalysis: sections.backlinksAnalysis || '',
      recommendations: sections.recommendations || '',
      localSeo: sections.localSeo || '',
      serviceProposal: sections.serviceProposal || '',
      // Add pageSpeedData to content
      pageSpeedData: pageSpeedData || undefined
    };
    
    console.log('Actualización de content preparada con secciones:', Object.keys(reportContent));
    
    // Update report with generated content
    const updateData = {
      content: reportContent,
      summary: sections.summary || 'Análisis SEO completo del sitio web.',
      status: 'completed',
      updated_at: new Date().toISOString()
    };
    
    const { data: completedReport, error: updateError } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error al actualizar el informe en Supabase:', updateError);
      throw updateError;
    }
    
    console.log('Informe actualizado exitosamente');
    
    // Format report for return with proper type safety
    const formattedCompletedReport: Report = {
      id: completedReport.id,
      clientId: completedReport.client_id,
      title: completedReport.title,
      date: completedReport.date,
      status: completedReport.status as 'processing' | 'completed' | 'failed',
      url: completedReport.url,
      summary: completedReport.summary,
      content: completedReport.content && typeof completedReport.content === 'object' 
        ? completedReport.content as Report['content']
        : undefined,
      customPrompt: completedReport.custom_prompt
    };
    
    toast.success('Informe generado exitosamente');
    return formattedCompletedReport;
    
  } catch (apiError: any) {
    console.error('Error calling OpenAI API:', apiError);
    
    // Update report status to failed
    await supabase
      .from('reports')
      .update({ 
        status: 'failed',
        summary: `Error: ${apiError.message}`
      })
      .eq('id', reportId);
      
    toast.error(`Error al generar el informe: ${apiError.message}`);
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
          status: 'failed',
          summary: `Error: ${errorMessage}`
        })
        .eq('id', reportId);
    }
  } catch (updateError) {
    console.error('Error updating report status to failed:', updateError);
  }
};
