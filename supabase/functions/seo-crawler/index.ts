
// SEO Crawler Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Simplified SEO issues for basic analysis
const SEO_ISSUES = {
  MISSING_TITLE: {
    type: 'missing_title',
    severity: 'high',
    description: 'La página no tiene título',
    fix: 'Añadir un título descriptivo y relevante a la página'
  },
  MISSING_META_DESCRIPTION: {
    type: 'missing_meta_description',
    severity: 'medium',
    description: 'La página no tiene meta descripción',
    fix: 'Añadir una meta descripción concisa y relevante'
  },
  MISSING_H1: {
    type: 'missing_h1',
    severity: 'high',
    description: 'La página no tiene un encabezado H1',
    fix: 'Añadir un encabezado H1 que refleje el contenido principal de la página'
  }
};

// Helper function to detect if a URL is internal
function isInternalUrl(baseUrl: string, url: string): boolean {
  if (!url || url.startsWith('#') || url.startsWith('javascript:')) {
    return false;
  }
  
  try {
    const parsedBaseUrl = new URL(baseUrl);
    const baseDomain = parsedBaseUrl.hostname;
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      return true;
    }
    
    const parsedUrl = new URL(url, baseUrl);
    return parsedUrl.hostname === baseDomain;
  } catch (e) {
    console.error(`Error checking if URL is internal: ${url}`, e);
    return false;
  }
}

// Simpler crawl function that focuses on reliability
async function crawlPage(url: string, crawlId: string) {
  console.log(`Analyzing page: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SEO-Crawler/1.0' }
    });
    
    // Get content type
    const contentType = response.headers.get('content-type') || '';
    
    // Skip non-HTML content
    if (!contentType.includes('text/html')) {
      return null;
    }
    
    // Get content
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract basic page details
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text().trim();
    
    // Count elements
    const h1Count = $('h1').length;
    const wordCount = html.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .length;
    
    // Link analysis
    const links = $('a[href]');
    let internalLinksCount = 0;
    let externalLinksCount = 0;
    
    links.each((_, link) => {
      const href = $(link).attr('href') || '';
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        if (isInternalUrl(url, href)) {
          internalLinksCount++;
        } else {
          externalLinksCount++;
        }
      }
    });
    
    // Page analysis result
    const pageEntry = {
      id: crypto.randomUUID(),
      crawl_id: crawlId,
      url: url,
      status_code: response.status,
      title: title,
      meta_description: metaDescription,
      h1: h1,
      word_count: wordCount,
      h1_count: h1Count,
      internal_links_count: internalLinksCount,
      external_links_count: externalLinksCount
    };
    
    // Store page in database
    const { error: pageError } = await supabase
      .from('seo_crawl_pages')
      .insert(pageEntry);
      
    if (pageError) {
      console.error(`Error saving page ${url}:`, pageError);
      return null;
    }
    
    // Basic SEO issues check
    const issues = [];
    
    if (!title) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: SEO_ISSUES.MISSING_TITLE.type,
        severity: SEO_ISSUES.MISSING_TITLE.severity,
        description: SEO_ISSUES.MISSING_TITLE.description,
        recommended_fix: SEO_ISSUES.MISSING_TITLE.fix
      });
    }
    
    if (!metaDescription) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: SEO_ISSUES.MISSING_META_DESCRIPTION.type,
        severity: SEO_ISSUES.MISSING_META_DESCRIPTION.severity,
        description: SEO_ISSUES.MISSING_META_DESCRIPTION.description,
        recommended_fix: SEO_ISSUES.MISSING_META_DESCRIPTION.fix
      });
    }
    
    if (!h1) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: SEO_ISSUES.MISSING_H1.type,
        severity: SEO_ISSUES.MISSING_H1.severity,
        description: SEO_ISSUES.MISSING_H1.description,
        recommended_fix: SEO_ISSUES.MISSING_H1.fix
      });
    }
    
    // Save issues if any
    if (issues.length > 0) {
      const { error: issuesError } = await supabase
        .from('seo_crawl_issues')
        .insert(issues);
        
      if (issuesError) {
        console.error(`Error saving issues for page ${url}:`, issuesError);
      }
    }
    
    return {
      pageId: pageEntry.id,
      url,
      issues: issues.length
    };
    
  } catch (error) {
    console.error(`Error analyzing page ${url}:`, error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    if (req.method === 'POST') {
      const { url, crawlId } = await req.json();
      
      if (!url || !crawlId) {
        return new Response(
          JSON.stringify({ error: 'URL and crawlId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Analyze main page first
      const mainPage = await crawlPage(url, crawlId);
      
      if (!mainPage) {
        throw new Error('Failed to analyze main page');
      }
      
      // Update crawl status
      await supabase
        .from('seo_crawl_results')
        .update({
          status: 'completed',
          pages_crawled: 1,
          issues_count: mainPage.issues,
          total_time_seconds: 1
        })
        .eq('id', crawlId);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Page analyzed successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    
    // Try to update crawl status to error
    try {
      if (req.method === 'POST') {
        const { crawlId } = await req.json();
        if (crawlId) {
          await supabase
            .from('seo_crawl_results')
            .update({ status: 'error' })
            .eq('id', crawlId);
        }
      }
    } catch (e) {
      console.error('Error updating crawl status:', e);
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
