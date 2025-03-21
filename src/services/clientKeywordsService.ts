
import { supabase } from '@/integrations/supabase/client';
import { Keyword } from '@/types/report.types';
import { toast } from 'sonner';

/**
 * Gets all keywords for all reports of a specific client
 */
export async function getClientKeywords(clientId: string): Promise<Keyword[]> {
  if (!clientId) {
    return [];
  }
  
  try {
    // First get all reports for this client
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('id')
      .eq('client_id', clientId);
      
    if (reportsError) {
      console.error('Error fetching client reports:', reportsError);
      throw reportsError;
    }
    
    if (!reports || reports.length === 0) {
      return [];
    }
    
    // Get the report IDs
    const reportIds = reports.map(report => report.id);
    
    // Now get all keywords for these reports
    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select('*')
      .in('report_id', reportIds)
      .order('created_at', { ascending: false });
      
    if (keywordsError) {
      console.error('Error fetching keywords:', keywordsError);
      throw keywordsError;
    }
    
    // Transform database fields to match our Keyword interface
    return keywords.map((item: any) => ({
      id: item.id,
      reportId: item.report_id,
      keyword: item.keyword,
      searchVolume: item.search_volume,
      difficulty: item.difficulty,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching client keywords:', error);
    return [];
  }
}

/**
 * Import multiple keywords at once
 */
export async function importKeywords(
  reportId: string, 
  keywords: Array<{ 
    keyword: string; 
    searchVolume?: number; 
    difficulty?: number 
  }>
): Promise<number> {
  if (!reportId || !keywords || keywords.length === 0) {
    return 0;
  }
  
  try {
    // Prepare the data for bulk insert
    const keywordsForDb = keywords.map(kw => ({
      report_id: reportId,
      keyword: kw.keyword,
      search_volume: kw.searchVolume,
      difficulty: kw.difficulty,
      created_at: new Date().toISOString()
    }));
    
    // Insert the keywords in batches of 100 (Supabase limitation)
    let insertedCount = 0;
    const batchSize = 100;
    
    for (let i = 0; i < keywordsForDb.length; i += batchSize) {
      const batch = keywordsForDb.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('keywords')
        .insert(batch)
        .select();
        
      if (error) {
        console.error('Error importing keywords batch:', error);
      } else if (data) {
        insertedCount += data.length;
      }
    }
    
    return insertedCount;
  } catch (error) {
    console.error('Error importing keywords:', error);
    toast.error('Error al importar palabras clave');
    return 0;
  }
}
