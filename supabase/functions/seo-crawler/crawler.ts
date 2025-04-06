
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
  console.log(`Starting multi-page crawl for: ${startUrl} with crawl ID: ${crawlId}`);
  console.log(`Crawler settings: Max pages: ${settings.max_pages}, Max depth: ${settings.max_depth}`);
  
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
    
    console.log(`Base domain for crawling: ${baseDomain}`);
    
    // Process queue until empty or max pages reached
    while (queue.length > 0 && crawledUrls.size < settings.max_pages) {
      // Get next URL from queue
      const current = queue.shift()!;
      const { url, depth } = current;
      
      // Skip if already crawled
      if (crawledUrls.has(url)) {
        console.log(`Skipping already crawled URL: ${url}`);
        continue;
      }
      
      console.log(`Crawling [${crawledUrls.size + 1}/${settings.max_pages}] URL: ${url} (depth: ${depth})`);
      
      try {
        // Mark as crawled
        crawledUrls.add(url);
        
        // Fetch and process the page
        let html: string;
        try {
          html = await fetchPage(url, brightDataUsername, brightDataPassword, brightDataApiKey);
        } catch (fetchError) {
          console.error(`Error fetching page ${url}: ${fetchError.message}`);
          await registerCrawlerError(supabase, crawlId, url, `Error fetching page: ${fetchError.message}`);
          
          // Create fallback HTML
          html = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Error: ${url}</title>
              <meta name="description" content="This page could not be retrieved: ${fetchError.message}">
            </head>
            <body>
              <h1>Error Fetching Content</h1>
              <p>The URL ${url} could not be retrieved due to: ${fetchError.message}</p>
            </body>
            </html>
          `;
        }
        
        // Process the HTML
        const pageResult = await processHtml(supabase, url, crawlId, html);
        
        if (pageResult) {
          pagesCount++;
          totalIssues += pageResult.issues || 0;
          
          // Extract and add internal links to the queue
          if (settings.follow_links && depth < settings.max_depth) {
            // Only process internal links for further crawling
            const internalLinks = pageResult.links.filter(link => {
              try {
                // Normalize link 
                const absoluteLink = toAbsoluteUrl(link, url);
                const linkDomain = extractDomain(absoluteLink);
                return (linkDomain === baseDomain || isInternalUrl(absoluteLink, startUrl))
                  && !crawledUrls.has(absoluteLink)
                  && !queue.some(item => item.url === absoluteLink);
              } catch (e) {
                console.error(`Error processing link ${link}: ${e.message}`);
                return false;
              }
            });
            
            // Update counts
            totalLinks += pageResult.links.length;
            totalInternalLinks += internalLinks.length;
            totalExternalLinks += pageResult.links.length - internalLinks.length;
            
            console.log(`Found ${internalLinks.length} new internal links to crawl`);
            
            // Add new internal links to queue with increased depth
            for (const link of internalLinks) {
              const absoluteLink = toAbsoluteUrl(link, url);
              
              // Skip excluded URLs based on pattern
              const isExcluded = settings.exclude_urls.some(pattern => 
                absoluteLink.includes(pattern)
              );
              
              if (!isExcluded) {
                queue.push({
                  url: absoluteLink,
                  depth: depth + 1,
                  parentUrl: url
                });
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
          }
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (pageError) {
        console.error(`Error processing page ${url}: ${pageError.message}`);
        await registerCrawlerError(supabase, crawlId, url, pageError.message);
        
        // Continue with next URL despite error
        continue;
      }
    }
    
    // All pages crawled or max pages reached
    console.log(`Crawling completed: Processed ${pagesCount} pages with ${totalIssues} issues`);
    
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
    console.error(`Error in crawl process: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
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
  console.log(`[Legacy] Crawling single page: ${url} for crawl ID: ${crawlId}`);
  
  // Create default settings for single page crawl
  const settings: CrawlSettings = {
    max_pages: 1,
    exclude_urls: [],
    include_urls: [],
    respect_robots_txt: true,
    user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
    crawl_sitemap: false,
    follow_links: false,
    max_depth: 0,
    custom_headers: {}
  };
  
  // Use the multi-page crawler with settings that restrict to just one page
  return crawlPages(supabase, url, crawlId, settings, brightDataUsername, brightDataPassword, brightDataApiKey);
}
