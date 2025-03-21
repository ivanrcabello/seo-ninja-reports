
import React from 'react';
import ReportSection from '../report-section/ReportSection';
import { BusinessProfile } from '@/types/report.types';

interface LocalSEOTabProps {
  content: string;
  isEditing?: boolean;
  onSave?: (content: string) => Promise<void>;
  businessProfile?: BusinessProfile;
}

const LocalSEOTab: React.FC<LocalSEOTabProps> = ({ 
  content, 
  isEditing = false,
  onSave,
  businessProfile
}) => {
  return (
    <div className="space-y-6">
      <ReportSection 
        title="SEO Local" 
        content={content} 
        sectionKey="localSEO"
        isEditing={isEditing}
        onEdit={onSave}
      />
      
      {businessProfile && (
        <div className="mt-6 bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Perfil de Negocio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessProfile.businessName && (
              <div>
                <span className="font-medium">Nombre:</span> {businessProfile.businessName}
              </div>
            )}
            {businessProfile.businessAddress && (
              <div>
                <span className="font-medium">Dirección:</span> {businessProfile.businessAddress}
              </div>
            )}
            {businessProfile.businessPhone && (
              <div>
                <span className="font-medium">Teléfono:</span> {businessProfile.businessPhone}
              </div>
            )}
            {businessProfile.businessCategory && (
              <div>
                <span className="font-medium">Categoría:</span> {businessProfile.businessCategory}
              </div>
            )}
            {businessProfile.businessRating !== undefined && (
              <div>
                <span className="font-medium">Valoración:</span> {businessProfile.businessRating}/5
              </div>
            )}
            {businessProfile.businessReviewsCount !== undefined && (
              <div>
                <span className="font-medium">Número de reseñas:</span> {businessProfile.businessReviewsCount}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalSEOTab;
