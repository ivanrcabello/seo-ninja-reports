
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
        const rawData = { desktop: desktopData, mobile: mobileData };
        await savePageSpeedData(reportId, url, results, rawData);
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
