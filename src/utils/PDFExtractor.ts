
import * as pdfjsLib from 'pdfjs-dist';

// Set the PDF.js worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedPdfData {
  fullText: string;
  domain?: string;
  traffic?: number;
  keywords?: number;
  backlinks?: number;
}

export class PDFExtractor {
  /**
   * Extract text and basic data from a PDF file
   */
  static async extractData(file: File): Promise<ExtractedPdfData> {
    console.log('[PDFExtractor] Starting extraction from:', file.name);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      
      // Load the PDF
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      console.log(`[PDFExtractor] PDF loaded. Pages: ${pdf.numPages}`);
      
      // Extract text from all pages
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        console.log(`[PDFExtractor] Page ${i} extracted. Length: ${pageText.length} characters`);
      }
      
      console.log(`[PDFExtractor] Total text length: ${fullText.length} characters`);
      
      // Try to extract basic data
      const domain = this.extractDomain(fullText, file.name);
      const traffic = this.extractTraffic(fullText);
      const keywords = this.extractKeywords(fullText);
      const backlinks = this.extractBacklinks(fullText);
      
      return {
        fullText,
        domain,
        traffic,
        keywords,
        backlinks
      };
    } catch (error) {
      console.error('[PDFExtractor] Error extracting data:', error);
      return {
        fullText: '',
        domain: this.extractDomainFromFileName(file.name)
      };
    }
  }
  
  /**
   * Extract domain from text
   */
  private static extractDomain(text: string, fileName: string): string | undefined {
    console.log('[PDFExtractor] Attempting to extract domain from text');
    
    // Various patterns to match domain in PDF text
    const domainPatterns = [
      /Dominio:?\s*([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+)/i,
      /Informe(?:\s+SEO)?\s+(?:del)?\s+(?:Dominio|Domain):?\s*([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+)/i,
      /Domain:?\s*([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+)/i,
      /URL:?\s*(https?:\/\/)?([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+)/i,
      /Website:?\s*(https?:\/\/)?([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+)/i,
      /Web:?\s*(https?:\/\/)?([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+)/i
    ];
    
    for (const pattern of domainPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Some patterns capture the protocol in group 1 and domain in group 2
        const domain = match[2] ? match[2] : match[1];
        console.log(`[PDFExtractor] Domain found with pattern ${pattern}:`, domain);
        return domain.trim();
      }
    }
    
    console.log('[PDFExtractor] No domain found in text, trying filename');
    return this.extractDomainFromFileName(fileName);
  }
  
  /**
   * Extract domain from file name
   */
  private static extractDomainFromFileName(fileName: string): string {
    console.log('[PDFExtractor] Extracting domain from file name:', fileName);
    
    // Remove extension and common prefixes
    let name = fileName.replace(/\.pdf$/i, '').toLowerCase();
    name = name.replace(/^(informe_|informe-|reporte_|reporte-|report_|report-|semrush_|semrush-|seo_|seo-)/i, '');
    
    // Check if it's already a domain-like string
    if (/\.(com|net|org|es|io)$/.test(name)) {
      console.log('[PDFExtractor] Found domain in filename:', name);
      return name;
    }
    
    // Make it into a domain
    const domain = `${name}.com`;
    console.log('[PDFExtractor] Created domain from filename:', domain);
    return domain;
  }
  
  /**
   * Extract traffic from text
   */
  private static extractTraffic(text: string): number | undefined {
    const trafficPatterns = [
      /Tráfico(?:\s+Orgánico)?:?\s*([0-9,.]+)/i,
      /Organic\s+Traffic:?\s*([0-9,.]+)/i,
      /Traffic:?\s*([0-9,.]+)/i,
      /Visitas:?\s*([0-9,.]+)/i,
      /Visits:?\s*([0-9,.]+)/i
    ];
    
    for (const pattern of trafficPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const traffic = parseInt(match[1].replace(/[,.]/g, ''), 10);
        console.log(`[PDFExtractor] Traffic found with pattern ${pattern}:`, traffic);
        return traffic;
      }
    }
    
    return undefined;
  }
  
  /**
   * Extract keywords from text
   */
  private static extractKeywords(text: string): number | undefined {
    const keywordsPatterns = [
      /Palabras\s+Clave(?:\s+Orgánicas)?:?\s*([0-9,.]+)/i,
      /Organic\s+Keywords:?\s*([0-9,.]+)/i,
      /Keywords:?\s*([0-9,.]+)/i,
      /Ranking\s+Keywords:?\s*([0-9,.]+)/i,
      /Palabras\s+clave\s+SEO:?\s*([0-9,.]+)/i
    ];
    
    for (const pattern of keywordsPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const keywords = parseInt(match[1].replace(/[,.]/g, ''), 10);
        console.log(`[PDFExtractor] Keywords count found with pattern ${pattern}:`, keywords);
        return keywords;
      }
    }
    
    return undefined;
  }
  
  /**
   * Extract backlinks from text
   */
  private static extractBacklinks(text: string): number | undefined {
    const backlinksPatterns = [
      /Backlinks:?\s*([0-9,.]+)/i,
      /Enlaces(?:\s+Entrantes)?:?\s*([0-9,.]+)/i,
      /Referring\s+Domains:?\s*([0-9,.]+)/i,
      /External\s+Links:?\s*([0-9,.]+)/i,
      /Dominios\s+Referentes:?\s*([0-9,.]+)/i,
      /Total\s+de\s+backlinks:?\s*([0-9,.]+)/i
    ];
    
    for (const pattern of backlinksPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const backlinks = parseInt(match[1].replace(/[,.]/g, ''), 10);
        console.log(`[PDFExtractor] Backlinks found with pattern ${pattern}:`, backlinks);
        return backlinks;
      }
    }
    
    return undefined;
  }
}
