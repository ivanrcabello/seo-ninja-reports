
import { supabase } from '@/integrations/supabase/client';
import { SeoReport, SeoKeyword, SeoCompetitor } from '@/types/seo-reporting.types';
import { toast } from 'sonner';

/**
 * Fetches all SEO reports for a client
 */
export const fetchClientSeoReports = async (clientId: string): Promise<SeoReport[]> => {
  try {
    const { data: reportsData, error: reportsError } = await supabase
      .from('seo_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (reportsError) {
      console.error('Error fetching SEO reports:', reportsError);
      throw reportsError;
    }

    // Map the data to our interface
    const reports: SeoReport[] = reportsData.map(report => ({
      id: report.id,
      clientId: report.client_id,
      domain: report.domain,
      traffic: report.traffic,
      keywords: report.keywords,
      backlinks: report.backlinks,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      keywordsData: [],
      competitorsData: []
    }));

    // If we have reports, fetch the related keywords and competitors
    if (reports.length > 0) {
      for (const report of reports) {
        // Fetch keywords
        const { data: keywordsData, error: keywordsError } = await supabase
          .from('seo_keywords')
          .select('*')
          .eq('report_id', report.id);

        if (!keywordsError && keywordsData) {
          report.keywordsData = keywordsData.map(keyword => ({
            id: keyword.id,
            reportId: keyword.report_id,
            keyword: keyword.keyword,
            position: keyword.position,
            volume: keyword.volume,
            trafficPercent: keyword.traffic_percent,
            createdAt: keyword.created_at
          }));
        }

        // Fetch competitors
        const { data: competitorsData, error: competitorsError } = await supabase
          .from('seo_competitors')
          .select('*')
          .eq('report_id', report.id);

        if (!competitorsError && competitorsData) {
          report.competitorsData = competitorsData.map(competitor => ({
            id: competitor.id,
            reportId: competitor.report_id,
            domain: competitor.domain,
            keywordsOverlap: competitor.keywords_overlap,
            competitionLevel: competitor.competition_level,
            createdAt: competitor.created_at
          }));
        }
      }
    }

    return reports;
  } catch (error) {
    console.error('Error in fetchClientSeoReports:', error);
    return [];
  }
};

/**
 * Creates a new SEO report
 */
export const createSeoReport = async (
  clientId: string, 
  data: {
    domain: string;
    traffic?: number;
    keywords?: number;
    backlinks?: number;
    keywordsData?: Omit<SeoKeyword, 'id' | 'reportId' | 'createdAt'>[];
    competitorsData?: Omit<SeoCompetitor, 'id' | 'reportId' | 'createdAt'>[];
  }
): Promise<SeoReport | null> => {
  try {
    // Insert the report
    const { data: reportData, error: reportError } = await supabase
      .from('seo_reports')
      .insert({
        client_id: clientId,
        domain: data.domain,
        traffic: data.traffic || 0,
        keywords: data.keywords || 0,
        backlinks: data.backlinks || 0
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating SEO report:', reportError);
      toast.error('Error creating SEO report', {
        description: reportError.message
      });
      throw reportError;
    }

    const reportId = reportData.id;

    // Insert keywords if provided
    if (data.keywordsData && data.keywordsData.length > 0) {
      const keywordsToInsert = data.keywordsData.map(keyword => ({
        report_id: reportId,
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
      }
    }

    // Insert competitors if provided
    if (data.competitorsData && data.competitorsData.length > 0) {
      const competitorsToInsert = data.competitorsData.map(competitor => ({
        report_id: reportId,
        domain: competitor.domain,
        keywords_overlap: competitor.keywordsOverlap,
        competition_level: competitor.competitionLevel
      }));

      const { error: competitorsError } = await supabase
        .from('seo_competitors')
        .insert(competitorsToInsert);

      if (competitorsError) {
        console.error('Error inserting competitors:', competitorsError);
      }
    }

    // Return the created report
    return {
      id: reportData.id,
      clientId: reportData.client_id,
      domain: reportData.domain,
      traffic: reportData.traffic,
      keywords: reportData.keywords,
      backlinks: reportData.backlinks,
      createdAt: reportData.created_at,
      updatedAt: reportData.updated_at,
      keywordsData: data.keywordsData?.map(kw => ({
        ...kw,
        id: '',
        reportId,
        createdAt: new Date().toISOString()
      })) || [],
      competitorsData: data.competitorsData?.map(comp => ({
        ...comp,
        id: '',
        reportId,
        createdAt: new Date().toISOString()
      })) || []
    };
  } catch (error) {
    console.error('Error in createSeoReport:', error);
    return null;
  }
};

/**
 * Parses a Semrush PDF report
 * (This is a mock implementation - would need to be implemented with actual PDF parsing logic)
 */
export const parseSemrushPdf = async (file: File): Promise<{
  domain: string;
  traffic?: number;
  keywords?: number;
  backlinks?: number;
  keywordsData?: Omit<SeoKeyword, 'id' | 'reportId' | 'createdAt'>[];
  competitorsData?: Omit<SeoCompetitor, 'id' | 'reportId' | 'createdAt'>[];
} | null> => {
  // In a real implementation, you would send this file to an edge function for parsing
  // For now, we'll return mock data to demonstrate the UI
  try {
    // Mock parsing result
    toast.success("PDF procesado con éxito", {
      description: "Datos extraídos del informe de Semrush"
    });

    // Extract domain from file name (just a demo)
    const domain = file.name.includes('.') 
      ? file.name.split('.')[0] 
      : 'example.com';

    return {
      domain,
      traffic: Math.floor(Math.random() * 1000) + 100,
      keywords: Math.floor(Math.random() * 500) + 50,
      backlinks: Math.floor(Math.random() * 200) + 20,
      keywordsData: [
        { keyword: 'seo agency', position: 2, volume: 1200, trafficPercent: 15.2 },
        { keyword: 'web development', position: 5, volume: 880, trafficPercent: 9.7 },
        { keyword: 'digital marketing services', position: 8, volume: 650, trafficPercent: 7.5 },
        { keyword: 'seo services', position: 3, volume: 720, trafficPercent: 8.1 },
        { keyword: 'best seo company', position: 6, volume: 480, trafficPercent: 5.8 }
      ],
      competitorsData: [
        { domain: 'competitor1.com', keywordsOverlap: 87, competitionLevel: 0.76 },
        { domain: 'competitor2.com', keywordsOverlap: 63, competitionLevel: 0.68 },
        { domain: 'competitor3.com', keywordsOverlap: 52, competitionLevel: 0.59 }
      ]
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    toast.error("Error al procesar el PDF", {
      description: "No se pudieron extraer los datos del informe"
    });
    return null;
  }
};
