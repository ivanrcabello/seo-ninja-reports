
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientDocuments from './documents/ClientDocuments';

interface ClientReportsListProps {
  clientId: string;
  onCreateReport?: () => void;
  showCreateButton?: boolean;
}

const ClientReportsList: React.FC<ClientReportsListProps> = ({ 
  clientId, 
  onCreateReport,
  showCreateButton = false
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Informes y Documentos
        </h2>
        {showCreateButton && onCreateReport && (
          <Button onClick={onCreateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Crear informe
          </Button>
        )}
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="reports">Informes</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <div className="text-center p-6">
            <p className="text-muted-foreground mb-4">
              La generación automática de informes ha sido desactivada.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <ClientDocuments clientId={clientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientReportsList;
