
// Main handler for the SEO Crawler Edge Function
import { corsHeaders } from "./cors-headers.ts";
import { SupabaseInstance } from "./types.ts";
import { fetchPage } from './modules/crawler.ts';
import { processHtml } from './modules/html-processor.ts';

export async function handleRequest(req: Request, supabase: SupabaseInstance) {
  // Only handle POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "This endpoint only supports POST requests" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  }

  try {
    let requestBody;

    try {
      requestBody = await req.json();
    } catch (err) {
      console.error('Error parsing request body:', err);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate required input parameters
    const { url, crawlId } = requestBody;
    if (!url || !crawlId) {
      console.error('Missing required parameters:', { url, crawlId });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters: url and crawlId" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Starting SEO crawler for URL: ${url}, crawl ID: ${crawlId}`);

    // Update crawl status to processing
    const { error: updateError } = await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', crawlId);

    if (updateError) {
      console.error(`Error updating crawl status: ${updateError.message}`);
      throw new Error(`Error updating crawl status: ${updateError.message}`);
    }

    // Fetch the page HTML content using Bright Data
    console.log(`Fetching HTML content for ${url}...`);
    const html = await fetchPage(url);
    console.log(`Received response for ${url}, HTML length: ${html ? html.length : 0}`);

    if (!html || html.length === 0) {
      throw new Error('No HTML content received from Bright Data');
    }

    // Process the HTML content
    console.log('Processing HTML content...');
    const result = await processHtml(supabase, url, crawlId, html);

    console.log(`HTML processing complete, result: ${result ? 'success' : 'failed'}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Crawl completed successfully', 
        result 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in SEO crawler handler: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error in SEO crawler: ${error instanceof Error ? error.message : String(error)}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
