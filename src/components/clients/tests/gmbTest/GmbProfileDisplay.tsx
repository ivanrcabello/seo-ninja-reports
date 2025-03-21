
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import { Info, CheckCircle, MapPin, Phone, Link2, Clock } from 'lucide-react';

interface GmbProfileDisplayProps {
  businessProfile: Partial<BusinessProfile> | null;
  isSimulated: boolean;
}

const GmbProfileDisplay: React.FC<GmbProfileDisplayProps> = ({ 
  businessProfile, 
  isSimulated 
}) => {
  // Render the business rating with a safe check to prevent toFixed() errors
  const renderBusinessRating = (rating: number | undefined) => {
    if (rating === undefined || rating === null) {
      return "N/A";
    }
    return rating.toFixed(1);
  };

  if (!businessProfile) return null;

  return (
    <div className={`mt-4 p-4 rounded-md ${isSimulated ? 'bg-amber-50 border border-amber-200' : 'bg-primary/5 border border-primary/10'}`}>
      <div className="flex items-start gap-3">
        {isSimulated ? (
          <Info className="h-5 w-5 text-amber-600 mt-0.5" />
        ) : (
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        )}
        <div className="w-full">
          <h4 className="font-medium">{isSimulated ? "Datos simulados" : "Información detectada"}</h4>
          <ul className="mt-2 space-y-2 text-sm divide-y divide-gray-100">
            {businessProfile.businessName && (
              <li className="pt-2 pb-1">
                <div className="font-medium">Nombre</div>
                <div>{businessProfile.businessName}</div>
              </li>
            )}
            {businessProfile.businessCategory && (
              <li className="pt-2 pb-1">
                <div className="font-medium">Categoría</div>
                <div>{businessProfile.businessCategory}</div>
              </li>
            )}
            {businessProfile.businessRating !== undefined && (
              <li className="pt-2 pb-1">
                <div className="font-medium">Valoración</div>
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                    {renderBusinessRating(businessProfile.businessRating)}
                  </div>
                  {businessProfile.businessReviewsCount !== undefined && (
                    <span className="text-muted-foreground">
                      {businessProfile.businessReviewsCount} reseñas
                    </span>
                  )}
                </div>
              </li>
            )}
            {businessProfile.businessAddress && (
              <li className="pt-2 pb-1">
                <div className="font-medium flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                  Dirección
                </div>
                <div>{businessProfile.businessAddress}</div>
              </li>
            )}
            {businessProfile.businessPhone && (
              <li className="pt-2 pb-1">
                <div className="font-medium flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                  Teléfono
                </div>
                <div>{businessProfile.businessPhone}</div>
              </li>
            )}
            {businessProfile.businessWebsite && (
              <li className="pt-2 pb-1">
                <div className="font-medium flex items-center">
                  <Link2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                  Sitio web
                </div>
                <div className="truncate">
                  <a 
                    href={businessProfile.businessWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    {businessProfile.businessWebsite.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </li>
            )}
            {businessProfile.businessHours && 
             typeof businessProfile.businessHours === 'object' && 
             Object.keys(businessProfile.businessHours).length > 0 && (
              <li className="pt-2 pb-1">
                <div className="font-medium flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                  Horario
                </div>
                <div className="text-xs space-y-1 mt-1">
                  {Object.entries(businessProfile.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </li>
            )}
          </ul>
          {isSimulated && (
            <p className="mt-3 text-xs text-amber-600">
              Estos son datos simulados. Para obtener datos reales, proporciona una URL directa al perfil de GMB.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GmbProfileDisplay;
