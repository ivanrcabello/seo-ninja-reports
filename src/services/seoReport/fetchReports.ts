
import { supabase } from '@/integrations/supabase/client';
import { SeoReport } from '@/types/seo-reporting.types';

/**
 * Fetches SEO reports for a specific client from the database
 */
export const fetchClientSeoReports = async (clientId: string): Promise<SeoReport[]> => {
  try {
    console.log('Fetching SEO reports for client:', clientId);
    
    // Fetch reports
    const { data: reports, error } = await supabase
      .from('seo_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!reports || reports.length === 0) {
      console.log('No SEO reports found for client:', clientId);
      return [];
    }
    
    console.log(`Found ${reports.length} SEO reports`);
    
    // Fetch keywords and competitors for each report
    const reportsWithData = await Promise.all(reports.map(async (report) => {
      // Fetch keywords
      const { data: keywords, error: keywordsError } = await supabase
        .from('seo_keywords')
        .select('*')
        .eq('report_id', report.id);
        
      if (keywordsError) {
        console.error('Error fetching keywords:', keywordsError);
      }
      
      // Fetch competitors
      const { data: competitors, error: competitorsError } = await supabase
        .from('seo_competitors')
        .select('*')
        .eq('report_id', report.id);
        
      if (competitorsError) {
        console.error('Error fetching competitors:', competitorsError);
      }
      
      // Generate sample data for the advanced visualizations
      // In a real-world scenario, this data would be stored in the database
      const organicTrafficData = generateSampleTrafficData();
      const rankingDistribution = generateSampleRankingDistribution();
      const keywordIntentions = generateSampleKeywordIntentions();
      const backlinkTypes = generateSampleBacklinkTypes();
      const followNofollow = generateSampleFollowNofollow();
      
      // Map to SeoReport type
      return {
        id: report.id,
        clientId: report.client_id,
        domain: report.domain,
        traffic: report.traffic,
        keywords: report.keywords,
        backlinks: report.backlinks,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
        keywordsData: keywords?.map(k => ({
          id: k.id,
          reportId: k.report_id,
          keyword: k.keyword,
          position: k.position,
          volume: k.volume,
          trafficPercent: k.traffic_percent,
          createdAt: k.created_at
        })) || [],
        competitorsData: competitors?.map(c => ({
          id: c.id,
          reportId: c.report_id,
          domain: c.domain,
          keywordsOverlap: c.keywords_overlap,
          competitionLevel: c.competition_level,
          createdAt: c.created_at
        })) || [],
        organicTrafficData,
        rankingDistribution,
        keywordIntentions,
        backlinkTypes,
        followNofollow
      };
    }));
    
    return reportsWithData;
  } catch (error) {
    console.error('Error fetching SEO reports:', error);
    throw error;
  }
};

/**
 * Generate sample traffic data for demonstration purposes
 */
function generateSampleTrafficData(): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Generate last 24 months of traffic data with an increasing trend
  for (let i = 0; i < 24; i++) {
    const monthOffset = i - 23; // Start 24 months ago
    const date = new Date(currentYear, currentMonth + monthOffset, 1);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Create an increasing trend with some variation
    let value = 0;
    if (i < 12) {
      value = Math.floor(50 + i * 20 + Math.random() * 30);
    } else if (i < 20) {
      value = Math.floor(300 + (i - 12) * 40 + Math.random() * 50);
    } else {
      value = Math.floor(620 + (i - 20) * 60 + Math.random() * 70);
    }
    
    data.push({ date: yearMonth, value });
  }
  
  return data;
}

/**
 * Generate sample ranking distribution for demonstration
 */
function generateSampleRankingDistribution(): { range: string; count: number }[] {
  return [
    { range: "1-3", count: 17 },
    { range: "4-10", count: 34 },
    { range: "11-20", count: 95 },
    { range: "21-30", count: 97 },
    { range: "31-40", count: 76 },
    { range: "41-50", count: 60 },
    { range: "51-100", count: 178 },
    { range: "SERP Features", count: 19 }
  ];
}

/**
 * Generate sample keyword intentions data
 */
function generateSampleKeywordIntentions(): { intention: string; count: number; traffic: number; percentage: number }[] {
  return [
    { intention: "Informativo", count: 511, traffic: 294, percentage: 84.2 },
    { intention: "De navegación", count: 38, traffic: 3, percentage: 6.3 },
    { intention: "Comercial", count: 11, traffic: 7, percentage: 1.8 },
    { intention: "Transaccional", count: 47, traffic: 2, percentage: 7.7 }
  ];
}

/**
 * Generate sample backlink types data
 */
function generateSampleBacklinkTypes(): { type: string; count: number }[] {
  return [
    { type: "Enlaces de texto", count: 41 },
    { type: "Enlaces a imágenes", count: 28 },
    { type: "Enlaces de marco", count: 0 },
    { type: "Enlaces de forma", count: 0 }
  ];
}

/**
 * Generate sample follow/nofollow data
 */
function generateSampleFollowNofollow(): { type: string; count: number; percentage: number }[] {
  return [
    { type: "Follow", count: 33, percentage: 47.83 },
    { type: "Nofollow", count: 36, percentage: 52.17 }
  ];
}
