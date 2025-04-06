
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface CrawlStatusBadgeProps {
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'pending';
}

const CrawlStatusBadge: React.FC<CrawlStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Completado
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Procesando
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Fallido
        </Badge>
      );
    case 'queued':
    case 'pending': // Handle both queued and pending the same way
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          En cola
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default CrawlStatusBadge;
