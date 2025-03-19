
import React from 'react';
import { ArrowLeft, Clock, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RetryReportButton from './RetryReportButton';

interface ReportDetailHeaderProps {
  title: string;
  date: string;
  url: string;
  status: 'processing' | 'completed' | 'failed';
  clientId: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  reportId: string;
}

const ReportDetailHeader: React.FC<ReportDetailHeaderProps> = ({
  title,
  date,
  url,
  status,
  clientId,
  isEditing,
  setIsEditing,
  reportId
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'processing':
        return (
          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Procesando
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completado
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <Link
          to={`/clients/${clientId}`}
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al cliente
        </Link>

        <div className="flex items-center gap-2">
          <RetryReportButton reportId={reportId} status={status} />
          
          {status === 'completed' && (
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Guardar cambios' : 'Editar informe'}
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center flex-wrap">
          <h1 className="text-2xl font-semibold text-primary">
            {title}
          </h1>
          {getStatusBadge()}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-sm text-muted-foreground">
          <span>{formatDate(date)}</span>
          <a
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary"
          >
            <ExternalLink className="h-3 w-3" />
            {url}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailHeader;
