import { supabase } from '@/integrations/supabase/client';
import { SeoReport, SeoKeyword, SeoCompetitor } from '@/types/seo-reporting.types';
import { parsePdf } from '@/utils/pdfParser';
import { toast } from 'sonner';

// Re-export parsePdf to make it available to components
export { parsePdf };

interface UploadReportData {
  domain: string;
  traffic?: number;
  keywords?: number;
  backlinks?: number;
  keywordsData?: Omit<SeoKeyword, 'id' | 'reportId' | 'createdAt'>[];
  competitorsData?: Omit<SeoCompetitor, 'id' | 'reportId' | 'createdAt'>[];
  organicTrafficData?: { date: string; value: number }[];
  rankingDistribution?: { range: string; count: number }[];
  keywordIntentions?: { intention: string; count: number; traffic: number; percentage: number }[];
  backlinkTypes?: { type: string; count: number }[];
  followNofollow?: { type: string; count: number; percentage: number }[];
}

export async function uploadSeoReport(clientId: string, data: UploadReportData): Promise<SeoReport> {
  console.log('Uploading SEO report for client:', clientId, 'with data:', data);
  
  try {
    // First, create the main SEO report
    const { data: createdReport, error: reportError } = await supabase
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
      throw reportError;
    }
    
    console.log('Created SEO report:', createdReport);
    
    // Then, insert keywords
    if (data.keywordsData && data.keywordsData.length > 0) {
      const keywordsToInsert = data.keywordsData.map(kw => ({
        report_id: createdReport.id,
        keyword: kw.keyword,
        position: kw.position,
        volume: kw.volume,
        traffic_percent: kw.trafficPercent
      }));
      
      console.log('Inserting keywords:', keywordsToInsert);
      
      const { error: keywordsError } = await supabase
        .from('seo_keywords')
        .insert(keywordsToInsert);
        
      if (keywordsError) {
        console.error('Error inserting keywords:', keywordsError);
      }
    }
    
    // Insert competitors
    if (data.competitorsData && data.competitorsData.length > 0) {
      const competitorsToInsert = data.competitorsData.map(comp => ({
        report_id: createdReport.id,
        domain: comp.domain,
        keywords_overlap: comp.keywordsOverlap,
        competition_level: comp.competitionLevel
      }));
      
      console.log('Inserting competitors:', competitorsToInsert);
      
      const { error: competitorsError } = await supabase
        .from('seo_competitors')
        .insert(competitorsToInsert);
        
      if (competitorsError) {
        console.error('Error inserting competitors:', competitorsError);
      }
    }
    
    // Format the result in the expected format for the front-end
    const result: SeoReport = {
      id: createdReport.id,
      clientId: createdReport.client_id,
      domain: createdReport.domain,
      traffic: createdReport.traffic,
      keywords: createdReport.keywords,
      backlinks: createdReport.backlinks,
      createdAt: createdReport.created_at,
      updatedAt: createdReport.updated_at,
      keywordsData: data.keywordsData?.map((kw, index) => ({
        id: `temp-${index}`,
        reportId: createdReport.id,
        createdAt: new Date().toISOString(),
        ...kw
      })),
      competitorsData: data.competitorsData?.map((comp, index) => ({
        id: `temp-${index}`,
        reportId: createdReport.id,
        createdAt: new Date().toISOString(),
        ...comp
      })),
      organicTrafficData: data.organicTrafficData,
      rankingDistribution: data.rankingDistribution,
      keywordIntentions: data.keywordIntentions,
      backlinkTypes: data.backlinkTypes,
      followNofollow: data.followNofollow
    };
    
    return result;
  } catch (error) {
    console.error('Error in uploadSeoReport:', error);
    toast.error('Error al subir el informe SEO');
    throw error;
  }
}

export { 
  fetchClientSeoReports, 
  uploadSeoReport, 
  createSeoReport, 
  parsePdf,
  deleteSeoReport 
} from './seoReport';
