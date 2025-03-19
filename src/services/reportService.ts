import { supabase } from '@/integrations/supabase/client';
import { Report, PageSpeedResult } from '@/types/report.types';
import { toast } from 'sonner';
import { extractSectionsFromText } from '@/utils/reportUtils';

/**
 * Fetches all reports from Supabase
 */
export const fetchReports = async () => {
  try {
    const { data: reportsData, error } = await supabase
      .from('reports')
      .select('*, clients!inner(*)')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }

    const formattedReports: Report[] = reportsData.map((report: any) => {
      let formattedContent = report.content;
      
      if (report.content && (
        typeof report.content.executiveSummary !== 'string' ||
        typeof report.content.technicalAnalysis !== 'string' ||
        typeof report.content.contentAnalysis !== 'string' ||
        typeof report.content.backlinksAnalysis !== 'string' ||
        typeof report.content.recommendations !== 'string'
      )) {
        formattedContent = {
          executiveSummary: '',
          technicalAnalysis: '',
          contentAnalysis: '',
          backlinksAnalysis: '',
          recommendations: ''
        };
      }
      
      return {
        id: report.id,
        clientId: report.client_id,
        title: report.title,
        date: report.date,
        status: report.status as 'processing' | 'completed' | 'failed',
        url: report.url,
        summary: report.summary,
        content: formattedContent,
        customPrompt: report.custom_prompt
      };
    });
    
    return formattedReports;
  } catch (error: any) {
    console.error('Error loading reports:', error);
    toast.error(error.message || 'Error al cargar informes');
    throw error;
  }
};

/**
 * Creates a new report in the database
 */
export const createNewReport = async (data: Omit<Report, 'id' | 'date' | 'status'>) => {
  try {
    const { clientId, title, url, summary, content, customPrompt } = data;
    
    // Check if content is properly structured
    const validContent = content || {
      executiveSummary: '',
      technicalAnalysis: '',
      contentAnalysis: '',
      backlinksAnalysis: '',
      recommendations: ''
    };
    
    console.log('Creating new report with data:', { clientId, title, url, summary });
    
    const { data: newReport, error } = await supabase
      .from('reports')
      .insert({
        client_id: clientId,
        title,
        url,
        summary,
        content: validContent,
        custom_prompt: customPrompt,
        status: 'completed' as 'processing' | 'completed' | 'failed'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error in createNewReport Supabase query:', error);
      throw error;
    }
    
    if (!newReport) {
      console.error('No report data returned after insert');
      throw new Error('Error al crear informe: No se devolvieron datos');
    }
    
    console.log('Report created successfully:', newReport);
    
    const formattedReport: Report = {
      id: newReport.id,
      clientId: newReport.client_id,
      title: newReport.title,
      date: newReport.date,
      status: newReport.status as 'processing' | 'completed' | 'failed',
      url: newReport.url,
      summary: newReport.summary,
      content: newReport.content as Report['content'],
      customPrompt: newReport.custom_prompt
    };
    
    toast.success('Informe creado exitosamente');
    return formattedReport;
  } catch (error: any) {
    console.error('Error creating report:', error);
    toast.error(error.message || 'Error al crear informe');
    throw error;
  }
};

/**
 * Updates an existing report in the database
 */
export const updateExistingReport = async (id: string, data: Partial<Report>) => {
  try {
    const dbData: any = {};
    if (data.clientId !== undefined) dbData.client_id = data.clientId;
    if (data.title !== undefined) dbData.title = data.title;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.url !== undefined) dbData.url = data.url;
    if (data.summary !== undefined) dbData.summary = data.summary;
    if (data.content !== undefined) dbData.content = data.content;
    if (data.customPrompt !== undefined) dbData.custom_prompt = data.customPrompt;
    
    const { data: updatedReport, error } = await supabase
      .from('reports')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    const formattedReport: Report = {
      id: updatedReport.id,
      clientId: updatedReport.client_id,
      title: updatedReport.title,
      date: updatedReport.date,
      status: updatedReport.status as 'processing' | 'completed' | 'failed',
      url: updatedReport.url,
      summary: updatedReport.summary,
      content: updatedReport.content as Report['content'],
      customPrompt: updatedReport.custom_prompt
    };
    
    toast.success('Informe actualizado exitosamente');
    return formattedReport;
  } catch (error: any) {
    console.error('Error updating report:', error);
    toast.error(error.message || 'Error al actualizar informe');
    throw error;
  }
};

/**
 * Deletes a report from the database
 */
