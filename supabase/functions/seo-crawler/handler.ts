
// Main handler for the SEO Crawler Edge Function
import { corsHeaders } from "./cors-headers.ts";
import { SupabaseInstance } from "./types.ts";
import { crawlPage } from './crawler.ts';

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
      // Get a clone of the request to avoid "Body already consumed" errors
      const requestClone = req.clone();
      requestBody = await requestClone.json();
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
    const { url, crawlId, brightDataUsername, brightDataPassword, brightDataApiKey } = requestBody;
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
    console.log('Bright Data credentials provided:', {
      username: brightDataUsername ? 'yes' : 'no',
      password: brightDataPassword ? 'yes' : 'no',
      apiKey: brightDataApiKey ? 'yes' : 'no'
    });
    
    // If API key is provided, log first few characters for debugging
    if (brightDataApiKey) {
      console.log('Bright Data API key starts with:', brightDataApiKey.substring(0, 5) + '...');
    }
    
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

    // Start the crawl process directly - passing the credentials directly
    console.log(`Starting page crawl for ${url}...`);
    const result = await crawlPage(supabase, url, crawlId, brightDataUsername, brightDataPassword, brightDataApiKey);
    console.log(`Crawl completed, result: ${result ? 'success' : 'failed'}`);

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
