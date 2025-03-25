
// HTML processing module for SEO crawler
import { SupabaseInstance, PageCrawlResult } from '../types.ts';
import { SEO_ISSUES } from '../constants.ts';

// Process HTML content to extract SEO information and identify issues
export async function processHtml(
  supabase: SupabaseInstance,
  url: string,
  crawlId: string,
  html: string
): Promise<PageCrawlResult | null> {
  try {
    console.log(`Procesando HTML para URL: ${url}`);
    
    if (!html || html.trim().length === 0) {
      console.error('HTML vacío para procesar');
      return null;
    }
    
    // Parse the HTML document
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract basic SEO elements
    const title = doc.querySelector('title')?.textContent || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h1 = doc.querySelector('h1')?.textContent || '';
    const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    
    // Count elements
    const h2Count = doc.querySelectorAll('h2').length;
    const h3Count = doc.querySelectorAll('h3').length;
    const images = doc.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt')).length;
    
    // Check schema markup
    const hasSchemaMarkup = html.includes('application/ld+json') || html.includes('itemtype="http://schema.org');
    
    // Extract all links
    const links = Array.from(doc.querySelectorAll('a[href]')).map(a => a.getAttribute('href')).filter(href => href && !href.startsWith('javascript:'));
    
    // Calculate content metrics
    const bodyText = doc.body?.textContent || '';
    const wordCount = bodyText.trim().split(/\s+/).length;
    const contentLength = html.length;
    const textRatio = bodyText.length / contentLength;
    
    // Identify SEO issues
    const issues = [];
    
    // Check for missing title
    if (!title) {
      issues.push({
        page_id: '', // Will be filled after page insertion
        issue_type: SEO_ISSUES.MISSING_TITLE.type,
        description: SEO_ISSUES.MISSING_TITLE.description,
        severity: SEO_ISSUES.MISSING_TITLE.severity,
        recommended_fix: SEO_ISSUES.MISSING_TITLE.fix
      });
    }
    
    // Check for missing meta description
    if (!metaDescription) {
      issues.push({
        page_id: '', // Will be filled after page insertion
        issue_type: SEO_ISSUES.MISSING_META_DESCRIPTION.type,
        description: SEO_ISSUES.MISSING_META_DESCRIPTION.description,
        severity: SEO_ISSUES.MISSING_META_DESCRIPTION.severity,
        recommended_fix: SEO_ISSUES.MISSING_META_DESCRIPTION.fix
      });
    }
    
    // Check for missing H1
    if (!h1) {
      issues.push({
        page_id: '', // Will be filled after page insertion
        issue_type: SEO_ISSUES.MISSING_H1.type,
        description: SEO_ISSUES.MISSING_H1.description,
        severity: SEO_ISSUES.MISSING_H1.severity,
        recommended_fix: SEO_ISSUES.MISSING_H1.fix
      });
    }
    
    // Check for short content
    if (wordCount < 300) {
      issues.push({
        page_id: '', // Will be filled after page insertion
        issue_type: SEO_ISSUES.SHORT_CONTENT.type,
        description: SEO_ISSUES.SHORT_CONTENT.description,
        severity: SEO_ISSUES.SHORT_CONTENT.severity,
        recommended_fix: SEO_ISSUES.SHORT_CONTENT.fix
      });
    }
    
    // Check for images without alt text
    if (imagesWithoutAlt > 0) {
      issues.push({
        page_id: '', // Will be filled after page insertion
        issue_type: SEO_ISSUES.IMAGES_WITHOUT_ALT.type,
        description: `${imagesWithoutAlt} ${SEO_ISSUES.IMAGES_WITHOUT_ALT.description}`,
        severity: SEO_ISSUES.IMAGES_WITHOUT_ALT.severity,
        recommended_fix: SEO_ISSUES.IMAGES_WITHOUT_ALT.fix
      });
    }
    
    // Check for missing canonical
    if (!canonicalUrl) {
      issues.push({
        page_id: '', // Will be filled after page insertion
        issue_type: SEO_ISSUES.MISSING_CANONICAL.type,
        description: SEO_ISSUES.MISSING_CANONICAL.description,
        severity: SEO_ISSUES.MISSING_CANONICAL.severity,
        recommended_fix: SEO_ISSUES.MISSING_CANONICAL.fix
      });
    }
    
    // Insert the page into the database
    console.log('Insertando página en la base de datos');
    const { data: pageData, error: pageError } = await supabase
      .from('seo_crawler_pages')
      .insert({
        crawl_id: crawlId,
        url: url,
        title: title,
        meta_description: metaDescription,
        h1: h1,
        canonical_url: canonicalUrl,
        status_code: 200, // We assume 200 since we got HTML content
        is_indexable: !html.includes('noindex'),
        level: 0,
        internal_links_count: links.length,
        external_links_count: 0, // We'd need to process each link to determine this accurately
        word_count: wordCount,
        content_length: contentLength,
        text_ratio: textRatio,
        load_time_ms: 0, // We don't have this information from Bright Data
        image_count: images.length,
        h2_count: h2Count,
        h3_count: h3Count,
        has_schema_markup: hasSchemaMarkup,
        issues_count: issues.length,
        meta_robots: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '',
        robots_directives: '',
        mobile_friendly: true, // We'd need additional testing for this
        page_size_kb: contentLength / 1024,
        images_without_alt: imagesWithoutAlt
      })
      .select()
      .single();
    
    if (pageError) {
      console.error('Error insertando página:', pageError);
      throw pageError;
    }
    
    if (!pageData) {
      console.error('No se devolvieron datos al insertar la página');
      throw new Error('No se devolvieron datos al insertar la página');
    }
    
    console.log('Página insertada con ID:', pageData.id);
    
    // Now update the issues with the page_id and insert them
    if (issues.length > 0) {
      console.log(`Insertando ${issues.length} problemas`);
      
      const issuesWithPageId = issues.map(issue => ({
        ...issue,
        page_id: pageData.id
      }));
      
      const { error: issuesError } = await supabase
        .from('seo_crawler_issues')
        .insert(issuesWithPageId);
      
      if (issuesError) {
        console.error('Error insertando problemas:', issuesError);
      } else {
        console.log('Problemas insertados correctamente');
      }
    }
    
    // Return the page crawl result
    return {
      pageId: pageData.id,
      url: url,
      statusCode: 200,
      issues: issues.length
    };
  } catch (error) {
    console.error('Error procesando HTML:', error);
    return null;
  }
}
