
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Star } from 'lucide-react';

interface BusinessProfileTableProps {
  businessProfile: BusinessProfile;
}

const BusinessProfileTable: React.FC<BusinessProfileTableProps> = ({ businessProfile }) => {
  // Format business hours if available
  const formatHours = (hours: Record<string, string> | undefined) => {
    if (!hours || Object.keys(hours).length === 0) return 'No disponible';
    
    return (
      <div className="space-y-1">
        {Object.entries(hours).map(([day, time]) => (
          <div key={day} className="grid grid-cols-2 gap-2">
            <span className="font-medium">{day}:</span> 
            <span>{time}</span>
          </div>
        ))}
      </div>
    );
  };

  // Format rating with stars if available
  const formatRating = (rating: number | undefined, reviewsCount: number | undefined) => {
    if (!rating) return 'No disponible';
    
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center">
          {rating.toFixed(1)} 
          <Star className="h-4 w-4 text-yellow-500 ml-1 inline" fill="currentColor" />
        </span>
        {reviewsCount && <span className="text-muted-foreground text-xs">({reviewsCount} reseñas)</span>}
      </div>
    );
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Propiedad</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Nombre del negocio</TableCell>
            <TableCell>{businessProfile.businessName || 'No disponible'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Categoría</TableCell>
            <TableCell>{businessProfile.businessCategory || 'No disponible'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Dirección</TableCell>
            <TableCell>{businessProfile.businessAddress || 'No disponible'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Teléfono</TableCell>
            <TableCell>{businessProfile.businessPhone || 'No disponible'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Sitio web</TableCell>
            <TableCell>
              {businessProfile.businessWebsite ? (
                <a 
                  href={businessProfile.businessWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {businessProfile.businessWebsite}
                </a>
              ) : 'No disponible'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Valoración</TableCell>
            <TableCell>
              {formatRating(businessProfile.businessRating, businessProfile.businessReviewsCount)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">URL de Google Business</TableCell>
            <TableCell>
              {businessProfile.businessUrl ? (
                <a 
                  href={businessProfile.businessUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {businessProfile.businessUrl}
                </a>
              ) : 'No disponible'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Horario</TableCell>
            <TableCell>{formatHours(businessProfile.businessHours)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default BusinessProfileTable;
