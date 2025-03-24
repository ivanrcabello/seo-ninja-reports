
// Process HTML content and extract SEO data
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';
import { SupabaseInstance, PageCrawlResult } from '../types.ts';
import { SEO_ISSUES } from '../constants.ts';
import { isInternalUrl, queueLinksForCrawling, registerCrawlerError } from '../utils.ts';

export async function processHtml(supabase: SupabaseInstance, url: string, crawlId: string, html: string): Promise<PageCrawlResult | null> {
  try {
    const $ = cheerio.load(html);
    console.log('HTML parseado con cheerio');
    
    // Extract basic page details
    console.log('Extrayendo metadatos...');
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text().trim();
    
    console.log(`Título: "${title}"`);
    console.log(`Meta descripción: "${metaDescription}"`);
    console.log(`H1: "${h1}"`);
    
    // Count elements
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    const wordCount = html.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .length;
    
    console.log(`Conteo de elementos - H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count}, Palabras: ${wordCount}`);
    
    // Link analysis
    console.log('Analizando enlaces...');
    const links = $('a[href]');
    let internalLinksCount = 0;
    let externalLinksCount = 0;
    const internalLinks: string[] = [];
    
    console.log(`Total de enlaces encontrados: ${links.length}`);
    
    links.each((_, link) => {
      const href = $(link).attr('href') || '';
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        try {
          // Normalize and resolve relative URLs
          const fullUrl = new URL(href, url).href;
          
          if (isInternalUrl(url, href)) {
            internalLinksCount++;
            internalLinks.push(fullUrl);
          } else {
            externalLinksCount++;
          }
        } catch (e) {
          console.error(`Error procesando enlace ${href}:`, e);
        }
      }
    });
    
    console.log(`Enlaces internos: ${internalLinksCount}, Enlaces externos: ${externalLinksCount}`);
    
    // Image analysis
    const imageAnalysisResult = analyzeImages($);
    console.log(`Total imágenes: ${imageAnalysisResult.imageCount}, Imágenes sin alt: ${imageAnalysisResult.imagesWithoutAlt}`);
    
    // Analyze technical aspects
    const technicalData = analyzeTechnicalAspects($, url);
    console.log('Datos técnicos analizados:', technicalData);
    
    // Indexability check
    console.log('Verificando indexabilidad...');
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    const isIndexable = !robotsMeta.includes('noindex');
    
    console.log(`Robots meta: "${robotsMeta}", Indexable: ${isIndexable}`);
    
    // Check canonical
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    console.log(`URL canónica: "${canonical}"`);
    
    // Page analysis result
    const pageEntry = {
      id: crypto.randomUUID(),
      crawl_id: crawlId,
      url: url,
      status_code: 200, // Assuming success if we got this far
      title: title,
      meta_description: metaDescription,
      h1: h1,
      word_count: wordCount,
      h1_count: h1Count,
      h2_count: h2Count,
      h3_count: h3Count,
      internal_links_count: internalLinksCount,
      external_links_count: externalLinksCount,
      is_indexable: isIndexable,
      canonical_url: canonical,
      image_count: imageAnalysisResult.imageCount,
      images_without_alt: imageAnalysisResult.imagesWithoutAlt,
      meta_robots: robotsMeta,
      technical_data: JSON.stringify(technicalData) // Store technical data
    };
    
    // Store page in database and check for SEO issues
    return await savePageAndAnalyzeIssues(supabase, pageEntry, internalLinks, crawlId, url, technicalData);
  } catch (error) {
    console.error(`Error procesando HTML de ${url}:`, error);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : "Error desconocido");
    return null;
  }
}

// Helper function to analyze images
function analyzeImages($: cheerio.CheerioAPI) {
  console.log('Analizando imágenes...');
  const images = $('img');
  const imageCount = images.length;
  let imagesWithoutAlt = 0;
  
  images.each((_, img) => {
    const alt = $(img).attr('alt');
    if (!alt || alt.trim() === '') {
      imagesWithoutAlt++;
    }
  });
  
  return { imageCount, imagesWithoutAlt };
}

// Helper function to analyze technical aspects of the page
function analyzeTechnicalAspects($: cheerio.CheerioAPI, url: string) {
  const technicalData: Record<string, any> = {
    pageSize: 0,
    httpStatus: 200,
    loadTime: 0,
    scripts: 0,
    styles: 0,
    iframes: 0,
    securityHeaders: {},
    schemaMarkup: false,
    hreflangTags: 0,
    viewportMeta: false,
    mobileFriendly: false,
    amp: false,
    favicon: false
  };
  
  // Count scripts, styles, and iframes
  technicalData.scripts = $('script').length;
  technicalData.styles = $('link[rel="stylesheet"]').length + $('style').length;
  technicalData.iframes = $('iframe').length;
  
  // Check for schema markup
  const hasSchema = $('script[type="application/ld+json"]').length > 0;
  technicalData.schemaMarkup = hasSchema;
  
  // Check for hreflang tags
  technicalData.hreflangTags = $('link[rel="alternate"][hreflang]').length;
  
  // Check for viewport meta
  const viewportMeta = $('meta[name="viewport"]').attr('content');
  technicalData.viewportMeta = !!viewportMeta;
  
  // Check for mobile-friendly indicators
  if (viewportMeta && viewportMeta.includes('width=device-width')) {
    technicalData.mobileFriendly = true;
  }
  
  // Check for AMP
  technicalData.amp = $('link[rel="amphtml"]').length > 0;
  
  // Check for favicon
  technicalData.favicon = $('link[rel="icon"], link[rel="shortcut icon"]').length > 0;
  
  // Page size estimation (rough approximation since we don't have the actual network request)
  const htmlSize = $.html().length;
  technicalData.pageSize = Math.round(htmlSize / 1024); // size in KB
  
  return technicalData;
}

