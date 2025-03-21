
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

    setIsSaving(true);

    try {
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('id')
        .eq('client_id', clientId)
        .order('date', { ascending: false })
        .limit(1);

      if (reportsError) {
        console.error('Error fetching latest report:', reportsError);
        toast.error('Error al obtener el informe más reciente');
        return;
      }

      if (!reports || reports.length === 0) {
        toast.error('No hay informes disponibles para guardar el perfil');
        return;
      }

      const latestReportId = reports[0].id;
      
      // Ensure all required fields have fallback values
      const profileToSave = {
        businessUrl: displayProfile.businessUrl || '',
        businessName: displayProfile.businessName || 'Sin nombre',
        businessAddress: displayProfile.businessAddress || '',
        businessPhone: displayProfile.businessPhone || '',
        businessCategory: displayProfile.businessCategory || '',
        businessRating: displayProfile.businessRating !== undefined ? displayProfile.businessRating : null,
        businessReviewsCount: displayProfile.businessReviewsCount || 0,
        businessWebsite: displayProfile.businessWebsite || '',
        businessHours: displayProfile.businessHours || {}
      };
      
      console.log('Saving business profile data:', profileToSave);
      
      const savedProfile = await saveBusinessProfile(latestReportId, profileToSave);
      
      if (savedProfile) {
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
        
        toast.success('Perfil de negocio guardado correctamente');
        
        // Store last saved profile in localStorage for backup
        try {
          localStorage.setItem('last_saved_business_profile', JSON.stringify({
            profile: profileToSave,
            reportId: latestReportId,
            timestamp: new Date().toISOString()
          }));
        } catch (e) {
          console.warn('Could not store profile backup in localStorage:', e);
        }
      } else {
        toast.error('Error al guardar el perfil de negocio');
      }
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Error al guardar el perfil de negocio');
    } finally {
      setIsSaving(false);
    }
  };

  return { saveBusinessProfileData, isSaving };
};

export default useBusinessProfileSave;
