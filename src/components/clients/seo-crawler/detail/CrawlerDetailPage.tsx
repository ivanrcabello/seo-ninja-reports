
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrawler } from '@/hooks/useCrawler';
import { ClientSidebar } from '@/components/clients/ClientSidebar';
import BlurredCard from '@/components/ui/BlurredCard';
import CrawlerHeader from './CrawlerHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrawlerTabContent } from './tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileBarChart, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  const { getCrawl, isLoading } = useCrawler();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const crawl = getCrawl(crawlId);

  const handleGenerateReport = () => {
    // Navigate to the report generator with the crawl ID as a parameter
    navigate(`/clients/${clientId}/reports/create?crawlId=${crawlId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!crawl) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Análisis no encontrado</h2>
          <p className="text-muted-foreground mb-4">
            No se ha encontrado el análisis solicitado.
          </p>
          <Button onClick={() => navigate(`/clients/${clientId}`)}>
            Volver a la lista de análisis
          </Button>
        </div>
      </div>
    );
  }

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
              <CrawlerTabContent 
                activeTab={activeTab} 
                crawl={crawl} 
                clientId={clientId} 
              />
            </ScrollArea>
          </Tabs>
        </div>
      </BlurredCard>
    </div>
  );
};

export default CrawlerDetailPage;
