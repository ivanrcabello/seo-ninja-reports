
import * as pdfjsLib from 'pdfjs-dist';
import { SeoReport, SeoKeyword, SeoCompetitor } from '@/types/seo-reporting.types';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractedData {
  domain?: string;
  traffic?: number;
  keywords?: number;
  backlinks?: number;
  keywordsData?: SeoKeyword[];
  competitorsData?: SeoCompetitor[];
  organicTrafficData?: { date: string; value: number }[];
  rankingDistribution?: { range: string; count: number }[];
  keywordIntentions?: { intention: string; count: number; traffic: number; percentage: number }[];
  backlinkTypes?: { type: string; count: number }[];
  followNofollow?: { type: string; count: number; percentage: number }[];
}

export const parsePdf = async (file: File): Promise<ExtractedData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    
    const extractedData: ExtractedData = {};
    const totalPages = pdf.numPages;
    
    // Process all pages to extract data
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str);
      const pageText = textItems.join(' ');
      
      // Extract domain
      if (!extractedData.domain) {
        const domainMatch = pageText.match(/Informe de dominio:\s*([\w.-]+)/);
        if (domainMatch && domainMatch[1]) {
          extractedData.domain = domainMatch[1].trim();
        }
      }
      
      // Extract traffic, keywords, and backlinks
      if (!extractedData.traffic) {
        const trafficMatch = pageText.match(/Tráfico orgánico:\s*([\d.,]+)/);
        if (trafficMatch && trafficMatch[1]) {
          extractedData.traffic = parseInt(trafficMatch[1].replace(/[.,]/g, ''), 10);
        }
      }
      
      if (!extractedData.keywords) {
        const keywordsMatch = pageText.match(/Palabras clave orgánicas:\s*([\d.,]+)/);
        if (keywordsMatch && keywordsMatch[1]) {
          extractedData.keywords = parseInt(keywordsMatch[1].replace(/[.,]/g, ''), 10);
        }
      }
      
      if (!extractedData.backlinks) {
        const backlinksMatch = pageText.match(/Backlinks:\s*([\d.,]+)/);
        if (backlinksMatch && backlinksMatch[1]) {
          extractedData.backlinks = parseInt(backlinksMatch[1].replace(/[.,]/g, ''), 10);
        }
      }
      
      // Extract keywords data
      if (!extractedData.keywordsData) {
        // Use regex to find blocks of keyword data
        // Look for patterns like "keyword [position] [volume] [traffic %]"
        const keywordDataRegex = /(\w+(?:\s+\w+)*)\s+(\d+)\s+(\d[\d.,]*)\s+([\d.]+)%/g;
        const keywordsData: SeoKeyword[] = [];
        let keywordMatch;
        
        // Use regex to find keyword sections in the text
        let keywordSection = pageText.match(/Palabras clave orgánicas principales([\s\S]*?)(?:Competidores|$)/i);
        if (keywordSection && keywordSection[1]) {
          const keywordText = keywordSection[1];
          
          // Reset regex index
          keywordDataRegex.lastIndex = 0;
          
          // Extract individual keywords
          while ((keywordMatch = keywordDataRegex.exec(keywordText)) !== null && keywordsData.length < 20) {
            keywordsData.push({
              id: `temp-${keywordsData.length}`,
              reportId: '',
              keyword: keywordMatch[1].trim(),
              position: parseInt(keywordMatch[2], 10),
              volume: parseInt(keywordMatch[3].replace(/[.,]/g, ''), 10),
              trafficPercent: parseFloat(keywordMatch[4]),
              createdAt: new Date().toISOString()
            });
          }
        }
        
        // If no keywords found yet, try alternative format often found in SEMrush reports
        if (keywordsData.length < 5) {
          const alternativeKeywordRegex = /([\w\s-]+)\s+(\d+)\s+(\d[\d.,]*K?)\s+([\d.]+)%/g;
          let altKeywordMatch;
          
          while ((altKeywordMatch = alternativeKeywordRegex.exec(pageText)) !== null && keywordsData.length < 20) {
            let volume = altKeywordMatch[3];
            // Handle 'K' notation for thousands
            if (volume.includes('K')) {
              volume = (parseFloat(volume.replace('K', '')) * 1000).toString();
            }
            
            // Only add if it doesn't duplicate an existing keyword
            if (!keywordsData.some(k => k.keyword === altKeywordMatch[1].trim())) {
              keywordsData.push({
                id: `temp-${keywordsData.length}`,
                reportId: '',
                keyword: altKeywordMatch[1].trim(),
                position: parseInt(altKeywordMatch[2], 10),
                volume: parseInt(volume.replace(/[.,]/g, ''), 10),
                trafficPercent: parseFloat(altKeywordMatch[4]),
                createdAt: new Date().toISOString()
              });
            }
          }
        }
        
        // If we have at least 5 keywords, save them
        if (keywordsData.length >= 5) {
          extractedData.keywordsData = keywordsData;
        }
      }
      
      // Extract competitors data
      if (!extractedData.competitorsData) {
        const competitorDataRegex = /((?:https?:\/\/)?[\w.-]+\.[\w]{2,})[\s\n]+(\d+)[\s\n]+([\d.]+)/g;
        const competitorsData: SeoCompetitor[] = [];
        let competitorMatch;
        
        while ((competitorMatch = competitorDataRegex.exec(pageText)) !== null && competitorsData.length < 10) {
          competitorsData.push({
            id: `temp-${competitorsData.length}`,
            reportId: '',
            domain: competitorMatch[1].trim(),
            keywordsOverlap: parseInt(competitorMatch[2], 10),
            competitionLevel: parseFloat(competitorMatch[3]),
            createdAt: new Date().toISOString()
          });
        }
        
        if (competitorsData.length > 0) {
          extractedData.competitorsData = competitorsData;
        }
      }
      
      // Process other data extraction as needed...
    }
    
    return extractedData;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
};
