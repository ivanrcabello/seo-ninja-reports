
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PenLine, ExternalLink } from 'lucide-react';
import BlurredCard from '../../ui/BlurredCard';
import AnimatedContainer from '../../ui/AnimatedContainer';
import SectionIcon from './SectionIcon';
import { BusinessProfile } from '@/types/report.types';

interface BusinessProfileSectionProps {
  title: string;
  businessProfile: BusinessProfile;
  onEdit?: (section: string, content: string) => void;
  isEditing?: boolean;
  delay?: number;
}

const BusinessProfileSection: React.FC<BusinessProfileSectionProps> = ({
  title,
  businessProfile,
  onEdit,
  isEditing = false,
  delay = 0,
}) => {
  if (!businessProfile || !businessProfile.businessUrl) {
    return (
      <AnimatedContainer animation="fade" delay={delay} className="mt-4">
        <BlurredCard className="p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No hay información de GMB disponible</h3>
          <p className="text-muted-foreground">No se ha configurado un perfil de Google My Business para este informe.</p>
        </BlurredCard>
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer animation="fade" delay={delay} className="mt-4">
      <BlurredCard className="glass-card bg-gradient-to-br from-background/90 via-background/80 to-background/70">
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <SectionIcon sectionKey="businessProfile" />
            {title}
          </CardTitle>
          {isEditing && onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => onEdit('businessProfile', JSON.stringify(businessProfile))}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </CardHeader>
        <Separator className="bg-primary/10" />
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessProfile.businessName && (
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{businessProfile.businessName}</p>
                </div>
              )}
              
              {businessProfile.businessAddress && (
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-medium">{businessProfile.businessAddress}</p>
                </div>
              )}
              
              {businessProfile.businessPhone && (
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{businessProfile.businessPhone}</p>
                </div>
              )}
              
              {businessProfile.businessCategory && (
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-medium">{businessProfile.businessCategory}</p>
                </div>
              )}
              
              {businessProfile.businessRating !== undefined && (
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Valoración</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{businessProfile.businessRating}/5</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(businessProfile.businessRating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {businessProfile.businessReviewsCount && (
                      <span className="text-sm text-muted-foreground">
                        ({businessProfile.businessReviewsCount} reseñas)
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {businessProfile.businessWebsite && (
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Sitio web</p>
                  <a 
                    href={businessProfile.businessWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {businessProfile.businessWebsite}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
            
            <div className="mt-4 bg-primary/5 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">URL de Google My Business</p>
              <a 
                href={businessProfile.businessUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline flex items-center gap-1"
              >
                {businessProfile.businessUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            {businessProfile.businessHours && Object.keys(businessProfile.businessHours).length > 0 && (
              <div className="mt-4 bg-primary/5 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Horario</p>
                <ul className="space-y-1">
                  {Object.entries(businessProfile.businessHours).map(([day, hours]) => (
                    <li key={day} className="flex justify-between text-sm">
                      <span className="font-medium">{day}</span>
                      <span>{hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default BusinessProfileSection;
