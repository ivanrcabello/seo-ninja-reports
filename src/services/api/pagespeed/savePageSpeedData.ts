
import { supabase } from '@/integrations/supabase/client';
import { PageSpeedResult } from '@/types/report.types';

/**
 * Saves PageSpeed data to the database
 */
export const savePageSpeedData = async (
  reportId: string,
  url: string,
  results: {
    desktop: PageSpeedResult;
    mobile: PageSpeedResult;
  },
  rawData?: any
) => {
  try {
    console.log('Guardando datos de PageSpeed en la base de datos para el reporte:', reportId);
    
    // Check if a record already exists for this report
    const { data: existing, error: checkError } = await supabase
      .from('pagespeed_data')
      .select('id')
      .eq('report_id', reportId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error al verificar existencia de datos de PageSpeed:', checkError);
    }
    
    let data;
    let error;
    
    // Create the PageSpeed data object
    const pageSpeedData = {
      report_id: reportId,
      url: url,
      desktop_performance: results.desktop.performance || 0,
      desktop_accessibility: results.desktop.accessibility || 0,
      desktop_best_practices: results.desktop.bestPractices || 0,
      desktop_seo: results.desktop.seo || 0,
      desktop_first_contentful_paint: results.desktop.firstContentfulPaint || null,
      desktop_speed_index: results.desktop.speedIndex || null,
      desktop_largest_contentful_paint: results.desktop.largestContentfulPaint || null,
      desktop_time_to_interactive: results.desktop.timeToInteractive || null,
      desktop_total_blocking_time: results.desktop.totalBlockingTime || null,
      desktop_cumulative_layout_shift: results.desktop.cumulativeLayoutShift || null,
      mobile_performance: results.mobile.performance || 0,
      mobile_accessibility: results.mobile.accessibility || 0,
      mobile_best_practices: results.mobile.bestPractices || 0,
      mobile_seo: results.mobile.seo || 0,
      mobile_first_contentful_paint: results.mobile.firstContentfulPaint || null,
      mobile_speed_index: results.mobile.speedIndex || null,
      mobile_largest_contentful_paint: results.mobile.largestContentfulPaint || null,
      mobile_time_to_interactive: results.mobile.timeToInteractive || null,
      mobile_total_blocking_time: results.mobile.totalBlockingTime || null,
      mobile_cumulative_layout_shift: results.mobile.cumulativeLayoutShift || null,
      raw_data: rawData || null
    };
    
    console.log('Objeto de datos PageSpeed preparado:', { reportId, url });
    
    // If a record exists, update it; otherwise, insert a new one
    if (existing?.id) {
      console.log('Actualizando registro existente con ID:', existing.id);
      const result = await supabase
        .from('pagespeed_data')
        .update(pageSpeedData)
        .eq('id', existing.id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      console.log('Insertando nuevo registro de PageSpeed data');
      const result = await supabase
        .from('pagespeed_data')
        .insert(pageSpeedData)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error('Error al guardar datos de PageSpeed:', error);
      throw error;
    }
    
    console.log('Datos de PageSpeed guardados correctamente con ID:', data?.id);
    
    // First, get the current content
    const { data: reportData, error: selectError } = await supabase
      .from('reports')
      .select('content')
      .eq('id', reportId)
      .maybeSingle();
    
    if (selectError) {
      console.error('Error al obtener el contenido actual del informe:', selectError);
    }
    
    // Ensure we have a valid content object to work with
    const currentContent = reportData?.content && typeof reportData.content === 'object' 
      ? reportData.content 
      : {};
    
    // Convert PageSpeed results to a format compatible with Json type (plain objects)
    const jsonCompatiblePageSpeedData = {
      desktop: {
        performance: results.desktop.performance,
        accessibility: results.desktop.accessibility,
        bestPractices: results.desktop.bestPractices,
        seo: results.desktop.seo,
        firstContentfulPaint: results.desktop.firstContentfulPaint,
        speedIndex: results.desktop.speedIndex,
        largestContentfulPaint: results.desktop.largestContentfulPaint,
        timeToInteractive: results.desktop.timeToInteractive,
        totalBlockingTime: results.desktop.totalBlockingTime,
        cumulativeLayoutShift: results.desktop.cumulativeLayoutShift
      },
      mobile: {
        performance: results.mobile.performance,
        accessibility: results.mobile.accessibility,
        bestPractices: results.mobile.bestPractices,
        seo: results.mobile.seo,
        firstContentfulPaint: results.mobile.firstContentfulPaint,
        speedIndex: results.mobile.speedIndex,
        largestContentfulPaint: results.mobile.largestContentfulPaint,
        timeToInteractive: results.mobile.timeToInteractive,
        totalBlockingTime: results.mobile.totalBlockingTime,
        cumulativeLayoutShift: results.mobile.cumulativeLayoutShift
      }
    };
    
    console.log('Actualizando informe con datos de PageSpeed');
    
    // Now update with the PageSpeed data
    const { error: reportUpdateError } = await supabase
      .from('reports')
      .update({
        content: {
          ...currentContent,
          pageSpeedData: jsonCompatiblePageSpeedData
        }
      })
      .eq('id', reportId);
    
    if (reportUpdateError) {
      console.error('Error al actualizar el informe con datos de PageSpeed:', reportUpdateError);
    }
    
    return data;
  } catch (error) {
    console.error('Error guardando datos de PageSpeed:', error);
    // No lanzamos el error para que no interrumpa el proceso
    return null;
  }
};
