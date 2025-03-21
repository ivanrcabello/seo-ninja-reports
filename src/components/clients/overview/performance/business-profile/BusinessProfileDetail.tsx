
import React from 'react';
import { Star, MapPin, Phone, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessProfile } from '@/types/report.types';

interface BusinessProfileDetailProps {
  displayProfile: Partial<BusinessProfile> | null;
}

export const getRatingColor = (rating: number | null | undefined) => {
  if (!rating) return "text-muted-foreground";
  if (rating >= 4.5) return "text-green-500";
  if (rating >= 3.5) return "text-amber-500";
  return "text-red-500";
};

export const renderRating = (rating: number | null | undefined) => {
  if (rating === null || rating === undefined) {
    return "N/A";
  }
  return rating.toFixed(1);
};

const BusinessProfileDetail: React.FC<BusinessProfileDetailProps> = ({ 
  displayProfile 
}) => {
  if (!displayProfile) return null;
  
  return (
    <div className="space-y-4">
      {displayProfile.businessName && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Nombre</span>
          <span className="text-sm truncate max-w-[200px]">{displayProfile.businessName}</span>
        </div>
      )}
    
      {displayProfile.businessRating !== undefined && displayProfile.businessRating !== null && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Valoración</span>
          <span className={cn("flex items-center", getRatingColor(displayProfile.businessRating))}>
            {renderRating(displayProfile.businessRating)}
            <Star className="h-3.5 w-3.5 ml-1 fill-current" />
            <span className="text-xs text-muted-foreground ml-1">
              ({displayProfile.businessReviewsCount || 0})
            </span>
          </span>
        </div>
      )}
    
      {displayProfile.businessAddress && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" /> 
            Dirección
          </span>
          <span className="text-sm truncate max-w-[200px]">{displayProfile.businessAddress}</span>
        </div>
      )}
      
      {displayProfile.businessPhone && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center">
            <Phone className="h-3 w-3 mr-1 text-muted-foreground" /> 
            Teléfono
          </span>
          <span className="text-sm">{displayProfile.businessPhone}</span>
        </div>
      )}
      
      {displayProfile.businessWebsite && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center">
            <Link2 className="h-3 w-3 mr-1 text-muted-foreground" /> 
            Web
          </span>
          <a 
            href={displayProfile.businessWebsite} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-primary hover:underline truncate max-w-[200px]"
          >
            {displayProfile.businessWebsite.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}
    </div>
  );
};

export default BusinessProfileDetail;
