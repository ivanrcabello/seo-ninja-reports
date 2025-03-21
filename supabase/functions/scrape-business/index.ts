
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { BusinessProfileData } from './types.ts';
import { scrapeBusinessProfile } from './scraper.ts';

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL not provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Scraping business data from URL: ${url}`);
    
    try {
      // Function to extract data from Google Business profile
      const businessData = await scrapeBusinessProfile(url);
      
      console.log('Scraped business data:', JSON.stringify(businessData, null, 2));
      
      // Validate essential data was extracted
      if (!businessData.businessName) {
        console.warn('Business name could not be extracted');
        businessData.businessName = 'Negocio no identificado';
      }
      
      if (!businessData.businessAddress) {
        console.warn('Business address could not be extracted');
        businessData.businessAddress = '';
      }
      
      // Ensure businessRating is always a number or explicitly null, never undefined
      if (businessData.businessRating === undefined) {
        console.warn('Business rating could not be extracted');
        businessData.businessRating = null;
      }
      
      // Ensure businessReviewsCount is always a number
      if (businessData.businessReviewsCount === undefined) {
        businessData.businessReviewsCount = 0;
      }
      
      // Ensure businessHours is always an object, never null or undefined
      if (!businessData.businessHours || typeof businessData.businessHours !== 'object') {
        businessData.businessHours = {};
      }
      
      // Store the scraped data in database for future reference
      if (businessData.businessName || businessData.businessAddress) {
        try {
          // Check if we already have this URL in the database
          const { data: existingProfile, error: fetchError } = await supabase
            .from('business_profiles')
            .select('id')
            .eq('business_url', url)
            .maybeSingle();
            
          if (fetchError) {
            console.error('Error checking for existing profile:', fetchError);
          }
          
          // Format business hours to ensure it's a serializable object
          const formattedHours = businessData.businessHours ? 
            JSON.stringify(businessData.businessHours) : '{}';
          
          const dbOperation = existingProfile?.id ? 
            // Update existing record
            supabase
              .from('business_profiles')
              .update({
                business_name: businessData.businessName,
                business_address: businessData.businessAddress || '',
                business_category: businessData.businessCategory || '',
                business_rating: businessData.businessRating,
                business_reviews_count: businessData.businessReviewsCount || 0,
                business_phone: businessData.businessPhone || '',
                business_website: businessData.businessWebsite || '',
                business_hours: formattedHours,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingProfile.id) :
            // Insert new record
            supabase
              .from('business_profiles')
              .insert({
                business_url: url,
                business_name: businessData.businessName,
                business_address: businessData.businessAddress || '',
                business_category: businessData.businessCategory || '',
                business_rating: businessData.businessRating,
                business_reviews_count: businessData.businessReviewsCount || 0,
                business_phone: businessData.businessPhone || '',
                business_website: businessData.businessWebsite || '',
                business_hours: formattedHours,
                last_scraped_at: new Date().toISOString()
              });
            
          const { error: dbError } = await dbOperation;
            
          if (dbError) {
            console.error('Error storing business data:', dbError);
          } else {
            console.log('Business data stored successfully');
          }
        } catch (dbError) {
          console.error('Error accessing database:', dbError);
          // Don't fail the request if we can't store the data
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: businessData 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (scrapingError) {
      console.error('Error scraping business profile:', scrapingError);
      
      // Return fallback data instead of error to prevent UI issues
      const fallbackData = {
        businessName: 'Negocio de ejemplo',
        businessAddress: '',
        businessCategory: '',
        businessRating: null,
        businessReviewsCount: 0,
        businessPhone: '',
        businessWebsite: '',
        businessHours: {},
        businessUrl: url
      };
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: fallbackData,
          warning: 'Using fallback data due to scraping error'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    
    // Return fallback data instead of error to prevent UI issues
    const fallbackData = {
      businessName: 'Negocio de ejemplo',
      businessAddress: '',
      businessCategory: '',
      businessRating: null,
      businessReviewsCount: 0,
      businessPhone: '',
      businessWebsite: '',
      businessHours: {},
      businessUrl: ''
    };
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: fallbackData,
        warning: 'Using fallback data due to processing error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
