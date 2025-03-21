
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';

/**
 * Fetches all reports for the current user
 */
export const fetchReports = async (): Promise<Report[]> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        id, 
        client_id,
        title,
        date,
        status,
        url,
        summary,
        content,
        custom_prompt,
        notes,
        has_business_profile
      `)
      .order('date', { ascending: false });

    if (error) {
      toast.error('Error al cargar informes', {
        description: error.message,
      });
      throw error;
    }

    return data.map(report => ({
      id: report.id,
      clientId: report.client_id,
      title: report.title,
      date: report.date,
      status: report.status as 'processing' | 'completed' | 'failed',
      url: report.url,
      summary: report.summary,
      content: report.content ? (report.content as unknown as Report['content']) : undefined,
      customPrompt: report.custom_prompt,
      notes: report.notes,
      hasBusinessProfile: report.has_business_profile
    }));
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

/**
 * Creates a new report
 */
export const createNewReport = async (data: Omit<Report, 'id' | 'date' | 'status'>): Promise<Report> => {
  try {
    // Convert content to a JSON-compatible structure
    const contentForDb = data.content ? JSON.parse(JSON.stringify(data.content)) : null;
    
    const { data: reportData, error } = await supabase
      .from('reports')
      .insert({
        client_id: data.clientId,
        title: data.title,
        url: data.url,
        summary: data.summary || '',
        content: contentForDb,
        custom_prompt: data.customPrompt || '',
        notes: data.notes || '',
        status: 'completed'
      })
      .select()
      .single();

    if (error) {
      toast.error('Error al crear informe', {
        description: error.message,
      });
      throw error;
    }

    return {
      id: reportData.id,
      clientId: reportData.client_id,
      title: reportData.title,
      date: reportData.date,
      status: reportData.status as 'processing' | 'completed' | 'failed',
      url: reportData.url,
      summary: reportData.summary,
      content: reportData.content ? (reportData.content as unknown as Report['content']) : undefined,
      customPrompt: reportData.custom_prompt,
      notes: reportData.notes
    };
  } catch (error: any) {
    console.error('Error creating report:', error);
    throw error;
  }
};

/**
 * Updates an existing report
 */
export const updateExistingReport = async (id: string, data: Partial<Report>): Promise<Report> => {
  try {
    // Create an object with only the fields we need to update
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.content !== undefined) {
      // Convert content to a JSON-compatible structure
      updateData.content = JSON.parse(JSON.stringify(data.content));
    }
    if (data.status !== undefined) updateData.status = data.status;
    if (data.customPrompt !== undefined) updateData.custom_prompt = data.customPrompt;
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    const { data: reportData, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Error al actualizar informe', {
        description: error.message,
      });
      throw error;
    }

    return {
      id: reportData.id,
      clientId: reportData.client_id,
      title: reportData.title,
      date: reportData.date,
      status: reportData.status as 'processing' | 'completed' | 'failed',
      url: reportData.url,
      summary: reportData.summary,
      content: reportData.content ? (reportData.content as unknown as Report['content']) : undefined,
      customPrompt: reportData.custom_prompt,
      notes: reportData.notes,
      hasBusinessProfile: reportData.has_business_profile
    };
  } catch (error: any) {
    console.error('Error updating report:', error);
    throw error;
  }
};

/**
 * Deletes a report by ID
 */
export const deleteReportById = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error al eliminar informe', {
        description: error.message,
      });
      throw error;
    }

    toast.success('Informe eliminado correctamente');
  } catch (error: any) {
    console.error('Error deleting report:', error);
    throw error;
  }
};
