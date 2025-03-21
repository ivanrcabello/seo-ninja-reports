
import React, { useState } from 'react';
import { BusinessProfile } from '@/types/report.types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Star, MapPin, Phone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BusinessProfileTableProps {
  businessProfile: BusinessProfile | null;
  isLoading: boolean;
  onSaveBusinessProfile?: (profile: Partial<BusinessProfile>) => Promise<void>;
  isSaving?: boolean;
  reportContent?: Record<string, any>;
}

const BusinessProfileTable: React.FC<BusinessProfileTableProps> = ({
  businessProfile,
  isLoading,
  onSaveBusinessProfile,
  isSaving = false,
  reportContent = {}
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<BusinessProfile>>({});

  // Initialize form data when business profile changes
  React.useEffect(() => {
    if (businessProfile) {
      setFormData({
        businessName: businessProfile.businessName,
        businessAddress: businessProfile.businessAddress,
        businessPhone: businessProfile.businessPhone,
        businessCategory: businessProfile.businessCategory,
        businessRating: businessProfile.businessRating,
        businessReviewsCount: businessProfile.businessReviewsCount,
        businessWebsite: businessProfile.businessWebsite,
        businessUrl: businessProfile.businessUrl,
        businessHours: businessProfile.businessHours
      });
    } else if (reportContent.businessProfile) {
      // Use data from report content if available
      setFormData(reportContent.businessProfile as Partial<BusinessProfile>);
    }
  }, [businessProfile, reportContent]);

  const handleSave = async () => {
    if (onSaveBusinessProfile) {
      await onSaveBusinessProfile(formData);
      setEditMode(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no business profile and no edit mode, show empty state
  if (!businessProfile && !editMode && !reportContent.businessProfile) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
        </div>
        <h3 className="text-lg font-medium mb-2">No hay datos de perfil de negocio</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          No se ha encontrado información del perfil de Google My Business para este informe.
        </p>
        {onSaveBusinessProfile && (
          <Button onClick={() => setEditMode(true)}>
            Añadir información de perfil
          </Button>
        )}
      </div>
    );
  }

  // Determine which data to show (from database or form data)
  const displayData = editMode ? formData : (businessProfile || formData);

  return (
    <div className="space-y-4">
      {onSaveBusinessProfile && (
        <div className="flex justify-end mb-4">
          {editMode ? (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setEditMode(false)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar perfil'
                )}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              Editar perfil
            </Button>
          )}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Campo</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Nombre</TableCell>
                <TableCell>{displayData.businessName || 'No disponible'}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Dirección</TableCell>
                <TableCell className="flex items-start gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{displayData.businessAddress || 'No disponible'}</span>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Categoría</TableCell>
                <TableCell>{displayData.businessCategory || 'No disponible'}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Valoración</TableCell>
                <TableCell>
                  {displayData.businessRating ? (
                    <div className="flex items-center">
                      <span className={cn(
                        displayData.businessRating >= 4.5 ? "text-yellow-500" : 
                        displayData.businessRating >= 3.5 ? "text-amber-500" : "text-red-500"
                      )}>
                        {displayData.businessRating.toFixed(1)}
                      </span>
                      <Star className="h-4 w-4 ml-1 fill-current text-yellow-500" />
                      <span className="text-muted-foreground ml-1">
                        ({displayData.businessReviewsCount || 0} reseñas)
                      </span>
                    </div>
                  ) : (
                    'No disponible'
                  )}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Teléfono</TableCell>
                <TableCell className="flex items-start gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{displayData.businessPhone || 'No disponible'}</span>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Sitio web</TableCell>
                <TableCell>
                  {displayData.businessWebsite ? (
                    <a 
                      href={displayData.businessWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      {displayData.businessWebsite.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground" />
                    </a>
                  ) : (
                    'No disponible'
                  )}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="font-medium">Enlace GMB</TableCell>
                <TableCell>
                  {displayData.businessUrl ? (
                    <a 
                      href={displayData.businessUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      Ver en Google Maps
                      <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground" />
                    </a>
                  ) : (
                    'No disponible'
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {onSaveBusinessProfile && !businessProfile && !editMode && (
        <div className="mt-6 text-center">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando perfil...
              </>
            ) : (
              'Guardar perfil para el informe'
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Guarda esta información en el informe para poder consultarla posteriormente.
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessProfileTable;
