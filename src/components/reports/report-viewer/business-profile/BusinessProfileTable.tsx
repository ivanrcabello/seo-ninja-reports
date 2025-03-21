
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, MapPin, Phone, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BusinessProfileTableProps {
  businessProfile: BusinessProfile | null | undefined;
  isLoading: boolean;
  onSaveBusinessProfile?: (profile: Partial<BusinessProfile>) => Promise<void>;
  isSaving?: boolean;
  reportContent?: any;
}

const BusinessProfileTable: React.FC<BusinessProfileTableProps> = ({ 
  businessProfile, 
  isLoading,
  onSaveBusinessProfile,
  isSaving = false,
  reportContent
}) => {
  const reportHasBusinessProfile = reportContent?.businessProfile;

  const handleSave = () => {
    if (businessProfile && onSaveBusinessProfile) {
      onSaveBusinessProfile(businessProfile);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!businessProfile && !reportHasBusinessProfile) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-3">No hay datos de perfil de negocio</h3>
        <p className="text-muted-foreground mb-4">
          Este informe no contiene información de perfil de Google My Business.
        </p>
      </div>
    );
  }

  // Use businessProfile from the API or fallback to the content in the report
  const profile = businessProfile || reportHasBusinessProfile;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-amber-500";
    return "text-red-500";
  };

  // Check if we need to show the save button
  // Show if we have fresh data from API and a save function
  const showSaveButton = businessProfile && onSaveBusinessProfile && !isSaving;

  // Show update button if we have content in the report but newer data is available
  const showUpdateButton = businessProfile && reportHasBusinessProfile && onSaveBusinessProfile && 
                          JSON.stringify(businessProfile) !== JSON.stringify(reportHasBusinessProfile);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Información del perfil de negocio</h3>
        <p className="text-muted-foreground mb-4">
          Detalles actuales del perfil de Google My Business.
        </p>
      </div>

      {showUpdateButton && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="flex justify-between items-center">
            <span>Hay datos actualizados disponibles para este perfil</span>
            <Button 
              onClick={handleSave} 
              size="sm" 
              disabled={isSaving}
            >
              {isSaving ? 'Actualizando...' : 'Actualizar perfil'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Campo</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profile?.businessName && (
            <TableRow>
              <TableCell className="font-medium">Nombre</TableCell>
              <TableCell>{profile.businessName}</TableCell>
            </TableRow>
          )}
          
          {profile?.businessRating !== undefined && (
            <TableRow>
              <TableCell className="font-medium">Valoración</TableCell>
              <TableCell>
                <span className={cn("flex items-center", getRatingColor(profile.businessRating))}>
                  {profile.businessRating.toFixed(1)}
                  <Star className="h-4 w-4 ml-1 fill-current" />
                  <span className="text-sm text-muted-foreground ml-1">
                    ({profile.businessReviewsCount || 0} reseñas)
                  </span>
                </span>
              </TableCell>
            </TableRow>
          )}
          
          {profile?.businessCategory && (
            <TableRow>
              <TableCell className="font-medium">Categoría</TableCell>
              <TableCell>{profile.businessCategory}</TableCell>
            </TableRow>
          )}
          
          {profile?.businessAddress && (
            <TableRow>
              <TableCell className="font-medium">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" /> 
                  Dirección
                </span>
              </TableCell>
              <TableCell>{profile.businessAddress}</TableCell>
            </TableRow>
          )}
          
          {profile?.businessPhone && (
            <TableRow>
              <TableCell className="font-medium">
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-muted-foreground" /> 
                  Teléfono
                </span>
              </TableCell>
              <TableCell>{profile.businessPhone}</TableCell>
            </TableRow>
          )}
          
          {profile?.businessWebsite && (
            <TableRow>
              <TableCell className="font-medium">
                <span className="flex items-center">
                  <Link2 className="h-4 w-4 mr-1 text-muted-foreground" /> 
                  Sitio web
                </span>
              </TableCell>
              <TableCell>
                <a 
                  href={profile.businessWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  {profile.businessWebsite}
                </a>
              </TableCell>
            </TableRow>
          )}
          
          {profile?.businessUrl && (
            <TableRow>
              <TableCell className="font-medium">GMB URL</TableCell>
              <TableCell>
                <a 
                  href={profile.businessUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  Ver en Google Maps
                </a>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {profile?.businessHours && Object.keys(profile.businessHours).length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-3">Horario de apertura</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Día</TableHead>
                <TableHead>Horario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(profile.businessHours).map(([day, hours]) => (
                <TableRow key={day}>
                  <TableCell className="font-medium">{day}</TableCell>
                  <TableCell>{hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {showSaveButton && !showUpdateButton && (
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar en informe'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BusinessProfileTable;
