
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import BlurredCard from '@/components/ui/BlurredCard';
import { formatReportContent } from '@/utils/reportUtils';
import { LucideIcon } from 'lucide-react';
import RecommendationsList from '@/components/reports/report-section/RecommendationsList';
import { BusinessProfile } from '@/types/report.types';

interface ContentTabProps {
  value: string;
  title: string;
  content: string;
  icon: LucideIcon;
  iconColor: string;
  isRecommendations?: boolean;
  isBusinessProfile?: boolean;
  businessProfile?: BusinessProfile;
}

const ContentTab: React.FC<ContentTabProps> = ({ 
  value, 
  title, 
  content, 
  icon: Icon, 
  iconColor, 
  isRecommendations = false,
  isBusinessProfile = false,
  businessProfile
}) => {
  return (
    <TabsContent value={value}>
      <BlurredCard className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </h2>
        
        {isRecommendations ? (
          <RecommendationsList content={content} />
        ) : isBusinessProfile && businessProfile ? (
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
                    className="font-medium text-primary hover:underline"
                  >
                    {businessProfile.businessWebsite}
                  </a>
                </div>
              )}
            </div>
            
            {content && (
              <div 
                className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold mt-6"
                dangerouslySetInnerHTML={{ __html: formatReportContent(content) }}
              />
            )}
          </div>
        ) : (
          <div 
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: formatReportContent(content) }}
          />
        )}
      </BlurredCard>
    </TabsContent>
  );
};

export default ContentTab;
