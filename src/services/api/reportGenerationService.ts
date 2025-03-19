
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
  customPrompt?: string,
  prefetchedPageSpeedData?: any
): Promise<Report> => {
  try {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('No active session');
    }

    console.log('Iniciando generación de informe SEO para cliente:', clientId, 'URL:', url);
    console.log('¿Hay datos de PageSpeed prefetched?', !!prefetchedPageSpeedData);

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
          recommendations: '',
          localSeo: '',
          serviceProposal: ''
        },
        custom_prompt: customPrompt || ''
        // We'll store PageSpeed data in the content field instead
      })
      .select()
      .single();

    if (createError) {
      console.error('Error al crear informe inicial:', createError);
      throw createError;
    }

    console.log('Informe inicial creado con ID:', newReport.id);

    // If we have prefetched PageSpeed data, update the report content
    if (prefetchedPageSpeedData) {
      // Update the content field to include the PageSpeed data
      const updatedContent = {
        ...newReport.content,
        pageSpeedData: prefetchedPageSpeedData
      };

      // Update the report with the PageSpeed data
      await supabase
        .from('reports')
        .update({ 
          content: updatedContent 
        })
        .eq('id', newReport.id);
    }

    // Start the report generation process with prefetched PageSpeed data
    processReportGeneration(newReport.id, clientId, url, files, customPrompt, prefetchedPageSpeedData);

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
      customPrompt: newReport.custom_prompt,
      pageSpeedData: prefetchedPageSpeedData
    };
  } catch (error: any) {
    console.error('Error al iniciar generación del informe:', error);
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
  customPrompt?: string,
  prefetchedPageSpeedData?: any
) => {
  try {
    console.log('Iniciando proceso de generación en segundo plano para reporte:', reportId);
    
    // Upload supporting files if any
    if (files.length > 0) {
      console.log('Subiendo archivos de soporte:', files.length, 'archivos');
      await uploadReportFiles(clientId, reportId, files);
    }
    
    // Use prefetched PageSpeed data if available, otherwise try to fetch it
    let pageSpeedData = prefetchedPageSpeedData;
    
    if (!pageSpeedData) {
      try {
        console.log('No hay datos prefetched, intentando obtener datos de PageSpeed para:', url);
        pageSpeedData = await fetchPageSpeedData(url);
        
        if (pageSpeedData) {
          console.log('Datos de PageSpeed obtenidos correctamente');
          
          // Get current report content
          const { data: currentReport } = await supabase
            .from('reports')
            .select('content')
            .eq('id', reportId)
            .single();
          
          if (currentReport) {
            // Update the content to include PageSpeed data
            const updatedContent = {
              ...currentReport.content,
              pageSpeedData: pageSpeedData
            };
            
            // Update the report with the PageSpeed data
            await supabase
              .from('reports')
              .update({ content: updatedContent })
              .eq('id', reportId);
          }
            
          toast.success('Datos de PageSpeed obtenidos correctamente');
        } else {
          console.log('No se pudieron obtener datos de PageSpeed, continuando sin ellos');
        }
      } catch (pageSpeedError) {
        // No detenemos el proceso por un error en PageSpeed
        console.error('Error fetching PageSpeed data:', pageSpeedError);
        toast.error('Error al obtener datos de PageSpeed, continuando sin esta información');
      }
    } else {
      console.log('Usando datos de PageSpeed prefetched');
    }
    
    console.log('Procesando informe con OpenAI...');
    // Process the report with OpenAI
    await processOpenAIReport(reportId, url, pageSpeedData, customPrompt);
    console.log('Procesamiento de informe completado con éxito');
    
  } catch (error: any) {
    console.error('Error generating report:', error);
    
    // Mark report as failed
    await markReportAsFailed(reportId, error.message || 'Error desconocido');
    
    toast.error('Error al generar informe');
    throw error;
  }
};
