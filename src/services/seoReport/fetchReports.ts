
import { supabase } from '@/integrations/supabase/client';
import { SeoReport } from '@/types/seo-reporting.types';

/**
 * Fetches all SEO reports for a specific client
 */
export const fetchClientSeoReports = async (clientId: string): Promise<SeoReport[]> => {
  try {
    console.log('Fetching SEO reports for client:', clientId);
    const { data: reports, error } = await supabase
      .from('seo_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log('Raw reports from database:', reports);

    const reportsWithData = await Promise.all(
      reports.map(async (report) => {
        const { data: keywords, error: keywordsError } = await supabase
          .from('seo_keywords')
          .select('*')
          .eq('report_id', report.id)
          .order('position', { ascending: true });

        if (keywordsError) {
          console.error('Error fetching keywords:', keywordsError);
        }

        const { data: competitors, error: competitorsError } = await supabase
          .from('seo_competitors')
          .select('*')
          .eq('report_id', report.id)
          .order('keywords_overlap', { ascending: false });

        if (competitorsError) {
          console.error('Error fetching competitors:', competitorsError);
        }

        console.log(`Report ${report.id} has ${keywords?.length || 0} keywords and ${competitors?.length || 0} competitors`);

        return {
          id: report.id,
          clientId: report.client_id,
          domain: report.domain,
          traffic: report.traffic,
          keywords: report.keywords,
          backlinks: report.backlinks,
          createdAt: report.created_at,
          updatedAt: report.updated_at,
          keywordsData: keywords ? keywords.map(k => ({
            id: k.id,
            reportId: k.report_id,
            keyword: k.keyword,
            position: k.position,
            volume: k.volume,
            trafficPercent: k.traffic_percent,
            createdAt: k.created_at
          })) : [],
          competitorsData: competitors ? competitors.map(c => ({
            id: c.id,
            reportId: c.report_id,
            domain: c.domain,
            keywordsOverlap: c.keywords_overlap,
            competitionLevel: c.competition_level,
            createdAt: c.created_at
          })) : []
        };
      })
    );

    console.log('Fetched reports with data:', reportsWithData);
    return reportsWithData;
  } catch (error) {
    console.error('Error fetching SEO reports:', error);
    throw error;
  }
};
