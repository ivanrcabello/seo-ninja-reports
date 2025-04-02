
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SharedDocument {
  id: string;
  title: string;
  type: 'report' | 'proposal' | 'contract' | 'invoice';
  status: string;
  date: string;
  shared_url: string;
}

interface SharedDocumentListProps {
  documents: SharedDocument[];
  type: 'report' | 'proposal' | 'contract' | 'invoice';
  emptyMessage?: string;
}

const SharedDocumentList: React.FC<SharedDocumentListProps> = ({
  documents,
  type,
  emptyMessage = 'No hay documentos disponibles en este momento.'
}) => {
  const getShareUrl = (doc: SharedDocument) => {
    const baseUrl = window.location.origin;
    
    if (doc.type === 'report') {
      return `${baseUrl}/shared/reports/${doc.shared_url}`;
    } else if (doc.type === 'proposal') {
      return `${baseUrl}/shared/proposals/${doc.shared_url}`;
    } else if (doc.type === 'contract') {
      return `${baseUrl}/shared/contracts/${doc.shared_url}`;
    } else if (doc.type === 'invoice') {
      return `${baseUrl}/shared/invoices/${doc.shared_url}`;
    }
    
    return '#';
  };

  const renderStatusBadge = (doc: SharedDocument) => {
    let color = 'bg-gray-100 text-gray-800';
    let label = doc.status;

    if (type === 'invoice') {
      if (doc.status === 'paid') {
        color = 'bg-green-100 text-green-800';
        label = 'Pagada';
      } else if (doc.status === 'pending') {
        color = 'bg-yellow-100 text-yellow-800';
        label = 'Pendiente';
      } else if (doc.status === 'overdue') {
        color = 'bg-red-100 text-red-800';
        label = 'Vencida';
      } else if (doc.status === 'cancelled') {
        color = 'bg-gray-100 text-gray-800';
        label = 'Cancelada';
      }
    } else if (type === 'proposal') {
      if (doc.status === 'accepted') {
        color = 'bg-green-100 text-green-800';
        label = 'Aceptada';
      } else if (doc.status === 'sent') {
        color = 'bg-blue-100 text-blue-800';
        label = 'Enviada';
      } else if (doc.status === 'rejected') {
        color = 'bg-red-100 text-red-800';
        label = 'Rechazada';
      } else if (doc.status === 'draft') {
        color = 'bg-gray-100 text-gray-800';
        label = 'Borrador';
      }
    } else if (type === 'contract') {
      if (doc.status === 'signed') {
        color = 'bg-green-100 text-green-800';
        label = 'Firmado';
      } else if (doc.status === 'sent') {
        color = 'bg-blue-100 text-blue-800';
        label = 'Enviado';
      } else if (doc.status === 'draft') {
        color = 'bg-gray-100 text-gray-800';
        label = 'Borrador';
      } else if (doc.status === 'expired') {
        color = 'bg-red-100 text-red-800';
        label = 'Expirado';
      }
    }

    return (
      <Badge variant="outline" className={`${color} border-none`}>
        {label}
      </Badge>
    );
  };

  if (documents.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="divide-y">
      {documents.map(doc => (
        <div key={doc.id} className="py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{doc.title}</h3>
              {renderStatusBadge(doc)}
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(doc.date).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={getShareUrl(doc)} target="_blank" rel="noopener noreferrer">
              {type === 'report' ? 'Ver informe' :
               type === 'proposal' ? 'Ver propuesta' :
               type === 'contract' ? 'Ver contrato' :
               'Ver factura'}
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SharedDocumentList;
