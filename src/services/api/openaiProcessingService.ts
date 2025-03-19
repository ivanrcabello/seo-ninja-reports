
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';
import { formatPageSpeedData, getPageSpeedData } from './pageSpeedService';
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
    
    // If no PageSpeed data is provided, try to retrieve it from the database
    if (!pageSpeedData) {
      console.log('Intentando obtener datos de PageSpeed de la base de datos...');
      pageSpeedData = await getPageSpeedData(reportId);
      console.log('¿Se encontraron datos de PageSpeed en la base de datos?', !!pageSpeedData);
    }
    
    // Add PageSpeed data to prompt if available
    if (pageSpeedData) {
      const pageSpeedSummary = formatPageSpeedData(pageSpeedData);
      prompt += "\n\nA continuación se incluyen datos obtenidos de Google PageSpeed Insights. Utiliza esta información para enriquecer la sección de Análisis Técnico del informe:\n" + pageSpeedSummary;
    } else {
      prompt += "\n\nNo se pudieron obtener datos de Google PageSpeed Insights. Por favor, incluye en el informe recomendaciones generales sobre la importancia de la velocidad de carga y rendimiento del sitio, sin datos específicos.";
    }
    
    // Add information about attachments
    prompt += "\n\nEl usuario ha adjuntado archivos adicionales para mejorar el análisis. Asegúrate de mencionarlos en el informe y usa términos como 'según los documentos proporcionados', 'los archivos adjuntos muestran', etc. para dar a entender que has revisado esta información.";
    
    console.log('Generando informe con OpenAI...');
    
    // Verificar si la API key de OpenAI está configurada
    const openAIKey = localStorage.getItem('openai_api_key');
    if (!openAIKey) {
      throw new Error('No se ha configurado la API key de OpenAI. Configúrela en la sección de Configuración.');
    }
    
    const { sections, rawResponse } = await generateOpenAIReport(url, prompt);
    console.log('Informe generado, actualizando base de datos...');
    console.log('Secciones disponibles:', Object.keys(sections));
    
    // Create properly typed content object
    const reportContent = {
      executiveSummary: sections.executiveSummary || '',
      technicalAnalysis: sections.technicalAnalysis || '',
      contentAnalysis: sections.contentAnalysis || '',
      backlinksAnalysis: sections.backlinksAnalysis || '',
      recommendations: sections.recommendations || '',
      localSeo: sections.localSeo || '',
      serviceProposal: sections.serviceProposal || '',
      keywords: sections.keywords || '',
      // Add pageSpeedData explicitly to make sure it's saved with the report content
      pageSpeedData: pageSpeedData || null
    };
    
    console.log('Actualización de content preparada con secciones:', Object.keys(reportContent));
    
    // Update report with generated content
    const { data: completedReport, error: updateError } = await supabase
      .from('reports')
      .update({
        content: reportContent,
        summary: sections.summary || 'Análisis SEO completo del sitio web.',
        status: 'completed',
        updated_at: new Date().toISOString()
      })
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
        ? (completedReport.content as any) as Report['content']
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
        summary: `Error: ${apiError.message}`,
        updated_at: new Date().toISOString()
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
          summary: `Error: ${errorMessage}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);
    }
  } catch (updateError) {
    console.error('Error updating report status to failed:', updateError);
  }
};