// Helper function to save page and analyze issues
async function savePageAndAnalyzeIssues(
  supabase: SupabaseInstance, 
  pageEntry: any, 
  internalLinks: string[], 
  crawlId: string, 
  url: string,
  technicalData: Record<string, any>
): Promise<PageCrawlResult | null> {
  // Store page in database
  console.log('Guardando datos de página en la base de datos...');
  const { error: pageError } = await supabase
    .from('seo_crawl_pages')
    .insert(pageEntry);
    
  if (pageError) {
    console.error(`Error guardando página ${url}:`, pageError);
    throw new Error(`Error guardando página: ${pageError.message}`);
  }
  
  console.log(`Página guardada exitosamente con ID: ${pageEntry.id}`);
  
  // Basic SEO issues check
  console.log('Analizando problemas SEO...');
  const issues = [];
  
  if (!pageEntry.title) {
    issues.push({
      id: crypto.randomUUID(),
      page_id: pageEntry.id,
      issue_type: SEO_ISSUES.MISSING_TITLE.type,
      severity: SEO_ISSUES.MISSING_TITLE.severity,
      description: SEO_ISSUES.MISSING_TITLE.description,
      recommended_fix: SEO_ISSUES.MISSING_TITLE.fix
    });
  }
  
  if (!pageEntry.meta_description) {
    issues.push({
      id: crypto.randomUUID(),
      page_id: pageEntry.id,
      issue_type: SEO_ISSUES.MISSING_META_DESCRIPTION.type,
      severity: SEO_ISSUES.MISSING_META_DESCRIPTION.severity,
      description: SEO_ISSUES.MISSING_META_DESCRIPTION.description,
      recommended_fix: SEO_ISSUES.MISSING_META_DESCRIPTION.fix
    });
  }
  
  if (!pageEntry.h1) {
    issues.push({
      id: crypto.randomUUID(),
      page_id: pageEntry.id,
      issue_type: SEO_ISSUES.MISSING_H1.type,
      severity: SEO_ISSUES.MISSING_H1.severity,
      description: SEO_ISSUES.MISSING_H1.description,
      recommended_fix: SEO_ISSUES.MISSING_H1.fix
    });
  }
  
  // Check for technical issues
  if (technicalData) {
    // Schema markup check
    if (!technicalData.schemaMarkup) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: 'missing_schema',
        severity: 'medium',
        description: 'La página no tiene marcado de esquema (Schema.org)',
        recommended_fix: 'Implementar marcado de esquema para mejorar la visibilidad en los resultados de búsqueda'
      });
    }
    
    // Mobile-friendly check
    if (!technicalData.mobileFriendly) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: 'not_mobile_friendly',
        severity: 'high',
        description: 'La página no parece estar optimizada para dispositivos móviles',
        recommended_fix: 'Asegúrate de que tu sitio utilice un diseño responsive con meta viewport adecuado'
      });
    }
    
    // Page size warning
    if (technicalData.pageSize > 1000) { // More than 1MB
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: 'large_page_size',
        severity: 'medium',
        description: `La página es demasiado grande (${technicalData.pageSize}KB)`,
        recommended_fix: 'Optimiza imágenes y recursos para reducir el tamaño de la página y mejorar la velocidad de carga'
      });
    }
    
    // Too many scripts
    if (technicalData.scripts > 30) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: 'excessive_scripts',
        severity: 'medium',
        description: `La página utiliza demasiados scripts (${technicalData.scripts})`,
        recommended_fix: 'Reduce y combina los scripts para mejorar el rendimiento de la página'
      });
    }
  }
  
  console.log(`Problemas SEO encontrados: ${issues.length}`);
  
  // Save issues if any
  if (issues.length > 0) {
    console.log('Guardando problemas SEO...');
    const { error: issuesError } = await supabase
      .from('seo_crawl_issues')
      .insert(issues);
      
    if (issuesError) {
      console.error(`Error guardando problemas para página ${url}:`, issuesError);
    } else {
      console.log('Problemas SEO guardados correctamente');
    }
  }
  
  // Queue internal links for future crawling
  await queueLinksForCrawling(supabase, pageEntry.id, internalLinks, crawlId, url);
  
  return {
    pageId: pageEntry.id,
    url,
    issues: issues.length
  };
}
