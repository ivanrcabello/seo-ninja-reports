
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { handleServiceError } from '../baseService';

/**
 * Fetches the business profile for a specific client
 */
export const fetchBusinessProfile = async (clientId: string): Promise<BusinessProfile | null> => {
  try {
    if (!clientId) {
      throw new Error('clientId is required');
    }

    console.log(`Fetching business profile for client: ${clientId}`);
    
    // First try to get from the newer google_business_listings table
    const { data: businessListingData, error: businessListingError } = await supabase
      .from('google_business_listings')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false })
      .limit(1);
      
    if (businessListingError) {
      console.error('Error fetching business listing:', businessListingError);
    }
    
    if (businessListingData && businessListingData.length > 0) {
      const listing = businessListingData[0];
      console.log('Fetched business listing data:', businessListingData);
      
      // Parse hours JSON
      let businessHours = {};
      if (listing.hours) {
        try {
          if (typeof listing.hours === 'string') {
            businessHours = JSON.parse(listing.hours);
          } else if (typeof listing.hours === 'object') {
            businessHours = listing.hours;
          }
        } catch (e) {
          console.error('Error parsing business hours:', e);
        }
      }
      
      console.log('Loaded real business profile from database:', {
        businessName: listing.title,
        businessAddress: listing.address,
        businessPhone: listing.phone,
        businessRating: listing.rating,
        businessReviewsCount: listing.reviews,
        businessHours,
        businessWebsite: listing.website,
        businessUrl: listing.place_id
      });
      
      // Return transformed business listing
      return {
        id: listing.id,
        reportId: null,
        businessName: listing.title || '',
        businessAddress: listing.address || '',
        businessPhone: listing.phone || '',
        businessCategory: '',
        businessRating: listing.rating !== undefined ? listing.rating : null,
        businessReviewsCount: listing.reviews || 0,
        businessWebsite: listing.website || '',
        businessUrl: listing.place_id || '',
        businessHours,
        createdAt: listing.created_at,
        updatedAt: listing.updated_at
      };
    }
    
    // Fall back to the business_profiles table if no listing found
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('report_id', clientId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching business profile:', error);
      throw error;
    }
    
    if (!data) {
      console.log('No business profile found for report:', clientId);
      return null;
    }
    
    console.log('Business profile found:', data);
    
    // Parse business hours
    let businessHours = {};
    
    if (data.business_hours) {
      try {
        if (typeof data.business_hours === 'string') {
          businessHours = JSON.parse(data.business_hours);
        } else if (typeof data.business_hours === 'object') {
          businessHours = data.business_hours;
        }
      } catch (parseError) {
        console.error('Error parsing business hours:', parseError);
        // Continue with empty hours if there's a problem
        businessHours = {};
      }
    }
      
    // Transform to frontend format
    return {
      id: data.id,
      reportId: data.report_id,
      businessName: data.business_name || '',
      businessAddress: data.business_address || '',
      businessPhone: data.business_phone || '',
      businessCategory: data.business_category || '',
      businessRating: data.business_rating !== undefined ? data.business_rating : null,
      businessReviewsCount: data.business_reviews_count || 0,
      businessWebsite: data.business_website || '',
      businessUrl: data.business_url || '',
      businessHours,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    return handleServiceError(error, 'Error fetching business profile');
  }
};
