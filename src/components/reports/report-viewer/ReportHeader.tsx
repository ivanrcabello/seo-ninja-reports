
import React from 'react';
import { Report } from '@/types/report.types';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportHeaderProps {
  report: Report;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ report }) => {
  const { toast } = useToast();

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <>
      <CardTitle className="text-2xl font-bold">
        {report.title}
      </CardTitle>
      <div className="flex items-center space-x-2">
        <Badge className={getBadgeColor(report.status)}>
          {report.status}
        </Badge>
        <Link to={`/reports/${report.id}/edit`}>
          <Button variant="ghost" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleShareClick}>
          <Share2 className="mr-2 h-4 w-4" />
          Compartir
        </Button>
      </div>
    </>
  );
};

export default ReportHeader;
