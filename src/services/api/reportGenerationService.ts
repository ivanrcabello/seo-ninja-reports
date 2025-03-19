
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';
import { fetchPageSpeedData, savePageSpeedData } from './pageSpeedService';
import { uploadReportFiles } from './reportFileService';
import { processOpenAIReport, markReportAsFailed } from './openaiProcessingService';
import { handleServiceError } from './baseService';

interface Keyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
}

/**
 * Generates an SEO report using OpenAI
 */
export const generateSeoReport = async (
  clientId: string,
  url: string,
  files: File[],
  customPrompt?: string,
  prefetchedPageSpeedData?: any,
  keywords?: Keyword[],
  notes?: string
): Promise<Report> => {
  try {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('No active session');
    }

    console.log('Iniciando generación de informe SEO para cliente:', clientId, 'URL:', url);
    console.log('¿Hay datos de PageSpeed prefetched?', !!prefetchedPageSpeedData);
    console.log('¿Hay palabras clave?', !!keywords && keywords.length > 0);
    console.log('¿Hay notas?', !!notes);

    // Prepare initial content object with properly typed structure
    const initialContent = {
      executiveSummary: '',
      technicalAnalysis: '',
      contentAnalysis: '',
      backlinksAnalysis: '',
      recommendations: '',
      localSeo: '',
      serviceProposal: '',
      keywords: '',
      // Include prefetched PageSpeed data if available
      pageSpeedData: prefetchedPageSpeedData || null
    };

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
        content: initialContent,
        custom_prompt: customPrompt || '',
        notes: notes || null
      })
      .select()
      .single();

    if (createError) {
      console.error('Error al crear informe inicial:', createError);
      throw createError;
    }

    console.log('Informe inicial creado con ID:', newReport.id);

    // If we have prefetched PageSpeed data, save it to the database
    if (prefetchedPageSpeedData) {
      await savePageSpeedData(newReport.id, url, prefetchedPageSpeedData);
    }
    
    // If we have keywords, save them to the database
    if (keywords && keywords.length > 0) {
      try {
        const keywordsToInsert = keywords.map(kw => ({
          report_id: newReport.id,
          keyword: kw.keyword,
          search_volume: kw.searchVolume || null,
          difficulty: kw.difficulty || null
        }));
        
        const { error: keywordsError } = await supabase
          .from('keywords')
          .insert(keywordsToInsert);
          
        if (keywordsError) {
          console.error('Error al guardar palabras clave:', keywordsError);
          // Don't stop the process if keywords insertion fails
        } else {
          console.log('Palabras clave guardadas correctamente:', keywords.length);
        }
      } catch (keywordError) {
        console.error('Error en proceso de guardado de palabras clave:', keywordError);
        // Don't stop the process if keywords insertion fails
      }
    }

    // Start the report generation process with prefetched PageSpeed data
    processReportGeneration(
      newReport.id, 
      clientId, 
      url, 
      files, 
      customPrompt, 
      prefetchedPageSpeedData,
      notes
    );

    // Return the initial report with status "processing"
    return {
      id: newReport.id,
      clientId: newReport.client_id,
      title: newReport.title,
      date: newReport.date,
      status: newReport.status as 'processing' | 'completed' | 'failed',
      url: newReport.url,
      summary: newReport.summary,
      notes: newReport.notes,
      content: newReport.content && typeof newReport.content === 'object' 
        ? (newReport.content as any) as Report['content']
        : undefined,
      customPrompt: newReport.custom_prompt
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
  prefetchedPageSpeedData?: any,
  notes?: string
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
        pageSpeedData = await fetchPageSpeedData(url, reportId);
        
        if (pageSpeedData) {
          console.log('Datos de PageSpeed obtenidos correctamente');
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
      // If we have prefetched data but haven't saved it yet, do it now
      if (!prefetchedPageSpeedData.saved) {
        await savePageSpeedData(reportId, url, prefetchedPageSpeedData);
      }
      console.log('Usando datos de PageSpeed prefetched');
    }
    
    console.log('Procesando informe con OpenAI...');
    // Process the report with OpenAI
    await processOpenAIReport(reportId, url, pageSpeedData, customPrompt, notes);
    console.log('Procesamiento de informe completado con éxito');
    
  } catch (error: any) {
    console.error('Error generating report:', error);
    
    // Mark report as failed
    await markReportAsFailed(reportId, error.message || 'Error desconocido');
    
    toast.error('Error al generar informe');
    throw error;
  }
};
