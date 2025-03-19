
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const email = 'ivan@soyseolocal.com'
    const password = '6126219271'

    // Check if the admin user already exists
    const { data: existingUsers, error: fetchError } = await supabaseAdmin.auth.admin.listUsers()
    if (fetchError) {
      throw fetchError
    }

    const adminExists = existingUsers.users.some(user => user.email === email)

    if (adminExists) {
      return new Response(
        JSON.stringify({ message: 'El usuario administrador ya existe' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create the admin user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      throw error
    }

    console.log('Usuario administrador creado con éxito:', data)

    return new Response(
      JSON.stringify({ 
        message: 'Usuario administrador creado con éxito',
        user: data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error al crear usuario administrador:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
