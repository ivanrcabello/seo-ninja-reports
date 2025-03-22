
import { useState } from 'react';
import { BusinessProfile } from '@/types/report.types';
import { saveBusinessProfile } from '@/services/api/businessProfile/saveBusinessProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessProfileSave = (clientId?: string) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveBusinessProfileData = async (displayProfile: Partial<BusinessProfile> | null) => {
    if (!clientId || !displayProfile) {
      console.error("Cannot save business profile: missing clientId or profile data");
      toast.error("No se puede guardar: faltan datos");
      return;
    }
    
    // Don't save simulated data
    if (displayProfile.businessName === 'Negocio de ejemplo' || 
        displayProfile.businessName?.includes('ejemplo')) {
      toast.error("No se pueden guardar datos simulados");
      console.error("Attempted to save simulated data, operation aborted");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Saving business profile data:", displayProfile);
      
      // Save to Google Business Listings table
      await saveToBusinessListings(clientId, displayProfile);
      
      // Save to report
      const savedToReport = await saveToReport(clientId, displayProfile);
      
      if (savedToReport) {
        toast.success('Perfil de negocio guardado correctamente');
        
        // Store last saved profile in localStorage for backup
        try {
          localStorage.setItem('last_saved_business_profile', JSON.stringify({
            profile: displayProfile,
            clientId: clientId,
            timestamp: new Date().toISOString()
          }));
        } catch (e) {
          console.warn('Could not store profile backup in localStorage:', e);
        }
      }
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Error al guardar el perfil de negocio');
    } finally {
      setIsSaving(false);
    }
  };
  
  const saveToBusinessListings = async (clientId: string, profile: Partial<BusinessProfile>) => {
    try {
      // Extract place_id from businessUrl if available
      let placeId = null;
      if (profile.businessUrl) {
        const match = profile.businessUrl.match(/place_id:([^&]+)/);
        if (match && match[1]) {
          placeId = match[1];
        }
      }
      
      // Format data for google_business_listings table
      const listingData = {
        client_id: clientId,
        title: profile.businessName || 'Sin nombre',
        address: profile.businessAddress || '',
        phone: profile.businessPhone || '',
        rating: profile.businessRating || null,
        reviews: profile.businessReviewsCount || 0,
        hours: typeof profile.businessHours === 'object' ? 
          JSON.stringify(profile.businessHours) : (profile.businessHours || ''),
        website: profile.businessWebsite || '',
        place_id: placeId,
        updated_at: new Date().toISOString() // Explicitly set updated_at
      };
      
      // First check if we already have a record for this client
      const { data: existingData, error: checkError } = await supabase
        .from('google_business_listings')
        .select('id')
        .eq('client_id', clientId)
        .order('updated_at', { ascending: false })
        .limit(1);
        
      if (checkError) {
        console.error('Error checking existing listings:', checkError);
        throw new Error(`Error checking existing listings: ${checkError.message}`);
      }
      
      let result;
      
      // Update if exists, insert if not
      if (existingData && existingData.length > 0) {
        console.log('Updating existing business listing record:', existingData[0].id);
        result = await supabase
          .from('google_business_listings')
          .update(listingData)
          .eq('id', existingData[0].id)
          .select();
      } else {
        console.log('Inserting new business listing record');
        result = await supabase
          .from('google_business_listings')
          .insert(listingData)
          .select();
      }
      
      if (result.error) {
        throw new Error(`Error saving to business listings: ${result.error.message}`);
      }
      
      console.log('Saved to google_business_listings:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error in saveToBusinessListings:', error);
      throw error;
    }
  };
  
  const saveToReport = async (clientId: string, profile: Partial<BusinessProfile>): Promise<boolean> => {
    try {
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('id')
        .eq('client_id', clientId)
        .order('date', { ascending: false })
        .limit(1);

      if (reportsError) {
        console.error('Error fetching latest report:', reportsError);
        throw new Error(`Error fetching latest report: ${reportsError.message}`);
      }

      if (!reports || reports.length === 0) {
        throw new Error('No hay informes disponibles para guardar el perfil');
      }

      const latestReportId = reports[0].id;
      
      // Ensure all required fields have fallback values
      const profileToSave = {
        businessUrl: profile.businessUrl || '',
        businessName: profile.businessName || 'Sin nombre',
        businessAddress: profile.businessAddress || '',
        businessPhone: profile.businessPhone || '',
        businessCategory: profile.businessCategory || '',
        businessRating: profile.businessRating !== undefined ? profile.businessRating : null,
        businessReviewsCount: profile.businessReviewsCount || 0,
        businessWebsite: profile.businessWebsite || '',
        businessHours: profile.businessHours || {}
      };
      
      console.log('Saving business profile data to report:', profileToSave);
      
      // Save business profile and get success status
      const success = await saveBusinessProfile(latestReportId, profileToSave);
      
      if (success) {
        const { error: updateError } = await supabase
          .from('reports')
          .update({ 
            has_business_profile: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', latestReportId);
          
        if (updateError) {
          console.error('Error updating has_business_profile flag:', updateError);
        }
        
        return true;
      } else {
        throw new Error('Error al guardar el perfil de negocio en el informe');
      }
    } catch (error) {
      console.error('Error in saveToReport:', error);
      throw error;
    }
  };

  return { saveBusinessProfileData, isSaving };
};

export default useBusinessProfileSave;
