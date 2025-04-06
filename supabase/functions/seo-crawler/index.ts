
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./cors-headers.ts";
import { handleRequest } from "./handler.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create a Supabase client with the service role key for admin access
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      // Add the Supabase service role key to bypass RLS
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    },
  },
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Delegate to the handler
  return handleRequest(req, supabase);
});
