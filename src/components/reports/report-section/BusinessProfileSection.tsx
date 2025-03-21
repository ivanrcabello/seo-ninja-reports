
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessProfile } from '@/types/report.types';
import BusinessProfileTable from '../report-viewer/business-profile/BusinessProfileTable';

interface BusinessProfileSectionProps {
  businessProfile: BusinessProfile;
}

export const BusinessProfileSection: React.FC<BusinessProfileSectionProps> = ({
  businessProfile
}) => {
  if (!businessProfile) {
    return null;
  }

  return (
    <Card className="border shadow-sm bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Perfil de Negocio</CardTitle>
      </CardHeader>
      <CardContent>
        <BusinessProfileTable 
          businessProfile={businessProfile} 
          isLoading={false}
          reportContent={{}}
        />
      </CardContent>
    </Card>
  );
};

export default BusinessProfileSection;
