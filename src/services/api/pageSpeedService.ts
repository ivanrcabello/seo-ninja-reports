
import { PageSpeedResult } from '@/types/report.types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Fetches PageSpeed Insights data from Google API
 */
export const fetchPageSpeedData = async (url: string, reportId?: string) => {
  try {
    const apiKey = localStorage.getItem('google_pagespeed_api_key');
    
    if (!apiKey) {
      console.log('No se ha configurado la API key de Google PageSpeed');
      return null;
    }
    
    const results = {
      desktop: {} as PageSpeedResult,
      mobile: {} as PageSpeedResult
    };
    
    try {
      // Fetch desktop results
      console.log('Intentando obtener datos de PageSpeed para desktop...');
      const desktopResponse = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=desktop`
      );
      
      if (!desktopResponse.ok) {
        const errorData = await desktopResponse.json();
        console.error('Error en respuesta de PageSpeed desktop:', errorData);
        throw new Error(`Error al obtener datos de PageSpeed para desktop: ${errorData.error?.message || desktopResponse.statusText}`);
      }
      
      const desktopData = await desktopResponse.json();
      console.log('Datos de PageSpeed desktop obtenidos correctamente');
      
      // Extract desktop metrics
      if (desktopData.lighthouseResult && desktopData.lighthouseResult.categories) {
        const categories = desktopData.lighthouseResult.categories;
        results.desktop.performance = categories.performance?.score * 100 || 0;
        results.desktop.accessibility = categories.accessibility?.score * 100 || 0;
        results.desktop.bestPractices = categories['best-practices']?.score * 100 || 0;
        results.desktop.seo = categories.seo?.score * 100 || 0;
        
        // Extract audits if available
        const audits = desktopData.lighthouseResult.audits;
        if (audits) {
          results.desktop.firstContentfulPaint = audits['first-contentful-paint']?.numericValue;
          results.desktop.speedIndex = audits['speed-index']?.numericValue;
          results.desktop.largestContentfulPaint = audits['largest-contentful-paint']?.numericValue;
          results.desktop.timeToInteractive = audits['interactive']?.numericValue;
          results.desktop.totalBlockingTime = audits['total-blocking-time']?.numericValue;
          results.desktop.cumulativeLayoutShift = audits['cumulative-layout-shift']?.numericValue;
        }
      }
      
      // Fetch mobile results
      console.log('Intentando obtener datos de PageSpeed para mobile...');
      const mobileResponse = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`
      );
      
      if (!mobileResponse.ok) {
        const errorData = await mobileResponse.json();
        console.error('Error en respuesta de PageSpeed mobile:', errorData);
        throw new Error(`Error al obtener datos de PageSpeed para mobile: ${errorData.error?.message || mobileResponse.statusText}`);
      }
      
      const mobileData = await mobileResponse.json();
      console.log('Datos de PageSpeed mobile obtenidos correctamente');
      
      // Extract mobile metrics
      if (mobileData.lighthouseResult && mobileData.lighthouseResult.categories) {
        const categories = mobileData.lighthouseResult.categories;
        results.mobile.performance = categories.performance?.score * 100 || 0;
        results.mobile.accessibility = categories.accessibility?.score * 100 || 0;
        results.mobile.bestPractices = categories['best-practices']?.score * 100 || 0;
        results.mobile.seo = categories.seo?.score * 100 || 0;
        
        // Extract audits if available
        const audits = mobileData.lighthouseResult.audits;
        if (audits) {
          results.mobile.firstContentfulPaint = audits['first-contentful-paint']?.numericValue;
          results.mobile.speedIndex = audits['speed-index']?.numericValue;
          results.mobile.largestContentfulPaint = audits['largest-contentful-paint']?.numericValue;
          results.mobile.timeToInteractive = audits['interactive']?.numericValue;
          results.mobile.totalBlockingTime = audits['total-blocking-time']?.numericValue;
          results.mobile.cumulativeLayoutShift = audits['cumulative-layout-shift']?.numericValue;
        }
      }
      
      // Save PageSpeed data to dedicated table if reportId is provided
      if (reportId) {
        await savePageSpeedData(reportId, url, results, { desktop: desktopData, mobile: mobileData });
      }
      
      return results;
    } catch (apiError: any) {
      console.error('Error específico de la API de PageSpeed:', apiError.message);
      // No lanzamos el error para que no interrumpa el proceso
      toast.error('No se pudo obtener datos de PageSpeed. El informe se generará sin esta información.', {
        description: apiError.message
      });
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching PageSpeed data:', error);
    // No lanzamos el error para que no interrumpa el proceso
    return null;
  }
};

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
    
    const { data, error } = await supabase
      .from('pagespeed_data')
      .insert({
        report_id: reportId,
        url: url,
        desktop_performance: results.desktop.performance,
        desktop_accessibility: results.desktop.accessibility,
        desktop_best_practices: results.desktop.bestPractices,
        desktop_seo: results.desktop.seo,
        desktop_first_contentful_paint: results.desktop.firstContentfulPaint,
        desktop_speed_index: results.desktop.speedIndex,
        desktop_largest_contentful_paint: results.desktop.largestContentfulPaint,
        desktop_time_to_interactive: results.desktop.timeToInteractive,
        desktop_total_blocking_time: results.desktop.totalBlockingTime,
        desktop_cumulative_layout_shift: results.desktop.cumulativeLayoutShift,
        mobile_performance: results.mobile.performance,
        mobile_accessibility: results.mobile.accessibility,
        mobile_best_practices: results.mobile.bestPractices,
        mobile_seo: results.mobile.seo,
        mobile_first_contentful_paint: results.mobile.firstContentfulPaint,
        mobile_speed_index: results.mobile.speedIndex,
        mobile_largest_contentful_paint: results.mobile.largestContentfulPaint,
        mobile_time_to_interactive: results.mobile.timeToInteractive,
        mobile_total_blocking_time: results.mobile.totalBlockingTime,
        mobile_cumulative_layout_shift: results.mobile.cumulativeLayoutShift,
        raw_data: rawData || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error al guardar datos de PageSpeed:', error);
      throw error;
    }
    
    console.log('Datos de PageSpeed guardados correctamente con ID:', data.id);
    return data;
  } catch (error) {
    console.error('Error guardando datos de PageSpeed:', error);
    // No lanzamos el error para que no interrumpa el proceso
    return null;
  }
};

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

