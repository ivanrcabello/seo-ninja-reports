import { supabase } from '@/integrations/supabase/client';
import { Report, BusinessProfile } from '@/types/report.types';
import { SeoReport } from '@/types/seo-reporting.types';
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
  customPrompt?: string,
  notes?: string,
  businessProfile?: Partial<BusinessProfile> | null,
  seoReport?: SeoReport | null
): Promise<Report | null> => {
  try {
    console.log('Iniciando procesamiento de informe con OpenAI para:', url);
    console.log('ID del informe:', reportId);
    console.log('¿Hay datos de PageSpeed?', !!pageSpeedData);
    console.log('¿Hay notas?', !!notes);
    console.log('¿Hay perfil de negocio?', !!businessProfile);
    console.log('¿Hay informe SEO?', !!seoReport);
    
    let prompt = customPrompt || localStorage.getItem('default_seo_prompt') || '';
    prompt = prompt.replace('[DOMINIO]', url ? new URL(url).hostname : 'dominio');
    
    // If no PageSpeed data is provided, try to retrieve it from the database
    if (!pageSpeedData) {
      console.log('Intentando obtener datos de PageSpeed de la base de datos...');
      try {
        pageSpeedData = await getPageSpeedData(reportId);
        console.log('¿Se encontraron datos de PageSpeed en la base de datos?', !!pageSpeedData);
      } catch (pageSpeedError) {
        console.error('Error al obtener datos de PageSpeed:', pageSpeedError);
        // Continue without PageSpeed data
      }
    }
    
    // Add PageSpeed data to prompt if available
    if (pageSpeedData) {
      try {
        const pageSpeedSummary = formatPageSpeedData(pageSpeedData);
        prompt += "\n\nA continuación se incluyen datos obtenidos de Google PageSpeed Insights. Utiliza esta información para enriquecer la sección de Análisis Técnico del informe:\n" + pageSpeedSummary;
      } catch (formatError) {
        console.error('Error al formatear datos de PageSpeed:', formatError);
        prompt += "\n\nSe obtuvieron datos de PageSpeed pero hubo un error al procesarlos. Por favor, incluye recomendaciones generales sobre la velocidad de carga.";
      }
    } else {
      prompt += "\n\nNo se pudieron obtener datos de Google PageSpeed Insights. Por favor, incluye en el informe recomendaciones generales sobre la importancia de la velocidad de carga y rendimiento del sitio, sin datos específicos.";
    }
    
    // Add business profile data to prompt if available
    if (businessProfile && businessProfile.businessName) {
      prompt += "\n\nA continuación se incluyen datos del perfil de negocio. Utiliza esta información para enriquecer la sección de SEO Local y análisis general:\n";
      prompt += `Nombre del negocio: ${businessProfile.businessName || 'No disponible'}\n`;
      if (businessProfile.businessAddress) prompt += `Dirección: ${businessProfile.businessAddress}\n`;
      if (businessProfile.businessCategory) prompt += `Categoría: ${businessProfile.businessCategory}\n`;
      if (businessProfile.businessPhone) prompt += `Teléfono: ${businessProfile.businessPhone}\n`;
      if (businessProfile.businessWebsite) prompt += `Sitio web: ${businessProfile.businessWebsite}\n`;
      if (businessProfile.businessRating) prompt += `Valoración: ${businessProfile.businessRating} (${businessProfile.businessReviewsCount || 0} reseñas)\n`;
      if (businessProfile.businessUrl) prompt += `URL de Google Maps: ${businessProfile.businessUrl}\n`;
      
      prompt += "\nAnaliza estos datos y proporciona recomendaciones específicas para mejorar la presencia local del negocio.";
    }
    
    // Add SEO report data to prompt if available
    if (seoReport) {
      try {
        prompt += "\n\nA continuación se incluyen datos de un informe SEO existente. Utiliza esta información para comparar y proporcionar un análisis más profundo:\n";
        prompt += `Dominio: ${seoReport.domain || 'No disponible'}\n`;
        if (typeof seoReport.traffic === 'number') {
          prompt += `Tráfico orgánico: ${seoReport.traffic.toLocaleString()}\n`;
        }
        if (typeof seoReport.keywords === 'number') {
          prompt += `Palabras clave posicionadas: ${seoReport.keywords.toLocaleString()}\n`;
        }
        if (typeof seoReport.backlinks === 'number') {
          prompt += `Backlinks: ${seoReport.backlinks.toLocaleString()}\n`;
        }
        
        // Add keywords data if available
        if (seoReport.keywordsData && seoReport.keywordsData.length > 0) {
          prompt += "\nPalabras clave principales:\n";
          seoReport.keywordsData.slice(0, 10).forEach(kw => {
            prompt += `- "${kw.keyword}" (posición: ${kw.position}, volumen: ${kw.volume})\n`;
          });
        }
        
        // Add competitors data if available
        if (seoReport.competitorsData && seoReport.competitorsData.length > 0) {
          prompt += "\nCompetidores principales:\n";
          seoReport.competitorsData.slice(0, 5).forEach(comp => {
            prompt += `- ${comp.domain} (solapamiento: ${comp.keywordsOverlap} palabras clave)\n`;
          });
        }
        
        prompt += "\nAnaliza estos datos y proporciona comparaciones relevantes con la situación actual. Identifica cambios significativos y áreas de oportunidad.";
      } catch (seoReportError) {
        console.error('Error al procesar datos del informe SEO:', seoReportError);
        // Continue without SEO report data
      }
    }
    
    // Add notes to prompt if available
    if (notes && notes.trim()) {
      prompt += "\n\nAquí hay algunas notas importantes sobre este proyecto que debes tener en cuenta:\n" + notes;
      console.log('Notas añadidas al prompt del usuario');
    } else {
      // Get notes from database if not passed directly
      try {
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('notes')
          .eq('id', reportId)
          .maybeSingle();
          
        if (!reportError && reportData && reportData.notes) {
          prompt += "\n\nAdicional, aquí hay algunas notas importantes sobre este proyecto que debes tener en cuenta:\n" + reportData.notes;
          console.log('Notas obtenidas de la base de datos añadidas al prompt');
        }
      } catch (notesError) {
        console.error('Error al obtener notas:', notesError);
        // No need to stop the process if notes retrieval fails
      }
    }
    
    // Get keywords and add to prompt if available
    try {
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('keyword, search_volume, difficulty')
        .eq('report_id', reportId);
        
      if (!keywordsError && keywordsData && keywordsData.length > 0) {
        let keywordsPrompt = "\n\nAquí tienes una lista de palabras clave importantes para este sitio web. Enfoca tu análisis en estas palabras clave y sugiere formas de mejorar el posicionamiento para ellas:\n";
        
        keywordsData.forEach((kw: any) => {
          let kwText = `- ${kw.keyword}`;
          if (kw.search_volume) kwText += ` (Volumen de búsqueda: ${kw.search_volume})`;
          if (kw.difficulty) kwText += ` (Dificultad: ${kw.difficulty}/100)`;
          keywordsPrompt += kwText + "\n";
        });
        
        prompt += keywordsPrompt;
        console.log('Palabras clave añadidas al prompt');
      }
    } catch (keywordsError) {
      console.error('Error al obtener palabras clave:', keywordsError);
      // No need to stop the process if keywords retrieval fails
    }
    
    // Add information about attachments
    prompt += "\n\nEl usuario ha adjuntado archivos adicionales para mejorar el análisis. Asegúrate de mencionarlos en el informe y usa términos como 'según los documentos proporcionados', 'los archivos adjuntos muestran', etc. para dar a entender que has revisado esta información.";
    
    console.log('Generando informe con OpenAI...');
    
    // Verificar si la API key de OpenAI está configurada
    const openAIKey = localStorage.getItem('openai_api_key');
    if (!openAIKey) {
      throw new Error('No se ha configurado la API key de OpenAI. Configúrela en la sección de Configuración.');
    }
    
    // Update report status to show it's being processed by OpenAI
    try {
      await supabase
        .from('reports')
        .update({ 
          status: 'processing',
          summary: 'Procesando informe con OpenAI...',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);
        
      console.log('Estado del informe actualizado a "processing"');
    } catch (updateError) {
      console.error('Error al actualizar estado del informe:', updateError);
      // Continue despite the error, we can still try to generate the report
    }
    
    // Generate report with OpenAI
    try {
      const { sections, rawResponse } = await generateOpenAIReport(url, prompt);
      console.log('Informe generado exitosamente, actualizando base de datos...');
      console.log('Secciones disponibles:', Object.keys(sections));
      
      // Create properly typed content object ensuring it's JSON serializable
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
        pageSpeedData: pageSpeedData || null,
        // Include business profile if available
        businessProfile: businessProfile || null,
        // Include SEO report data if available, ensuring it's serializable
        seoReportData: seoReport ? JSON.parse(JSON.stringify(seoReport)) : null
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
      
      console.log('Informe actualizado exitosamente a estado "completed"');
      
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
        customPrompt: completedReport.custom_prompt,
        notes: completedReport.notes,
        hasBusinessProfile: completedReport.has_business_profile
      };
      
      toast.success('Informe generado exitosamente');
      return formattedCompletedReport;
    } catch (openaiError: any) {
      console.error('Error en generación con OpenAI:', openaiError);
      
      // Instead of throwing the error, update the report with a failed status
      // but also create a minimal report with empty sections
      const defaultMessage = 'Esta sección no pudo ser generada correctamente. Por favor, edite esta sección manualmente.';
      
      // Create a minimal content object with empty sections
      const fallbackContent = {
        executiveSummary: defaultMessage,
        technicalAnalysis: defaultMessage,
        contentAnalysis: defaultMessage,
        backlinksAnalysis: '',
        recommendations: defaultMessage,
        localSeo: '',
        serviceProposal: '',
        keywords: '',
        pageSpeedData: pageSpeedData || null,
        businessProfile: businessProfile || null,
        seoReportData: seoReport ? JSON.parse(JSON.stringify(seoReport)) : null
      };
      
      try {
        // Update the report with fallback content
        const { data: failedReport, error: updateError } = await supabase
          .from('reports')
          .update({
            content: fallbackContent,
            summary: `Error al generar informe: ${openaiError.message || 'Error desconocido'}`,
            status: 'completed', // Mark as completed anyway so user can edit
            updated_at: new Date().toISOString()
          })
          .eq('id', reportId)
          .select()
          .single();
          
        if (updateError) {
          console.error('Error al actualizar el informe fallido en Supabase:', updateError);
          throw updateError;
        }
        
        console.log('Informe actualizado con contenido básico debido a error en OpenAI');
        
        // Return the fallback report
        const formattedFallbackReport: Report = {
          id: failedReport.id,
          clientId: failedReport.client_id,
          title: failedReport.title,
          date: failedReport.date,
          status: failedReport.status as 'processing' | 'completed' | 'failed',
          url: failedReport.url,
          summary: failedReport.summary,
          content: failedReport.content && typeof failedReport.content === 'object' 
            ? (failedReport.content as any) as Report['content']
            : undefined,
          customPrompt: failedReport.custom_prompt,
          notes: failedReport.notes,
          hasBusinessProfile: failedReport.has_business_profile
        };
        
        toast.warning('Informe generado con contenido básico debido a un error. Puede editar el informe manualmente.');
        return formattedFallbackReport;
      } catch (fallbackError) {
        console.error('Error al intentar crear informe de respaldo:', fallbackError);
        throw openaiError; // Throw the original error if we couldn't even create a fallback
      }
    }
    
  } catch (apiError: any) {
    console.error('Error al procesar informe con OpenAI:', apiError);
    
    // Capture detailed error information
    const errorMessage = apiError.message || 'Error desconocido en la generación';
    const errorDetails = JSON.stringify(apiError, Object.getOwnPropertyNames(apiError));
    console.error('Detalles del error:', errorDetails);
    
    try {
      // Update report status to failed with detailed error message
      await supabase
        .from('reports')
        .update({ 
          status: 'failed',
          summary: `Error: ${errorMessage.substring(0, 200)}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);
      
      console.log('Estado del informe actualizado a "failed" con mensaje:', errorMessage);
      toast.error(`Error al generar el informe: ${errorMessage}`);
    } catch (updateError) {
      console.error('Error adicional al intentar marcar el informe como fallido:', updateError);
    }
    
    throw apiError;
  }
};

/**
 * Updates report status to failed in case of error
 */
export const markReportAsFailed = async (reportId: string, errorMessage: string): Promise<void> => {
  try {
    if (reportId) {
      console.log(`Marcando informe ${reportId} como fallido con mensaje: ${errorMessage}`);
      
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'failed',
          summary: `Error: ${errorMessage.substring(0, 200)}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);
      
      if (error) {
        console.error('Error al marcar el informe como fallido:', error);
      } else {
        console.log('Informe marcado como fallido exitosamente');
      }
    }
  } catch (updateError) {
    console.error('Error crítico al marcar el informe como fallido:', updateError);
  }
};

/**
 * Utility function to detect and fix stuck reports
 */
export const checkAndFixStuckReports = async (): Promise<void> => {
  try {
    // Find reports that have been "processing" for more than 10 minutes
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
    
    // Obtener la sesión primero para verificar que el usuario está autenticado
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('No hay sesión activa:', sessionError);
      return;
    }
    
    const { data: stuckReports, error } = await supabase
      .from('reports')
      .select('id, title, updated_at')
      .eq('status', 'processing')
      .lt('updated_at', tenMinutesAgo.toISOString());
    
    if (error) {
      console.error('Error al buscar informes atascados:', error);
      return;
    }
    
    if (stuckReports && stuckReports.length > 0) {
      console.log(`Se encontraron ${stuckReports.length} informes atascados en estado "processing"`);
      
      for (const report of stuckReports) {
        console.log(`Marcando informe atascado como fallido: ${report.id} - ${report.title}`);
        try {
          await markReportAsFailed(
            report.id, 
            `Informe atascado en estado "processing" desde ${report.updated_at}. Posible error en procesamiento de OpenAI.`
          );
        } catch (markError) {
          console.error(`Error al marcar informe ${report.id} como fallido:`, markError);
        }
      }
    }
  } catch (error) {
    console.error('Error al verificar informes atascados:', error);
  }
};
