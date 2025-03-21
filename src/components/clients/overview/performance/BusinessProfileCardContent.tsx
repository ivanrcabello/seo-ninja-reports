
import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '@/types/report.types';
import BusinessProfileDetail from './business-profile/BusinessProfileDetail';
import BusinessProfileWarning from './business-profile/BusinessProfileWarning';
import BusinessProfileActions from './business-profile/BusinessProfileActions';
import BusinessProfileEmptyState from './business-profile/BusinessProfileEmptyState';
import useBusinessProfileSave from './business-profile/useBusinessProfileSave';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BusinessProfileCardContentProps {
  businessProfile: Partial<BusinessProfile> | null;
  isRefreshingBusinessProfile: boolean;
  onRefreshBusinessProfile: () => void;
  clientName?: string;
  clientLocation?: string;
  clientId?: string;
}

const BusinessProfileCardContent: React.FC<BusinessProfileCardContentProps> = ({
  businessProfile,
  isRefreshingBusinessProfile,
  onRefreshBusinessProfile,
  clientName,
  clientLocation,
  clientId
}) => {
  const [displayProfile, setDisplayProfile] = useState<Partial<BusinessProfile> | null>(null);
  const { saveBusinessProfileData } = useBusinessProfileSave(clientId);
  
  // Fetch the latest google business listing from the database
  useEffect(() => {
    if (clientId) {
      fetchLatestBusinessListing(clientId);
    }
  }, [clientId]);
  
  useEffect(() => {
    if (businessProfile) {
      setDisplayProfile(businessProfile);
      console.log("Perfil de negocio actualizado en BusinessProfileCardContent:", businessProfile);
    }
  }, [businessProfile]);
  
  const fetchLatestBusinessListing = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('google_business_listings')
        .select('*')
        .eq('client_id', clientId)
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching business listing:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Convert the database record to BusinessProfile format
        const listing = data[0];
        const profile: Partial<BusinessProfile> = {
          businessName: listing.title,
          businessAddress: listing.address,
          businessPhone: listing.phone,
          businessRating: listing.rating,
          businessReviewsCount: listing.reviews,
          businessHours: listing.hours ? { "Hours": listing.hours } : {},
          businessWebsite: listing.website,
          businessUrl: `https://www.google.com/maps/place/?q=place_id:${listing.place_id}`
        };
        
        setDisplayProfile(profile);
        console.log("Loaded business profile from database:", profile);
      }
    } catch (error) {
      console.error('Error in fetchLatestBusinessListing:', error);
    }
  };
  
  const hasData = Boolean(displayProfile?.businessName);
  const isSimulated = displayProfile?.businessName === 'Negocio de ejemplo' || 
                     displayProfile?.businessName?.includes('ejemplo');

  // Check for missing important fields
  const getMissingFields = () => {
    if (!displayProfile) return [];
    
    const missingFields = [];
    if (!displayProfile.businessRating) missingFields.push('Valoración');
    if (!displayProfile.businessAddress) missingFields.push('Dirección');
    if (!displayProfile.businessPhone) missingFields.push('Teléfono');
    if (!displayProfile.businessWebsite) missingFields.push('Sitio web');
    
    return missingFields;
  };

  const handleSaveBusinessProfile = () => {
    saveBusinessProfileData(displayProfile);
  };

  if (!hasData) {
    return (
      <BusinessProfileEmptyState
        onRefreshBusinessProfile={onRefreshBusinessProfile}
        isRefreshingBusinessProfile={isRefreshingBusinessProfile}
      />
    );
  }

  return (
    <div className="space-y-4">
      <BusinessProfileDetail displayProfile={displayProfile} />
      
      <BusinessProfileWarning 
        isSimulated={Boolean(isSimulated)} 
        missingFields={!isSimulated ? getMissingFields() : []}
      />

      <BusinessProfileActions 
        onRefreshBusinessProfile={onRefreshBusinessProfile}
        isRefreshingBusinessProfile={isRefreshingBusinessProfile}
        saveBusinessProfileData={handleSaveBusinessProfile}
      />
    </div>
  );
};

export default BusinessProfileCardContent;
