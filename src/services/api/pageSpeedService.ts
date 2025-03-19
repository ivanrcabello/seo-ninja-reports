
import { PageSpeedResult } from '@/types/report.types';
import { toast } from 'sonner';

/**
 * Fetches PageSpeed Insights data from Google API
 */
export const fetchPageSpeedData = async (url: string) => {
  try {
    const apiKey = localStorage.getItem('google_pagespeed_api_key');
    
    if (!apiKey) {
      console.warn('No se ha configurado la API key de Google PageSpeed');
      return null;
    }
    
    const results = {
      desktop: {} as PageSpeedResult,
      mobile: {} as PageSpeedResult
    };
    
    try {
      // Fetch desktop results
      const desktopResponse = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=desktop`
      );
      
      if (!desktopResponse.ok) {
        const errorData = await desktopResponse.json();
        throw new Error(`Error al obtener datos de PageSpeed para desktop: ${errorData.error?.message || desktopResponse.statusText}`);
      }
      
      const desktopData = await desktopResponse.json();
      
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
      const mobileResponse = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`
      );
      
      if (!mobileResponse.ok) {
        const errorData = await mobileResponse.json();
        throw new Error(`Error al obtener datos de PageSpeed para mobile: ${errorData.error?.message || mobileResponse.statusText}`);
      }
      
      const mobileData = await mobileResponse.json();
      
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
      
      return results;
    } catch (apiError: any) {
      console.error('Error específico de la API de PageSpeed:', apiError.message);
      // No lanzamos el error para que no interrumpa el proceso
      toast.error('No se pudo obtener datos de PageSpeed. El informe se generará sin esta información.');
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching PageSpeed data:', error);
    // No lanzamos el error para que no interrumpa el proceso
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
