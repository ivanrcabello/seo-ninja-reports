
import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '@/types/report.types';
import BusinessProfileDetail from './business-profile/BusinessProfileDetail';
import BusinessProfileWarning from './business-profile/BusinessProfileWarning';
import BusinessProfileActions from './business-profile/BusinessProfileActions';
import BusinessProfileEmptyState from './business-profile/BusinessProfileEmptyState';
import useBusinessProfileSave from './business-profile/useBusinessProfileSave';

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
  
  useEffect(() => {
    if (businessProfile) {
      setDisplayProfile(businessProfile);
      console.log("Perfil de negocio actualizado en BusinessProfileCardContent:", businessProfile);
    }
  }, [businessProfile]);
  
  const hasData = Boolean(displayProfile?.businessName);
  const isSimulated = displayProfile?.businessName === 'Negocio de ejemplo' || 
                     displayProfile?.businessName?.includes('ejemplo');

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
      
      <BusinessProfileWarning isSimulated={Boolean(isSimulated)} />

      <BusinessProfileActions 
        onRefreshBusinessProfile={onRefreshBusinessProfile}
        isRefreshingBusinessProfile={isRefreshingBusinessProfile}
        saveBusinessProfileData={handleSaveBusinessProfile}
      />
    </div>
  );
};

export default BusinessProfileCardContent;
