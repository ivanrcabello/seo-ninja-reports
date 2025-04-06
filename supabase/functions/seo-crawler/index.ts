
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./cors-headers.ts";
import { handleRequest } from "./handler.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

console.log(`[IndexTS] Function started with Supabase URL: ${supabaseUrl}`);

// Log environment check for EdgeRuntime
try {
  // @ts-ignore
  if (typeof EdgeRuntime !== 'undefined') {
    console.log('[IndexTS] EdgeRuntime is available for background tasks');
  } else {
    console.log('[IndexTS] EdgeRuntime is not available, will use regular async processing');
  }
} catch (e) {
  console.log('[IndexTS] EdgeRuntime check error:', e.message);
}

// Create a Supabase client with the service role key for admin access
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      // Add the Supabase service role key to bypass RLS
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    },
  },
});

// Handle shutdown event if available
try {
  // @ts-ignore
  addEventListener('beforeunload', (ev) => {
    console.log('[IndexTS] Function shutdown event fired, reason:', ev.detail?.reason);
  });
} catch (e) {
  console.log('[IndexTS] beforeunload event registration not available');
}

// Serve function
serve(async (req) => {
  console.log(`[IndexTS] Request received: ${req.method} ${new URL(req.url).pathname}`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log('[IndexTS] Handling CORS preflight request');
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Delegate to the handler
    const response = await handleRequest(req, supabase);
    console.log('[IndexTS] Request handled successfully');
    return response;
  } catch (error) {
    console.error(`[IndexTS] Unhandled error in request processing: ${error.message}`);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Server error: ${error.message}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

console.log('[IndexTS] SEO crawler function is ready to serve requests');
