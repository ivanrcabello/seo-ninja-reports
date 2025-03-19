
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';
import { handleServiceError } from './baseService';

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
      
      // Extract pageSpeedData if it exists in content
      const pageSpeedData = formattedContent?.pageSpeedData;
      
      return {
        id: report.id,
        clientId: report.client_id,
        title: report.title,
        date: report.date,
        status: report.status as 'processing' | 'completed' | 'failed',
        url: report.url,
        summary: report.summary,
        content: formattedContent,
        customPrompt: report.custom_prompt,
        pageSpeedData: pageSpeedData
      };
    });
    
    return formattedReports;
  } catch (error: any) {
    return handleServiceError(error, 'Error al cargar informes');
  }
};

/**
 * Creates a new report in the database
 */
export const createNewReport = async (data: Omit<Report, 'id' | 'date' | 'status'>) => {
  try {
    const { clientId, title, url, summary, content, customPrompt, pageSpeedData } = data;
    
    // Check if content is properly structured
    let validContent: any = content || {
      executiveSummary: '',
      technicalAnalysis: '',
      contentAnalysis: '',
      backlinksAnalysis: '',
      recommendations: ''
    };
    
    // Add pageSpeedData to content if it exists
    if (pageSpeedData) {
      validContent = {
        ...validContent,
        pageSpeedData
      };
    }
    
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
    
    // Extract pageSpeedData from content if it exists
    const extractedPageSpeedData = newReport.content?.pageSpeedData;
    
    const formattedReport: Report = {
      id: newReport.id,
      clientId: newReport.client_id,
      title: newReport.title,
      date: newReport.date,
      status: newReport.status as 'processing' | 'completed' | 'failed',
      url: newReport.url,
      summary: newReport.summary,
      content: newReport.content as Report['content'],
      customPrompt: newReport.custom_prompt,
      pageSpeedData: extractedPageSpeedData
    };
    
    toast.success('Informe creado exitosamente');
    return formattedReport;
  } catch (error: any) {
    return handleServiceError(error, 'Error al crear informe');
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
    
    // Handle content and pageSpeedData together
    if (data.content !== undefined || data.pageSpeedData !== undefined) {
      const content = { ...data.content };
      if (data.pageSpeedData) {
        content.pageSpeedData = data.pageSpeedData;
      }
      dbData.content = content;
    }
    
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
    
    // Extract pageSpeedData from content if it exists
    const extractedPageSpeedData = updatedReport.content?.pageSpeedData;
    
    const formattedReport: Report = {
      id: updatedReport.id,
      clientId: updatedReport.client_id,
      title: updatedReport.title,
      date: updatedReport.date,
      status: updatedReport.status as 'processing' | 'completed' | 'failed',
      url: updatedReport.url,
      summary: updatedReport.summary,
      content: updatedReport.content as Report['content'],
      customPrompt: updatedReport.custom_prompt,
      pageSpeedData: extractedPageSpeedData
    };
    
    toast.success('Informe actualizado exitosamente');
    return formattedReport;
  } catch (error: any) {
    return handleServiceError(error, 'Error al actualizar informe');
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
    return handleServiceError(error, 'Error al eliminar informe');
  }
};
