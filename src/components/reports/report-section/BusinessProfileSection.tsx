
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import { Building, Clock, MapPin, Phone, Star, LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BusinessProfileTable from '../report-viewer/business-profile/BusinessProfileTable';

interface BusinessProfileSectionProps {
  businessProfile: BusinessProfile;
  view?: 'card' | 'full';
}

const BusinessProfileSection: React.FC<BusinessProfileSectionProps> = ({ 
  businessProfile,
  view = 'full'
}) => {
  if (!businessProfile) return null;
  
  if (view === 'card') {
    // Compact view shows summary info in a card
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            {businessProfile.businessName || "Perfil de Negocio"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {businessProfile.businessCategory && (
            <div className="text-sm">
              <span className="font-medium">Categoría:</span> {businessProfile.businessCategory}
            </div>
          )}
          
          {businessProfile.businessAddress && (
            <div className="flex items-start text-sm gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>{businessProfile.businessAddress}</span>
            </div>
          )}
          
          {businessProfile.businessPhone && (
            <div className="flex items-center text-sm gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{businessProfile.businessPhone}</span>
            </div>
          )}
          
          {businessProfile.businessRating && (
            <div className="flex items-center text-sm gap-2">
              <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
              <span>
                {businessProfile.businessRating.toFixed(1)} 
                {businessProfile.businessReviewsCount && (
                  <span className="text-muted-foreground text-xs ml-1">
                    ({businessProfile.businessReviewsCount} reseñas)
                  </span>
                )}
              </span>
            </div>
          )}
          
          {businessProfile.businessWebsite && (
            <div className="flex items-center text-sm gap-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <a 
                href={businessProfile.businessWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate max-w-[200px]"
              >
                {businessProfile.businessWebsite}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Full view shows all information in a detailed format
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            {businessProfile.businessName || "Perfil de Google Business"}
          </h2>
          {businessProfile.businessCategory && (
            <p className="text-muted-foreground mt-1">{businessProfile.businessCategory}</p>
          )}
        </div>
        
        {businessProfile.businessRating && (
          <div className="bg-primary/10 px-4 py-2 rounded-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
            <div>
              <span className="font-bold text-lg">{businessProfile.businessRating.toFixed(1)}</span>
              {businessProfile.businessReviewsCount && (
                <span className="text-muted-foreground text-sm ml-1">
                  ({businessProfile.businessReviewsCount} reseñas)
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <BusinessProfileTable businessProfile={businessProfile} />
    </div>
  );
};

export default BusinessProfileSection;
