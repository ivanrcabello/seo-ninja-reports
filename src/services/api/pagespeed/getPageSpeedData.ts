
import { supabase } from '@/integrations/supabase/client';

/**
 * Retrieves PageSpeed data from the database for a specific report
 */
export const getPageSpeedData = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('pagespeed_data')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error al obtener datos de PageSpeed:', error);
      throw error;
    }
    
    if (!data) {
      console.log('No se encontraron datos de PageSpeed para el reporte:', reportId);
      return null;
    }
    
    console.log('Datos de PageSpeed obtenidos correctamente para el reporte:', reportId);
    
    // Transform data back to the format used in the application
    return {
      desktop: {
        performance: data.desktop_performance,
        accessibility: data.desktop_accessibility,
        bestPractices: data.desktop_best_practices,
        seo: data.desktop_seo,
        firstContentfulPaint: data.desktop_first_contentful_paint,
        speedIndex: data.desktop_speed_index,
        largestContentfulPaint: data.desktop_largest_contentful_paint,
        timeToInteractive: data.desktop_time_to_interactive,
        totalBlockingTime: data.desktop_total_blocking_time,
        cumulativeLayoutShift: data.desktop_cumulative_layout_shift
      },
      mobile: {
        performance: data.mobile_performance,
        accessibility: data.mobile_accessibility,
        bestPractices: data.mobile_best_practices,
        seo: data.mobile_seo,
        firstContentfulPaint: data.mobile_first_contentful_paint,
        speedIndex: data.mobile_speed_index,
        largestContentfulPaint: data.mobile_largest_contentful_paint,
        timeToInteractive: data.mobile_time_to_interactive,
        totalBlockingTime: data.mobile_total_blocking_time,
        cumulativeLayoutShift: data.mobile_cumulative_layout_shift
      },
      rawData: data.raw_data
    };
  } catch (error) {
    console.error('Error retrieving PageSpeed data:', error);
    return null;
  }
};
