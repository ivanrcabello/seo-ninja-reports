
import { useState } from 'react';
import { BusinessProfile } from '@/types/report.types';
import { saveBusinessProfile } from '@/services/api/businessProfile/saveBusinessProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessProfileSave = (clientId?: string) => {
  const saveBusinessProfileData = async (displayProfile: Partial<BusinessProfile> | null) => {
    if (!clientId || !displayProfile) {
      console.error("Cannot save business profile: missing clientId or profile data");
      return;
    }

    try {
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('id')
        .eq('client_id', clientId)
        .order('date', { ascending: false })
        .limit(1);

      if (reportsError) {
        console.error('Error fetching latest report:', reportsError);
        return;
      }

      if (reports && reports.length > 0) {
        const latestReportId = reports[0].id;
        
        const profileToSave = {
          businessUrl: displayProfile.businessUrl || '',
          businessName: displayProfile.businessName,
          businessAddress: displayProfile.businessAddress,
          businessPhone: displayProfile.businessPhone,
          businessCategory: displayProfile.businessCategory,
          businessRating: displayProfile.businessRating,
          businessReviewsCount: displayProfile.businessReviewsCount,
          businessWebsite: displayProfile.businessWebsite,
          businessHours: displayProfile.businessHours || {}
        };
        
        const savedProfile = await saveBusinessProfile(latestReportId, profileToSave);
        
        if (savedProfile) {
          const { error: updateError } = await supabase
            .from('reports')
            .update({ has_business_profile: true })
            .eq('id', latestReportId);
            
          if (updateError) {
            console.error('Error updating has_business_profile flag:', updateError);
          }
          
          toast.success('Perfil de negocio guardado correctamente');
        } else {
          toast.error('Error al guardar el perfil de negocio');
        }
      } else {
        toast.error('No hay informes disponibles para guardar el perfil');
      }
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Error al guardar el perfil de negocio');
    }
  };

  return { saveBusinessProfileData };
};

export default useBusinessProfileSave;
