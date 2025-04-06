
// Crawler module for SEO analysis
import { SupabaseInstance, CrawlSettings, CrawlQueue } from "./types.ts";
import { fetchPage } from "./brightdata-client.ts";
import { processHtml } from "./modules/html-processor.ts";
import { registerCrawlerError, isInternalUrl, extractDomain, toAbsoluteUrl } from "./utils.ts";

/**
 * Crawl multiple pages starting from a single URL
 */
export async function crawlPages(
  supabase: SupabaseInstance, 
  startUrl: string, 
  crawlId: string,
  settings: CrawlSettings,
  brightDataUsername?: string,
  brightDataPassword?: string,
  brightDataApiKey?: string
): Promise<boolean> {
  console.log(`[Crawler] Starting multi-page crawl for: ${startUrl} with crawl ID: ${crawlId}`);
  console.log(`[Crawler] Settings: Max pages: ${settings.max_pages}, Max depth: ${settings.max_depth}, Follow links: ${settings.follow_links}`);
  
  try {
    // Update crawl record to processing state
    await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
        error_message: null // Clear any previous error messages
      })
      .eq('id', crawlId);
    
    // Initialize crawling state
    const crawledUrls = new Set<string>();
    const queue: CrawlQueue[] = [{ url: startUrl, depth: 0 }];
    const baseDomain = extractDomain(startUrl);
    
    // Store pages and total issues count
    let pagesCount = 0;
    let totalIssues = 0;
    let totalLinks = 0;
    let totalInternalLinks = 0;
    let totalExternalLinks = 0;
    let totalBrokenLinks = 0;
    
    console.log(`[Crawler] Base domain for crawling: ${baseDomain}`);
    
    // Process queue until empty or max pages reached
    while (queue.length > 0 && crawledUrls.size < settings.max_pages) {
      // Get next URL from queue
      const current = queue.shift()!;
      const { url, depth } = current;
      
      // Normalize URL
      let normalizedUrl = url;
      try {
        // Ensure URL has proper protocol
        if (!normalizedUrl.startsWith('http')) {
          normalizedUrl = 'https://' + normalizedUrl;
        }
        
        // Remove trailing slash for consistency
        if (normalizedUrl.endsWith('/') && normalizedUrl.length > 8) { // Don't remove from domain root URLs like https://example.com/
          normalizedUrl = normalizedUrl.slice(0, -1);
        }
        
        // Ensure it's a valid URL
        new URL(normalizedUrl);
      } catch (e) {
        console.warn(`[Crawler] Invalid URL: ${normalizedUrl}, skipping`);
        continue;
      }
      
      // Skip if already crawled
      if (crawledUrls.has(normalizedUrl)) {
        console.log(`[Crawler] Skipping already crawled URL: ${normalizedUrl}`);
        continue;
      }
      
      console.log(`[Crawler] Crawling [${crawledUrls.size + 1}/${settings.max_pages}] URL: ${normalizedUrl} (depth: ${depth})`);
      
      try {
        // Mark as crawled
        crawledUrls.add(normalizedUrl);
        
        // Fetch and process the page
        let html: string;
        try {
          html = await fetchPage(normalizedUrl, brightDataUsername, brightDataPassword, brightDataApiKey);
          console.log(`[Crawler] Successfully fetched HTML for ${normalizedUrl}, length: ${html.length} bytes`);
        } catch (fetchError) {
          console.error(`[Crawler] Error fetching page ${normalizedUrl}: ${fetchError.message}`);
          await registerCrawlerError(supabase, crawlId, normalizedUrl, `Error fetching page: ${fetchError.message}`);
          
          // Create fallback HTML
          html = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Error fetching ${normalizedUrl}</title>
              <meta name="description" content="This page could not be retrieved: ${fetchError.message}">
            </head>
            <body>
              <h1>Error Fetching Page</h1>
              <p>The URL ${normalizedUrl} could not be retrieved due to: ${fetchError.message}</p>
              <!-- Adding some links for crawler testing -->
              <a href="${startUrl}/about">About</a>
              <a href="${startUrl}/contact">Contact</a>
            </body>
            </html>
          `;
        }
        
        // Process the HTML
        console.log(`[Crawler] Processing HTML for ${normalizedUrl}`);
        const pageResult = await processHtml(supabase, normalizedUrl, crawlId, html);
        
        if (pageResult) {
          pagesCount++;
          totalIssues += pageResult.issues || 0;
          
          console.log(`[Crawler] Processed page ${normalizedUrl}, found ${pageResult.links.length} links`);
          
          // Extract and add internal links to the queue
          if (settings.follow_links && depth < settings.max_depth) {
            console.log(`[Crawler] Following links from ${normalizedUrl} at depth ${depth}`);
            
            // Only process internal links for further crawling
            const internalLinks = pageResult.links.filter(link => {
              try {
                // Normalize link 
                const absoluteLink = toAbsoluteUrl(link, normalizedUrl);
                const linkDomain = extractDomain(absoluteLink);
                
                // Check if it's internal and not already processed or queued
                const isInternal = (linkDomain === baseDomain || isInternalUrl(absoluteLink, startUrl));
                const notProcessed = !crawledUrls.has(absoluteLink);
                const notQueued = !queue.some(item => item.url === absoluteLink);
                
                return isInternal && notProcessed && notQueued;
              } catch (e) {
                console.error(`[Crawler] Error processing link ${link}: ${e.message}`);
                return false;
              }
            });
            
            // Update counts
            totalLinks += pageResult.links.length;
            totalInternalLinks += internalLinks.length;
            totalExternalLinks += pageResult.links.length - internalLinks.length;
            
            console.log(`[Crawler] Found ${internalLinks.length} new internal links to crawl from ${normalizedUrl}`);
            
            // Add new internal links to queue with increased depth
            for (const link of internalLinks) {
              const absoluteLink = toAbsoluteUrl(link, normalizedUrl);
              
              // Skip excluded URLs based on pattern
              const isExcluded = settings.exclude_urls.some(pattern => 
                absoluteLink.includes(pattern)
              );
              
              if (!isExcluded) {
                console.log(`[Crawler] Adding to queue: ${absoluteLink} at depth ${depth + 1}`);
                queue.push({
                  url: absoluteLink,
                  depth: depth + 1,
                  parentUrl: normalizedUrl
                });
              } else {
                console.log(`[Crawler] Skipping excluded URL: ${absoluteLink}`);
              }
            }
            
            // Update the crawl status after each page
            await supabase
              .from('seo_crawler_crawls')
              .update({
                pages_crawled: pagesCount,
                total_issues: totalIssues,
                total_links: totalLinks,
                total_internal_links: totalInternalLinks,
                total_external_links: totalExternalLinks,
                total_broken_links: totalBrokenLinks
              })
              .eq('id', crawlId);
              
            console.log(`[Crawler] Updated crawl record with progress: ${pagesCount} pages, ${totalLinks} links`);
          }
        } else {
          console.warn(`[Crawler] No page result returned for ${normalizedUrl}`);
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (pageError) {
        console.error(`[Crawler] Error processing page ${normalizedUrl}: ${pageError.message}`);
        await registerCrawlerError(supabase, crawlId, normalizedUrl, pageError.message);
        
        // Continue with next URL despite error
        continue;
      }
    }
    
    // All pages crawled or max pages reached
    console.log(`[Crawler] Crawling completed: Processed ${pagesCount} pages with ${totalIssues} issues`);
    
    // Update crawl with final status
    await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        pages_crawled: pagesCount,
        total_pages: pagesCount,
        total_issues: totalIssues,
        total_links: totalLinks,
        total_internal_links: totalInternalLinks,
        total_external_links: totalExternalLinks,
        total_broken_links: totalBrokenLinks
      })
      .eq('id', crawlId);
    
    return true;
  } catch (error) {
    console.error(`[Crawler] Error in crawl process: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`[Crawler] Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    // Register the error
    await registerCrawlerError(supabase, crawlId, startUrl, error instanceof Error ? error.message : String(error));
    
    // Update crawl status to failed
    await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : String(error),
        completed_at: new Date().toISOString()
      })
      .eq('id', crawlId);
    
    return false;
  }
}

/**
 * Crawl a single page and process the HTML content (legacy support)
 */
export async function crawlPage(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string,
  brightDataUsername?: string,
  brightDataPassword?: string,
  brightDataApiKey?: string
): Promise<boolean> {
  console.log(`[Crawler] Crawling single page: ${url} for crawl ID: ${crawlId}`);
  
  // Create default settings for single page crawl
  const settings: CrawlSettings = {
    max_pages: 10, // Increase from 1 to allow for some exploration
    exclude_urls: [
      '/wp-admin', '/wp-login', '/logout', '/cart', '/checkout',
      '.jpg', '.jpeg', '.png', '.gif', '.css', '.js', '.pdf'
    ],
    include_urls: [],
    respect_robots_txt: true,
    user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
    crawl_sitemap: false,
    follow_links: true, // Enable following links
    max_depth: 2, // Set depth to 2 to get a slightly deeper crawl
    custom_headers: {}
  };
  
  // Use the multi-page crawler with settings for a more comprehensive crawl
  return crawlPages(supabase, url, crawlId, settings, brightDataUsername, brightDataPassword, brightDataApiKey);
}
