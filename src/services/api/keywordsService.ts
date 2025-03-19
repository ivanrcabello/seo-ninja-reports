
import { supabase } from '@/integrations/supabase/client';
import { Keyword } from '@/types/report.types';

/**
 * Fetches keywords for a specific report
 */
export async function getKeywords(reportId: string): Promise<Keyword[]> {
  if (!reportId) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('keywords')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
    
    // Transform database fields to match our Keyword interface
    const formattedKeywords = data.map((item: any) => ({
      id: item.id,
      reportId: item.report_id,
      keyword: item.keyword,
      searchVolume: item.search_volume,
      difficulty: item.difficulty,
      createdAt: item.created_at
    }));
    
    return formattedKeywords;
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return [];
  }
}
