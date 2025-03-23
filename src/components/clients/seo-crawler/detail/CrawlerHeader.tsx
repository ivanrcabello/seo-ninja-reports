
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CrawlResult } from '@/services/seo-crawler';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface CrawlerHeaderProps {
  clientId: string;
  crawlResult: CrawlResult;
}

const CrawlerHeader: React.FC<CrawlerHeaderProps> = ({ clientId, crawlResult }) => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" /> Completado
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="h-3 w-3 mr-1 animate-spin" /> Procesando
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" /> Error
          </Badge>
        );
    }
  };
  
  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/clients/${clientId}`)}
        className="mr-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
      
      <h1 className="text-2xl font-bold">Análisis SEO Técnico</h1>
      
      <div className="ml-auto">
        {getStatusBadge(crawlResult.status)}
      </div>
    </div>
  );
};

export default CrawlerHeader;
