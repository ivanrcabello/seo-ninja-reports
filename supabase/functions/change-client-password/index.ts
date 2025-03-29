
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-client-token',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Get request data
    const { accountId, currentPassword, newPassword } = await req.json()
    
    // Get the client token from the request headers
    const clientToken = req.headers.get('x-client-token')
    
    if (!clientToken) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing client token'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }
    
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
    
    // Verify that the client token is valid and matches the account
    const { data: tokenData, error: tokenError } = await supabaseClient
      .rpc('validate_client_portal_session', {
        p_token: clientToken
      })
      
    if (tokenError || !tokenData || tokenData.length === 0 || !tokenData[0].is_valid) {
      console.error('Token validation error:', tokenError || 'Invalid token')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired session' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }
    
    // Verify that the account ID matches the token's account ID
    if (tokenData[0].account_id !== accountId) {
      console.error('Account ID mismatch')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized access to this account' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      )
    }
    
    // Use the secured RPC function to change the password
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
    
    // If the function returns false, it means the current password was incorrect
    if (data === false) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Current password is incorrect' 
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
