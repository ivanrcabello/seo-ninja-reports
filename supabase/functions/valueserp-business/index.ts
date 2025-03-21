
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, apiKey, clientId, saveToDb, test } = await req.json()

    // Validate request
    if (!query) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Query parameter is required',
          data: simulateBusinessProfile(query || 'Example Business')
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'ValueSerp API key is required',
          data: simulateBusinessProfile(query)
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // If it's a test request, just validate the API key
    if (test) {
      try {
        const testResponse = await fetch(
          `https://api.valueserp.com/search?api_key=${apiKey}&q=test&location=Spain&gl=es&hl=es&google_domain=google.es&output=json&include_fields=search_information&include_html=false&engine=google`
        )
        
        const testData = await testResponse.json()
        
        if (testData.request_info && testData.request_info.success) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'API key is valid'
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'API key is invalid or request failed'
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400
            }
          )
        }
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Error testing API key: ${error.message}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        )
      }
    }

    // Make request to ValueSerp API
    console.log(`Making request to ValueSerp API for query: "${query}"\n`)
    
    const url = new URL('https://api.valueserp.com/search')
    url.searchParams.append('api_key', apiKey)
    url.searchParams.append('q', query)
    url.searchParams.append('location', 'Spain')
    url.searchParams.append('gl', 'es')
    url.searchParams.append('hl', 'es')
    url.searchParams.append('google_domain', 'google.es')
    url.searchParams.append('output', 'json')
    url.searchParams.append('include_fields', 'search_information,knowledge_graph,local_results,organic_results')
    url.searchParams.append('include_html', 'false')
    url.searchParams.append('engine', 'google')

    const response = await fetch(url.toString())
    const data = await response.json()

    // Check if the request was successful
    if (!data.request_info || !data.request_info.success) {
      console.error('ValueSerp API request failed:', data)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'ValueSerp API request failed',
          data: simulateBusinessProfile(query)
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Extract business data from the response
    const businessData = extractBusinessData(data, query)
    let savedToDb = null

    // Save to database if requested and we have valid data
    if (saveToDb && clientId && businessData.businessName && businessData.businessName !== 'Negocio de ejemplo') {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') || '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        )

        console.log(`Saving business data to database for client: ${clientId}`)

        // Check if a record already exists for this client
        const { data: existingListing, error: fetchError } = await supabaseClient
          .from('google_business_listings')
          .select('id')
          .eq('client_id', clientId)
          .maybeSingle()

        if (fetchError) {
          console.error('Error checking for existing listing:', fetchError)
        }

        if (existingListing?.id) {
          // Update existing record
          const { data: updatedListing, error: updateError } = await supabaseClient
            .from('google_business_listings')
            .update({
              title: businessData.businessName,
              address: businessData.businessAddress,
              phone: businessData.businessPhone,
              rating: businessData.businessRating,
              reviews: businessData.businessReviewsCount,
              website: businessData.businessWebsite,
              hours: JSON.stringify(businessData.businessHours),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingListing.id)
            .select()
            .single()

          if (updateError) {
            console.error('Error updating business listing:', updateError)
          } else {
            console.log('Updated business listing:', updatedListing)
            savedToDb = updatedListing
          }
        } else {
          // Insert new record
          const { data: newListing, error: insertError } = await supabaseClient
            .from('google_business_listings')
            .insert({
              client_id: clientId,
              title: businessData.businessName,
              address: businessData.businessAddress,
              phone: businessData.businessPhone,
              rating: businessData.businessRating,
              reviews: businessData.businessReviewsCount,
              website: businessData.businessWebsite,
              hours: JSON.stringify(businessData.businessHours),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (insertError) {
            console.error('Error inserting business listing:', insertError)
          } else {
            console.log('Inserted new business listing:', newListing)
            savedToDb = newListing
          }
        }
      } catch (error) {
        console.error('Error saving to database:', error)
      }
    }

    // Return the formatted response
    return new Response(
      JSON.stringify({
        success: true,
        data: businessData,
        source: determineDataSource(data),
        raw_response: data,
        local_results: data.local_results,
        savedToDb
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: `Unexpected error: ${error.message}`,
        data: simulateBusinessProfile('Error')
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// Helper function to extract business data from ValueSerp response
function extractBusinessData(data: any, query: string) {
  // First try local results
  if (data.local_results && data.local_results.length > 0) {
    const localResult = data.local_results[0]
    
    // Extract business hours
    let businessHours = {}
    if (localResult.hours_table) {
      businessHours = localResult.hours_table
    } else if (localResult.hours) {
      // For simpler hours format
      businessHours = { 'Hours': localResult.hours }
    }
    
    return {
      businessName: localResult.title,
      businessAddress: localResult.address || '',
      businessPhone: localResult.phone || '',
      businessRating: localResult.rating ? parseFloat(localResult.rating) : null,
      businessReviewsCount: localResult.reviews ? parseInt(localResult.reviews.toString()) : 0,
      businessWebsite: localResult.website || '',
      businessHours,
      businessUrl: localResult.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    }
  }

  // Then try knowledge graph
  if (data.knowledge_graph) {
    const kg = data.knowledge_graph
    
    // Extract business hours
    let businessHours = {}
    if (kg.hours) {
      businessHours = { 'Hours': kg.hours }
    }
    
    return {
      businessName: kg.title || '',
      businessAddress: kg.address || '',
      businessPhone: kg.phone || '',
      businessRating: kg.rating ? parseFloat(kg.rating) : null,
      businessReviewsCount: kg.reviews_count ? parseInt(kg.reviews_count.toString()) : 0,
      businessWebsite: kg.website || '',
      businessHours,
      businessUrl: kg.website || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    }
  }

  // If organic results exist and no business data found yet, try to extract from the first relevant result
  if (data.organic_results && data.organic_results.length > 0) {
    const organicResult = data.organic_results[0]
    
    return {
      businessName: organicResult.title || query,
      businessAddress: '',  // Usually not available in organic results
      businessPhone: '',    // Usually not available in organic results
      businessRating: null,
      businessReviewsCount: 0,
      businessWebsite: organicResult.link || '',
      businessHours: {},
      businessUrl: organicResult.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    }
  }

  // Return simulated data if no useful information found
  return simulateBusinessProfile(query)
}

// Determine the source of data
function determineDataSource(data: any) {
  if (data.local_results && data.local_results.length > 0) {
    return 'local_results'
  }
  if (data.knowledge_graph) {
    return 'knowledge_graph'
  }
  if (data.organic_results && data.organic_results.length > 0) {
    return 'organic_results'
  }
  return 'simulated'
}

// Generate simulated business profile for fallback
function simulateBusinessProfile(query: string) {
  return {
    businessName: 'Negocio de ejemplo',
    businessAddress: 'Calle Ejemplo 123, Ciudad',
    businessCategory: 'Servicios Profesionales',
    businessRating: 4.7,
    businessReviewsCount: 42,
    businessPhone: '+34 123 456 789',
    businessWebsite: 'https://www.ejemplo.com',
    businessHours: {
      'Monday': '9:00 - 18:00',
      'Tuesday': '9:00 - 18:00',
      'Wednesday': '9:00 - 18:00',
      'Thursday': '9:00 - 18:00',
      'Friday': '9:00 - 17:00',
      'Saturday': 'Cerrado',
      'Sunday': 'Cerrado'
    },
    businessUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  }
}
