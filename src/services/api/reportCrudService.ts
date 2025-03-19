
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
      // Safely handle content object
      const reportContent = report.content && typeof report.content === 'object' 
        ? report.content 
        : {
            executiveSummary: '',
            technicalAnalysis: '',
            contentAnalysis: '',
            backlinksAnalysis: '',
            recommendations: ''
          };
      
      return {
        id: report.id,
        clientId: report.client_id,
        title: report.title,
        date: report.date,
        status: report.status as 'processing' | 'completed' | 'failed',
        url: report.url,
        summary: report.summary,
        content: reportContent as Report['content'],
        customPrompt: report.custom_prompt
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
    const { clientId, title, url, summary, content, customPrompt } = data;
    
    // Prepare a properly structured content object that's compatible with Supabase JSON type
    let validContent = content || {
      executiveSummary: '',
      technicalAnalysis: '',
      contentAnalysis: '',
      backlinksAnalysis: '',
      recommendations: ''
    };
    
    console.log('Creating new report with data:', { clientId, title, url, summary });
    
    // Convert the content to a simple object that Supabase can handle
    const supabaseData = {
      client_id: clientId,
      title,
      url,
      summary,
      content: validContent,
      custom_prompt: customPrompt,
      status: 'completed' as 'processing' | 'completed' | 'failed'
    };
    
    const { data: newReport, error } = await supabase
      .from('reports')
      .insert(supabaseData)
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
      content: newReport.content && typeof newReport.content === 'object' 
        ? newReport.content as Report['content']
        : undefined,
      customPrompt: newReport.custom_prompt
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
    
    // Handle content update
    if (data.content !== undefined) {
      dbData.content = data.content;
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
    
    const formattedReport: Report = {
      id: updatedReport.id,
      clientId: updatedReport.client_id,
      title: updatedReport.title,
      date: updatedReport.date,
      status: updatedReport.status as 'processing' | 'completed' | 'failed',
      url: updatedReport.url,
      summary: updatedReport.summary,
      content: updatedReport.content && typeof updatedReport.content === 'object' 
        ? updatedReport.content as Report['content']
        : undefined,
      customPrompt: updatedReport.custom_prompt
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
