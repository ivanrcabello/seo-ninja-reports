
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
  
  // Update display profile when businessProfile prop changes
  useEffect(() => {
    if (businessProfile && !isSimulatedData(businessProfile)) {
      // Only update from props if it's not simulated data
      setDisplayProfile(businessProfile);
      console.log("Received non-simulated business profile from props:", businessProfile);
    }
  }, [businessProfile]);
  
  const isSimulatedData = (profile: Partial<BusinessProfile>) => {
    return profile?.businessName === 'Negocio de ejemplo' || 
           profile?.businessName?.includes('ejemplo');
  };
  
  const fetchLatestBusinessListing = async (clientId: string) => {
    try {
      console.log("Fetching latest business listing for client:", clientId);
      
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
      
      console.log("Fetched business listing data:", data);
      
      if (data && data.length > 0) {
        // Convert the database record to BusinessProfile format
        const listing = data[0];
        
        // Ensure the data is not simulated
        if (listing.title === 'Negocio de ejemplo' || listing.title?.includes('ejemplo')) {
          console.log("Skipping simulated data from database");
          return;
        }
        
        const profile: Partial<BusinessProfile> = {
          businessName: listing.title,
          businessAddress: listing.address,
          businessPhone: listing.phone,
          businessRating: listing.rating,
          businessReviewsCount: listing.reviews,
          businessHours: listing.hours ? { "Hours": listing.hours } : {},
          businessWebsite: listing.website,
          businessUrl: listing.place_id ? `https://www.google.com/maps/place/?q=place_id:${listing.place_id}` : undefined
        };
        
        setDisplayProfile(profile);
        console.log("Loaded real business profile from database:", profile);
      } else {
        console.log("No business listings found in database");
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

  // Handle refresh explicitly
  const handleRefresh = () => {
    onRefreshBusinessProfile();
    // Refetch from database after a short delay to allow data to be updated
    if (clientId) {
      setTimeout(() => {
        fetchLatestBusinessListing(clientId);
      }, 1000);
    }
  };

  if (!hasData) {
    return (
      <BusinessProfileEmptyState
        onRefreshBusinessProfile={handleRefresh}
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
        onRefreshBusinessProfile={handleRefresh}
        isRefreshingBusinessProfile={isRefreshingBusinessProfile}
        saveBusinessProfileData={handleSaveBusinessProfile}
      />
    </div>
  );
};

export default BusinessProfileCardContent;
