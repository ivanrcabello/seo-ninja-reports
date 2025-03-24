
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a crawl record
 */
export async function deleteCrawlRecord(crawlId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .delete()
      .eq('id', crawlId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting crawl record:', error);
    return false;
  }
}
