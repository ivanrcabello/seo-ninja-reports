
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlurredCard from '@/components/ui/BlurredCard';
import CrawlerHeader from './CrawlerHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileBarChart } from 'lucide-react';
import { toast } from 'sonner';

interface CrawlerDetailPageProps {
  clientId: string;
  crawlId: string;
  onBack?: () => void;
}

const CrawlerDetailPage: React.FC<CrawlerDetailPageProps> = ({ 
  clientId, 
  crawlId,
  onBack 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // We'll mock the crawl data for now - in a real implementation we'd fetch this
  const crawl = {
    id: crawlId,
    domain: 'example.com',
    url: 'https://example.com',
    status: 'completed',
    pages_crawled: 10,
    total_pages: 15,
    total_issues: 5
  };

  const handleGenerateReport = () => {
    // Navigate to the report generator with the crawl ID as a parameter
    navigate(`/clients/${clientId}/reports/create?crawlId=${crawlId}`);
  };

  return (
    <div className="container mx-auto px-4 pt-6 pb-16">
      <div className="mb-8">
        <CrawlerHeader 
          clientId={clientId} 
          crawlResult={crawl} 
          onBack={onBack || (() => navigate(`/clients/${clientId}`))} 
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-end mb-6">
        <Button 
          onClick={handleGenerateReport}
          className="ml-2"
        >
          <FileBarChart className="h-4 w-4 mr-2" />
          Generar Informe
        </Button>
      </div>

      <BlurredCard className="overflow-hidden">
        <div className="flex flex-col h-full">
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="pages">Páginas</TabsTrigger>
                <TabsTrigger value="issues">Problemas</TabsTrigger>
                <TabsTrigger value="links">Enlaces</TabsTrigger>
                <TabsTrigger value="headings">Encabezados</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="p-6 h-[calc(100vh-400px)]">
              {/* Tab content will be implemented here */}
              <div className="p-4">
                <h3 className="text-lg font-semibold">Contenido de {activeTab}</h3>
                <p className="text-muted-foreground">
                  El contenido para esta pestaña se está cargando...
                </p>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </BlurredCard>
    </div>
  );
};

export default CrawlerDetailPage;
