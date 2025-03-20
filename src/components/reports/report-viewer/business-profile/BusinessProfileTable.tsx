
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
import { Star, MapPin, Phone, Globe, Clock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    
    const ratingClass = 
      rating >= 4.5 ? "text-green-500" :
      rating >= 3.5 ? "text-amber-500" :
      "text-red-500";
    
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={cn(
            "px-2 py-0.5 font-medium",
            rating >= 4.5 ? "bg-green-50 text-green-700 border-green-200" :
            rating >= 3.5 ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-red-50 text-red-700 border-red-200"
          )}
        >
          <span className="flex items-center">
            {rating.toFixed(1)} 
            <Star className="h-3.5 w-3.5 ml-1 fill-current" />
          </span>
        </Badge>
        {reviewsCount !== undefined && (
          <span className="text-muted-foreground text-sm">{reviewsCount} reseñas</span>
        )}
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
            <TableCell className="font-medium flex items-center">
              <Info className="h-4 w-4 mr-2 text-primary" />
              Nombre del negocio
            </TableCell>
            <TableCell>{businessProfile.businessName || 'No disponible'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Globe className="h-4 w-4 mr-2 text-primary" />
              Categoría
            </TableCell>
            <TableCell>
              {businessProfile.businessCategory ? (
                <Badge variant="outline" className="font-normal">
                  {businessProfile.businessCategory}
                </Badge>
              ) : 'No disponible'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              Dirección
            </TableCell>
            <TableCell>{businessProfile.businessAddress || 'No disponible'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              Teléfono
            </TableCell>
            <TableCell>{businessProfile.businessPhone || 'No disponible'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Globe className="h-4 w-4 mr-2 text-primary" />
              Sitio web
            </TableCell>
            <TableCell>
              {businessProfile.businessWebsite ? (
                <a 
                  href={businessProfile.businessWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  {businessProfile.businessWebsite}
                </a>
              ) : 'No disponible'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Star className="h-4 w-4 mr-2 text-primary" />
              Valoración
            </TableCell>
            <TableCell>
              {formatRating(businessProfile.businessRating, businessProfile.businessReviewsCount)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Globe className="h-4 w-4 mr-2 text-primary" />
              URL de Google Business
            </TableCell>
            <TableCell>
              {businessProfile.businessUrl ? (
                <a 
                  href={businessProfile.businessUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  {businessProfile.businessUrl}
                </a>
              ) : 'No disponible'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Horario
            </TableCell>
            <TableCell>{formatHours(businessProfile.businessHours)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default BusinessProfileTable;
