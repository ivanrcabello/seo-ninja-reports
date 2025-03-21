
import { supabase } from '@/integrations/supabase/client';
import { SeoReport, SeoKeyword, SeoCompetitor } from '@/types/seo-reporting.types';
import { toast } from 'sonner';

/**
 * Uploads a new SEO report to the database
 */
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
    console.log('Uploading SEO report for client:', clientId, 'with data:', reportData);
    
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

    console.log('Created SEO report:', report);

    if (reportData.keywordsData && reportData.keywordsData.length > 0) {
      const keywordsToInsert = reportData.keywordsData.map(keyword => ({
        report_id: report.id,
        keyword: keyword.keyword,
        position: keyword.position,
        volume: keyword.volume,
        traffic_percent: keyword.trafficPercent
      }));

      console.log('Inserting keywords:', keywordsToInsert);

      const { error: keywordsError } = await supabase
        .from('seo_keywords')
        .insert(keywordsToInsert);

      if (keywordsError) {
        console.error('Error inserting keywords:', keywordsError);
        toast.error('Error al guardar palabras clave');
      }
    }

    if (reportData.competitorsData && reportData.competitorsData.length > 0) {
      const competitorsToInsert = reportData.competitorsData.map(competitor => ({
        report_id: report.id,
        domain: competitor.domain,
        keywords_overlap: competitor.keywordsOverlap,
        competition_level: competitor.competitionLevel
      }));

      console.log('Inserting competitors:', competitorsToInsert);

      const { error: competitorsError } = await supabase
        .from('seo_competitors')
        .insert(competitorsToInsert);

      if (competitorsError) {
        console.error('Error inserting competitors:', competitorsError);
        toast.error('Error al guardar competidores');
      }
    }

    return {
      id: report.id,
      clientId: report.client_id,
      domain: report.domain,
      traffic: report.traffic,
      keywords: report.keywords,
      backlinks: report.backlinks,
      createdAt: report.created_at,
      updatedAt: report.updated_at,
      keywordsData: reportData.keywordsData?.map((k, i) => ({ 
        id: `temp-${i}`, 
        reportId: report.id, 
        createdAt: new Date().toISOString(),
        keyword: k.keyword,
        position: k.position,
        volume: k.volume,
        trafficPercent: k.trafficPercent
      })) || [],
      competitorsData: reportData.competitorsData?.map((c, i) => ({ 
        id: `temp-${i}`, 
        reportId: report.id, 
        createdAt: new Date().toISOString(),
        domain: c.domain,
        keywordsOverlap: c.keywordsOverlap,
        competitionLevel: c.competitionLevel
      })) || []
    };
  } catch (error) {
    console.error('Error uploading SEO report:', error);
    throw error;
  }
};

/**
 * Creates a new SEO report using the parsed data from a PDF
 */
export const createSeoReport = async (clientId: string, data: any) => {
  if (!data) {
    console.error('No data provided to createSeoReport');
    return null;
  }
  
  try {
    console.log('Creating SEO report with data:', data);
    console.log('Client ID:', clientId);
    
    const result = await uploadSeoReport(clientId, data);
    console.log('SEO report created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating SEO report:', error);
    toast.error('Error al crear el informe SEO');
    return null;
  }
};
