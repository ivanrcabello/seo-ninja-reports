
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Deletes a SEO report and all its related data
 */
export const deleteSeoReport = async (reportId: string): Promise<boolean> => {
  try {
    console.log('Deleting SEO report:', reportId);
    
    // Start a transaction by deleting related data first
    
    // 1. Delete keywords
    const { error: keywordsError } = await supabase
      .from('seo_keywords')
      .delete()
      .eq('report_id', reportId);
      
    if (keywordsError) {
      console.error('Error deleting SEO keywords:', keywordsError);
      throw keywordsError;
    }
    
    // 2. Delete competitors
    const { error: competitorsError } = await supabase
      .from('seo_competitors')
      .delete()
      .eq('report_id', reportId);
      
    if (competitorsError) {
      console.error('Error deleting SEO competitors:', competitorsError);
      throw competitorsError;
    }
    
    // 3. Finally delete the report itself
    const { error: reportError } = await supabase
      .from('seo_reports')
      .delete()
      .eq('id', reportId);
      
    if (reportError) {
      console.error('Error deleting SEO report:', reportError);
      throw reportError;
    }
    
    console.log('SEO report deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting SEO report:', error);
    toast.error('Error al eliminar informe SEO', {
      description: 'Ocurrió un error al eliminar el informe'
    });
    return false;
  }
};
