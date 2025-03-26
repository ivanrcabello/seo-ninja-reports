
// HTML processing module for SEO Crawler
import { SupabaseInstance, PageCrawlResult, SeoIssue } from '../types.ts';
import { SEO_ISSUES } from '../constants.ts';
import { registerCrawlerError, isInternalUrl, normalizeUrl } from '../utils.ts';

// Extract links from HTML content
function extractLinks(html: string, baseUrl: string): string[] {
  try {
    const links: string[] = [];
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[1].trim();
      
      // Skip empty, javascript:, mailto:, tel: and anchor links
      if (!href || 
          href.startsWith('javascript:') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') || 
          href.startsWith('#')) {
        continue;
      }
      
      // Normalize URL if it's relative
      if (href.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        href = urlObj.origin + href;
      } else if (!href.startsWith('http')) {
        const urlObj = new URL(baseUrl);
        // Handle relative URLs without leading slash
        if (urlObj.pathname.endsWith('/')) {
          href = urlObj.origin + urlObj.pathname + href;
        } else {
          const pathParts = urlObj.pathname.split('/');
          pathParts.pop(); // Remove the last part
          href = urlObj.origin + pathParts.join('/') + '/' + href;
        }
      }
      
      links.push(href);
    }
    
    console.log(`Extracted ${links.length} links from HTML`);
    return links;
  } catch (error) {
    console.error('Error extracting links:', error);
    return [];
  }
}

