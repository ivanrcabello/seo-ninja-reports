
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientDocuments from './documents/ClientDocuments';

interface ClientDocumentsListProps {
  clientId: string;
}

const ClientDocumentsList: React.FC<ClientDocumentsListProps> = ({ clientId }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Documentos
        </h2>
      </div>

      <ClientDocuments clientId={clientId} />
    </div>
  );
};

export default ClientDocumentsList;
