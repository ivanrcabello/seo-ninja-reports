import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import Markdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { BusinessProfile } from '@/types/report.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, MapPin, Phone, Globe, Clock, Star } from 'lucide-react';

interface ContentTabProps {
  tabValue: string;
  content: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    recommendations: string;
    localSeo?: string;
    serviceProposal?: string;
    keywords?: string;
    businessProfile?: BusinessProfile;
  };
  keywords: Array<{
    keyword: string;
    searchVolume?: number;
    difficulty?: number;
  }>;
}

const ContentTab: React.FC<ContentTabProps> = ({ tabValue, content, keywords }) => {
  const renderBusinessProfile = (profile?: BusinessProfile) => {
    if (!profile) return null;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{profile.businessName || 'Negocio'}</h2>
          {profile.businessWebsite && (
            <a 
              href={profile.businessWebsite.startsWith('http') ? profile.businessWebsite : `https://${profile.businessWebsite}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile.businessWebsite}
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Dirección
              </h3>
              <p>{profile.businessAddress || 'No disponible'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Teléfono
              </h3>
              <p>{profile.businessPhone || 'No disponible'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                Categoría
              </h3>
              <p>{profile.businessCategory || 'No disponible'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Valoración
              </h3>
              <div className="flex items-center gap-2">
                <div>
                  {profile.businessRating ? `${profile.businessRating}/5` : 'No disponible'} 
                  {profile.businessReviewsCount ? ` (${profile.businessReviewsCount} reseñas)` : ''}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {profile.businessHours && Object.keys(profile.businessHours).length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Horario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(profile.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}:</span>
                    <span>{hours || 'Cerrado'}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
  
  const renderKeywords = () => {
    if (keywords.length === 0) {
      return (
        <Markdown className="prose dark:prose-invert max-w-none">
          {content.keywords || ''}
        </Markdown>
      );
    }
    
    return (
      <div className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Palabra clave</TableHead>
              <TableHead className="text-right">Volumen de búsquedas</TableHead>
              <TableHead className="text-right">Dificultad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{keyword.keyword}</TableCell>
                <TableCell className="text-right">{keyword.searchVolume !== undefined ? keyword.searchVolume : 'N/A'}</TableCell>
                <TableCell className="text-right">{keyword.difficulty !== undefined ? keyword.difficulty : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Notas sobre palabras clave</h3>
          <Markdown className="prose dark:prose-invert max-w-none">
            {content.keywords || ''}
          </Markdown>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <TabsContent value="executive-summary" className="prose dark:prose-invert max-w-none">
        <Markdown>{content.executiveSummary || ''}</Markdown>
      </TabsContent>
      
      <TabsContent value="technical" className="prose dark:prose-invert max-w-none">
        <Markdown>{content.technicalAnalysis || ''}</Markdown>
      </TabsContent>
      
      <TabsContent value="content" className="prose dark:prose-invert max-w-none">
        <Markdown>{content.contentAnalysis || ''}</Markdown>
      </TabsContent>
      
      <TabsContent value="backlinks" className="prose dark:prose-invert max-w-none">
        <Markdown>{content.backlinksAnalysis || ''}</Markdown>
      </TabsContent>
      
      <TabsContent value="recommendations" className="prose dark:prose-invert max-w-none">
        <Markdown>{content.recommendations || ''}</Markdown>
      </TabsContent>
      
      <TabsContent value="local-seo" className="prose dark:prose-invert max-w-none">
        <Markdown>{content.localSeo || ''}</Markdown>
      </TabsContent>
      
      <TabsContent value="proposal" className="prose dark:prose-invert max-w-none">
        <Markdown>{content.serviceProposal || ''}</Markdown>
      </TabsContent>
      
      <TabsContent value="keywords">
        {renderKeywords()}
      </TabsContent>
      
      <TabsContent value="business-profile">
        {renderBusinessProfile(content.businessProfile)}
      </TabsContent>
    </>
  );
};

export default ContentTab;