/**
 * Formats PageSpeed data as string for use in prompts
 */
export const formatPageSpeedData = (pageSpeedData: {
  desktop: PageSpeedResult;
  mobile: PageSpeedResult;
}) => {
  return `
Datos de PageSpeed Insights:

MÓVIL:
- Rendimiento: ${pageSpeedData.mobile.performance.toFixed(0)}%
- Accesibilidad: ${pageSpeedData.mobile.accessibility.toFixed(0)}%
- Mejores Prácticas: ${pageSpeedData.mobile.bestPractices.toFixed(0)}%
- SEO: ${pageSpeedData.mobile.seo.toFixed(0)}%
- Métricas Clave: 
  * First Contentful Paint: ${(pageSpeedData.mobile.firstContentfulPaint ? (pageSpeedData.mobile.firstContentfulPaint / 1000).toFixed(2) : 'N/A')}s
  * Largest Contentful Paint: ${(pageSpeedData.mobile.largestContentfulPaint ? (pageSpeedData.mobile.largestContentfulPaint / 1000).toFixed(2) : 'N/A')}s
  * Time to Interactive: ${(pageSpeedData.mobile.timeToInteractive ? (pageSpeedData.mobile.timeToInteractive / 1000).toFixed(2) : 'N/A')}s
  * Total Blocking Time: ${(pageSpeedData.mobile.totalBlockingTime ? pageSpeedData.mobile.totalBlockingTime.toFixed(0) : 'N/A')}ms
  * Cumulative Layout Shift: ${pageSpeedData.mobile.cumulativeLayoutShift?.toFixed(2) || 'N/A'}

ESCRITORIO:
- Rendimiento: ${pageSpeedData.desktop.performance.toFixed(0)}%
- Accesibilidad: ${pageSpeedData.desktop.accessibility.toFixed(0)}%
- Mejores Prácticas: ${pageSpeedData.desktop.bestPractices.toFixed(0)}%
- SEO: ${pageSpeedData.desktop.seo.toFixed(0)}%
- Métricas Clave: 
  * First Contentful Paint: ${(pageSpeedData.desktop.firstContentfulPaint ? (pageSpeedData.desktop.firstContentfulPaint / 1000).toFixed(2) : 'N/A')}s
  * Largest Contentful Paint: ${(pageSpeedData.desktop.largestContentfulPaint ? (pageSpeedData.desktop.largestContentfulPaint / 1000).toFixed(2) : 'N/A')}s
  * Time to Interactive: ${(pageSpeedData.desktop.timeToInteractive ? (pageSpeedData.desktop.timeToInteractive / 1000).toFixed(2) : 'N/A')}s
  * Total Blocking Time: ${(pageSpeedData.desktop.totalBlockingTime ? pageSpeedData.desktop.totalBlockingTime.toFixed(0) : 'N/A')}ms
  * Cumulative Layout Shift: ${pageSpeedData.desktop.cumulativeLayoutShift?.toFixed(2) || 'N/A'}
`;
};
