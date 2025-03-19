
import React from 'react';
import { Report } from '@/types/report.types';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Share2, Calendar, Globe, FileText, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReportHeaderProps {
  report: Report;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ report }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">En Proceso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completado</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Fallido</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };
  
  const getPublicShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/shared/reports/${report.id}`;
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(getPublicShareLink());
    toast({
      title: "Enlace copiado",
      description: "El enlace de compartir ha sido copiado al portapapeles",
    });
  };

  // Handle edit button click - stay on the same page
  const handleEditClick = () => {
    // Navigate to the report page with a query parameter to indicate edit mode
    navigate(`/reports/${report.id}?mode=edit`);
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-2xl font-bold text-gradient-primary">
            {report.title}
          </CardTitle>
          {getStatusBadge(report.status)}
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(report.date), 'd MMM yyyy', { locale: es })}</span>
          </div>
          
          {report.url && (
            <a 
              href={report.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <Globe className="h-4 w-4" />
              <span>{report.url.replace(/^https?:\/\//, '').split('/')[0]}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 self-end md:self-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="group hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4 group-hover:text-primary-foreground" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="group hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={handleShareClick}
        >
          <Share2 className="h-4 w-4 group-hover:text-primary-foreground" />
          <span className="hidden sm:inline">Compartir</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="group hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <FileText className="h-4 w-4 group-hover:text-primary-foreground" />
          <span className="hidden sm:inline">PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default ReportHeader;