export const deleteReportById = async (id: string) => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Informe eliminado exitosamente');
  } catch (error: any) {
    console.error('Error deleting report:', error);
    toast.error(error.message || 'Error al eliminar informe');
    throw error;
  }
};

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
    
    // Fetch desktop results
    const desktopResponse = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=desktop`
    );
    
    if (!desktopResponse.ok) {
      throw new Error(`Error al obtener datos de PageSpeed para desktop: ${desktopResponse.statusText}`);
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
      throw new Error(`Error al obtener datos de PageSpeed para mobile: ${mobileResponse.statusText}`);
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
  } catch (error: any) {
    console.error('Error fetching PageSpeed data:', error);
    throw error;
  }
};

/**
 * Generates an SEO report using OpenAI
 */
export const generateSeoReport = async (
  clientId: string,
  url: string,
  files: File[],
  customPrompt?: string
): Promise<Report> => {
  try {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('No active session');
    }

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
          recommendations: ''
        },
        custom_prompt: customPrompt || ''
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    console.log('Created initial report:', newReport);

    // Start the report generation process
    processReportGeneration(newReport.id, clientId, url, files, customPrompt);

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
      customPrompt: newReport.custom_prompt
    };
  } catch (error: any) {
    console.error('Error in generateSeoReport:', error);
    toast.error('Error al iniciar generación del informe');
    throw error;
  }
};

const processReportGeneration = async (
  reportId: string,
  clientId: string,
  url: string,
  files: File[],
  customPrompt?: string
) => {
  try {
    // Upload supporting files if any
    if (files.length > 0) {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${clientId}/${reportId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('seo-files')
          .upload(fileName, file);
          
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
        }
      }
    }
    
    // Fetch PageSpeed Insights data if Google API key is available
    let pageSpeedData = null;
    try {
      pageSpeedData = await fetchPageSpeedData(url);
      
      if (pageSpeedData) {
        toast.success('Datos de PageSpeed obtenidos correctamente');
      }
    } catch (pageSpeedError) {
      console.error('Error fetching PageSpeed data:', pageSpeedError);
      toast.error('Error al obtener datos de PageSpeed');
    }
    
    let prompt = customPrompt || localStorage.getItem('default_seo_prompt') || '';
    prompt = prompt.replace('[DOMINIO]', new URL(url).hostname);
    
    // Add PageSpeed data to prompt if available
    if (pageSpeedData) {
      const pageSpeedSummary = `
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
      
      prompt += "\n\nA continuación se incluyen datos obtenidos de Google PageSpeed Insights. Utiliza esta información para enriquecer la sección de Análisis Técnico del informe:\n" + pageSpeedSummary;
    }
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key') || ''}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: prompt
            },
            {
              role: "user",
              content: `Analiza el sitio web ${url}. Genera un informe SEO basado en el prompt proporcionado.`
            }
          ],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API de OpenAI: ${response.statusText}`);
      }
      
      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      
      const sections = extractSectionsFromText(generatedText);
      
      // Update report with generated content and PageSpeed data
      const updateData: any = {
        content: {
          executiveSummary: sections.executiveSummary || '',
          technicalAnalysis: sections.technicalAnalysis || '',
          contentAnalysis: sections.contentAnalysis || '',
          backlinksAnalysis: sections.backlinksAnalysis || '',
          recommendations: sections.recommendations || ''
        },
        summary: sections.summary || 'Análisis SEO completo del sitio web.',
        status: 'completed',
        updated_at: new Date().toISOString()
      };
      
      // Add PageSpeed data if available
      if (pageSpeedData) {
        updateData.page_speed_data = pageSpeedData;
      }
      
      const { data: completedReport, error: updateError } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', reportId)
        .select()
        .single();
        
      if (updateError) {
        throw updateError;
      }
      
      // Convert the database column names to camelCase for the Report interface
      const formattedCompletedReport: Report = {
        id: completedReport.id,
        clientId: completedReport.client_id,
        title: completedReport.title,
        date: completedReport.date,
        status: completedReport.status as 'processing' | 'completed' | 'failed',
        url: completedReport.url,
        summary: completedReport.summary,
        content: completedReport.content as Report['content'],
        customPrompt: completedReport.custom_prompt,
        pageSpeedData: (completedReport as any).page_speed_data as Report['pageSpeedData']
      };
      
      toast.success('Informe generado exitosamente');
      return formattedCompletedReport;
      
    } catch (apiError: any) {
      console.error('Error calling OpenAI API:', apiError);
      
      // Update report status to failed
      await supabase
        .from('reports')
        .update({ 
          status: 'failed' as 'processing' | 'completed' | 'failed',
          summary: `Error: ${apiError.message}`
        })
        .eq('id', reportId);
        
      toast.error('Error al generar el informe con la API de OpenAI');
      throw apiError;
    }
    
  } catch (error: any) {
    console.error('Error generating report:', error);
    
    try {
      if (error.reportId) {
        await supabase
          .from('reports')
          .update({ status: 'failed' as 'processing' | 'completed' | 'failed' })
          .eq('id', error.reportId);
      }
    } catch (updateError) {
      console.error('Error updating report status to failed:', updateError);
    }
    
    toast.error('Error al generar informe');
    throw error;
  }
};