// Function to process HTML content from a crawled page
export async function processHtml(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string, 
  html: string
): Promise<PageCrawlResult | null> {
  try {
    console.log(`Processing HTML for URL: ${url}, HTML length: ${html.length} characters`);
    
    // First check if the table has the correct schema
    try {
      // Get column information to ensure we're only using existing columns
      const { data: columns, error: columnsError } = await supabase
        .from('seo_crawler_pages')
        .select('*')
        .limit(1);
        
      if (columnsError) {
        console.error(`Error checking table schema: ${columnsError.message}`);
      } else {
        console.log(`Table schema checked, found ${columns ? 'data' : 'no data'}`);
      }
    } catch (schemaError) {
      console.error('Error checking schema:', schemaError);
    }
    
    // Create a page record in the database - using only columns we know exist
    console.log(`Creating page record in database for crawl_id: ${crawlId}`);
    
    // Build insert object with only guaranteed fields
    const pageInsert = {
      crawl_id: crawlId,
      url: url,
      status_code: 200,
      content_type: 'text/html'
    };
    
    console.log('Inserting page with data:', JSON.stringify(pageInsert));
    
    const { data: pageData, error: pageError } = await supabase
      .from('seo_crawler_pages')
      .insert(pageInsert)
      .select('id')
      .single();
    
    if (pageError) {
      console.error(`Error inserting page record: ${pageError.message}`, pageError);
      console.error(`SQL: ${pageError.details || 'No details'}, Hint: ${pageError.hint || 'No hint'}`);
      await registerCrawlerError(supabase, crawlId, url, `Error inserting page record: ${pageError.message}`);
      return null;
    }
    
    if (!pageData) {
      console.error('No page data returned from insert operation');
      await registerCrawlerError(supabase, crawlId, url, 'No page data returned from insert operation');
      return null;
    }
    
    const pageId = pageData.id;
    console.log(`Created page record with ID: ${pageId}`);
    
    console.log('Starting regex-based HTML analysis');
    
    // Since we don't have DOMParser in Deno environment, we'll use regex for analysis
    // Example: Check for title tag
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    console.log(`Title extracted: ${title || 'Not found'}`);
    
    // Check for meta description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || 
                          html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
    console.log(`Meta description extracted: ${metaDescription ? (metaDescription.substring(0, 50) + '...') : 'Not found'}`);
    
    // Check for h1 tags
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : null;
    console.log(`H1 extracted: ${h1 || 'Not found'}`);
    
    // Extract all links from the page
    const links = extractLinks(html, url);
    console.log(`Found ${links.length} links on the page`);
    
    // Count internal and external links
    const normalizedUrl = normalizeUrl(url);
    const domainMatch = normalizedUrl.match(/^https?:\/\/([^\/]+)/);
    const domain = domainMatch ? domainMatch[1] : '';
    
    const internalLinks = links.filter(link => isInternalUrl(url, link));
    const externalLinks = links.filter(link => !isInternalUrl(url, link));
    
    console.log(`Internal links: ${internalLinks.length}, External links: ${externalLinks.length}`);
    
    // Initialize issues counter
    let issuesCount = 0;
    console.log('Starting SEO issue analysis');
    
    // Array to store issues
    const issues: SeoIssue[] = [];
    
    // Check for missing title
    if (!title || title.length === 0) {
      issuesCount++;
      console.log('Issue detected: missing title');
      
      issues.push({
        page_id: pageId,
        issue_type: 'missing_title',
        severity: 'high',
        description: 'The page is missing a title tag'
      });
    } else if (title.length < 10 || title.length > 60) {
      issuesCount++;
      console.log(`Issue detected: title length (${title.length} characters)`);
      
      issues.push({
        page_id: pageId,
        issue_type: 'title_length',
        severity: 'medium',
        description: `The title tag length (${title.length} characters) is ${title.length < 10 ? 'too short' : 'too long'}`
      });
    }
    
    // Check for missing meta description
    if (!metaDescription || metaDescription.length === 0) {
      issuesCount++;
      console.log('Issue detected: missing meta description');
      
      issues.push({
        page_id: pageId,
        issue_type: 'missing_meta_description',
        severity: 'medium',
        description: 'The page is missing a meta description tag'
      });
    } else if (metaDescription.length < 50 || metaDescription.length > 160) {
      issuesCount++;
      console.log(`Issue detected: meta description length (${metaDescription.length} characters)`);
      
      issues.push({
        page_id: pageId,
        issue_type: 'meta_description_length',
        severity: 'low',
        description: `The meta description length (${metaDescription.length} characters) is ${metaDescription.length < 50 ? 'too short' : 'too long'}`
      });
    }
    
    // Check for missing h1
    if (!h1 || h1.length === 0) {
      issuesCount++;
      console.log('Issue detected: missing H1');
      
      issues.push({
        page_id: pageId,
        issue_type: 'missing_h1',
        severity: 'medium',
        description: 'The page is missing an H1 heading'
      });
    }
    
    // Batch insert all issues
    if (issues.length > 0) {
      try {
        const { error: issuesError } = await supabase
          .from('seo_crawler_issues')
          .insert(issues);
          
        if (issuesError) {
          console.error(`Error recording issues: ${issuesError.message}`);
        }
      } catch (err) {
        console.error('Exception recording issues:', err);
      }
    }
    
    // Store links
    if (links.length > 0) {
      try {
        // Prepare links for insertion
        const linksToInsert = links.slice(0, 100).map(link => ({
          crawl_id: crawlId,
          page_id: pageId,
          url: link,
          is_internal: isInternalUrl(url, link),
          is_broken: false
        }));
        
        if (linksToInsert.length > 0) {
          const { error: linksError } = await supabase
            .from('seo_crawler_links')
            .insert(linksToInsert);
            
          if (linksError) {
            console.error(`Error saving links: ${linksError.message}`);
          } else {
            console.log(`Saved ${linksToInsert.length} links to database`);
          }
        }
      } catch (err) {
        console.error('Exception saving links:', err);
      }
    }
    
    // Update the page record with the analyzed content
    console.log('Updating page record with analysis results');
    try {
      const updateObject = {
        title: title || '',
        meta_description: metaDescription || '',
        h1: h1 || '',
        issues_count: issuesCount,
        internal_links_count: internalLinks.length,
        external_links_count: externalLinks.length
      };
      
      console.log('Updating page with data:', JSON.stringify(updateObject));
      
      const { error: updateError } = await supabase
        .from('seo_crawler_pages')
        .update(updateObject)
        .eq('id', pageId);
        
      if (updateError) {
        console.error(`Error updating page record: ${updateError.message}`);
      }
    } catch (err) {
      console.error('Exception updating page record:', err);
    }
    
    console.log(`Analysis complete: Found ${issuesCount} issues`);
    
    // Return the page result with links
    return {
      pageId,
      url,
      title: title || '',
      metaDescription: metaDescription || '',
      h1: h1 || '',
      issues: issuesCount,
      statusCode: 200, // Adding statusCode to match the type definition
      links: links.filter(link => isInternalUrl(url, link)).slice(0, 100)
    };
    
  } catch (error) {
    console.error(`Error processing HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    return null;
  }
}
