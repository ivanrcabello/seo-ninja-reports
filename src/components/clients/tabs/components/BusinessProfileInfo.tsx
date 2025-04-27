
import React from 'react';
import { MapPin, Phone, Globe, Star } from 'lucide-react';
import { BusinessProfile } from '@/types/report.types';

interface BusinessProfileInfoProps {
  businessProfile: Partial<BusinessProfile>;
}

const BusinessProfileInfo: React.FC<BusinessProfileInfoProps> = ({ businessProfile }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-lg">{businessProfile.businessName}</h3>
        {businessProfile.businessRating && (
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="font-medium">{businessProfile.businessRating}</span>
            <span className="text-muted-foreground ml-1">
              ({businessProfile.businessReviewsCount || 0} reseñas)
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-start gap-2">
        <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
        <span>{businessProfile.businessAddress || 'No disponible'}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <span>{businessProfile.businessPhone || 'No disponible'}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <a 
          href={businessProfile.businessWebsite} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {businessProfile.businessWebsite ? 
            businessProfile.businessWebsite.replace(/^https?:\/\//, '') : 
            'No disponible'}
        </a>
      </div>
    </div>
  );
};

export default BusinessProfileInfo;
