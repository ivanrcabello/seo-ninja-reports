
import { supabase } from '@/integrations/supabase/client';
import { SeoReport, SeoKeyword, SeoCompetitor } from '@/types/seo-reporting.types';
import { toast } from 'sonner';

export const fetchClientSeoReports = async (clientId: string): Promise<SeoReport[]> => {
  try {
    const { data: reports, error } = await supabase
      .from('seo_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // For each report, fetch its keywords and competitors
    const reportsWithData = await Promise.all(
      reports.map(async (report) => {
        // Fetch keywords for this report
        const { data: keywords, error: keywordsError } = await supabase
          .from('seo_keywords')
          .select('*')
          .eq('report_id', report.id)
          .order('position', { ascending: true });

        if (keywordsError) {
          console.error('Error fetching keywords:', keywordsError);
        }

        // Fetch competitors for this report
        const { data: competitors, error: competitorsError } = await supabase
          .from('seo_competitors')
          .select('*')
          .eq('report_id', report.id)
          .order('keywords_overlap', { ascending: false });

        if (competitorsError) {
          console.error('Error fetching competitors:', competitorsError);
        }

        return {
          ...report,
          keywordsData: keywords || [],
          competitorsData: competitors || []
        };
      })
    );

    return reportsWithData;
  } catch (error) {
    console.error('Error fetching SEO reports:', error);
    throw error;
  }
};

export const uploadSeoReport = async (
  clientId: string,
  reportData: {
    domain: string;
    traffic?: number;
    keywords?: number;
    backlinks?: number;
    keywordsData?: Omit<SeoKeyword, 'id' | 'reportId' | 'createdAt'>[];
    competitorsData?: Omit<SeoCompetitor, 'id' | 'reportId' | 'createdAt'>[];
  }
): Promise<SeoReport> => {
  try {
    // Insert the report
    const { data: report, error } = await supabase
      .from('seo_reports')
      .insert({
        client_id: clientId,
        domain: reportData.domain,
        traffic: reportData.traffic,
        keywords: reportData.keywords,
        backlinks: reportData.backlinks
      })
      .select()
      .single();

    if (error) throw error;

    // Insert keywords if provided
    if (reportData.keywordsData && reportData.keywordsData.length > 0) {
      const keywordsToInsert = reportData.keywordsData.map(keyword => ({
        report_id: report.id,
        keyword: keyword.keyword,
        position: keyword.position,
        volume: keyword.volume,
        traffic_percent: keyword.trafficPercent
      }));

      const { error: keywordsError } = await supabase
        .from('seo_keywords')
        .insert(keywordsToInsert);

      if (keywordsError) {
        console.error('Error inserting keywords:', keywordsError);
        toast.error('Error al guardar palabras clave');
      }
    }

    // Insert competitors if provided
    if (reportData.competitorsData && reportData.competitorsData.length > 0) {
      const competitorsToInsert = reportData.competitorsData.map(competitor => ({
        report_id: report.id,
        domain: competitor.domain,
        keywords_overlap: competitor.keywordsOverlap,
        competition_level: competitor.competitionLevel
      }));

      const { error: competitorsError } = await supabase
        .from('seo_competitors')
        .insert(competitorsToInsert);

      if (competitorsError) {
        console.error('Error inserting competitors:', competitorsError);
        toast.error('Error al guardar competidores');
      }
    }

    // Return the complete report with its keywords and competitors
    return {
      ...report,
      keywordsData: reportData.keywordsData?.map((k, i) => ({ 
        id: `temp-${i}`, 
        reportId: report.id, 
        createdAt: new Date().toISOString(),
        ...k 
      })) || [],
      competitorsData: reportData.competitorsData?.map((c, i) => ({ 
        id: `temp-${i}`, 
        reportId: report.id, 
        createdAt: new Date().toISOString(),
        ...c 
      })) || []
    };
  } catch (error) {
    console.error('Error uploading SEO report:', error);
    throw error;
  }
};
