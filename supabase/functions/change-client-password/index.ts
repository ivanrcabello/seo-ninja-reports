
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Get request data
    const { accountId, currentPassword, newPassword } = await req.json()
    
    // Validate input
    if (!accountId || !currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Create Supabase client using the Deno runtime environment variables
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Query the client_portal_accounts table directly
    const { data: accountData, error: accountError } = await supabaseClient
      .from('client_portal_accounts')
      .select('*')
      .eq('id', accountId)
      .single()
      
    if (accountError || !accountData) {
      console.error('Error fetching account:', accountError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Account not found' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }
    
    // Use SQL to update the password directly with proper hashing
    const { data, error } = await supabaseClient.rpc(
      'change_client_portal_password', 
      {
        p_account_id: accountId,
        p_current_password: currentPassword,
        p_new_password: newPassword
      }
    )
    
    if (error) {
      console.error('Error changing password:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to change password. Please check your current password.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
