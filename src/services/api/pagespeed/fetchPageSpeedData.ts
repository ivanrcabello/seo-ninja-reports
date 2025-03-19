
import { PageSpeedResult } from '@/types/report.types';
import { toast } from 'sonner';
import { savePageSpeedData } from './savePageSpeedData';

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
    
    // Desktop fetch with better error handling
    try {
      console.log('Intentando obtener datos de PageSpeed para desktop...');
      const desktopUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=desktop`;
      console.log('URL de petición desktop:', desktopUrl.replace(apiKey, 'API_KEY_REDACTED'));
      
      const desktopResponse = await fetch(desktopUrl);
      
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
      
      // Mobile fetch with better error handling
      console.log('Intentando obtener datos de PageSpeed para mobile...');
      const mobileUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`;
      console.log('URL de petición mobile:', mobileUrl.replace(apiKey, 'API_KEY_REDACTED'));
      
      const mobileResponse = await fetch(mobileUrl);
      
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
        console.log('Guardando datos en la base de datos para reporte:', reportId);
        const rawData = { desktop: desktopData, mobile: mobileData };
        await savePageSpeedData(reportId, url, results, rawData);
      }
      
      return results;
    } catch (apiError: any) {
      console.error('Error específico de la API de PageSpeed:', apiError);
      // Si solo tenemos datos de desktop, seguimos adelante con eso
      if (Object.keys(results.desktop).length > 0) {
        console.log('Continuando con datos parciales (solo desktop)');
        
        // Guardar datos parciales si tenemos reportId
        if (reportId) {
          await savePageSpeedData(reportId, url, results);
        }
        
        return results;
      }
      
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
