
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  website: string;
  phone_number?: string;
  industry?: string;
}

interface ClientInfoCardProps {
  client: Client | null;
  isLoading: boolean;
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({ client, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" /> Información de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" /> Información de la Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {client && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {client.name}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sitio Web</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {client.website}
                </div>
              </div>
              {client.phone_number && (
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {client.phone_number}
                  </div>
                </div>
              )}
              {client.industry && (
                <div className="space-y-2">
                  <Label>Industria</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {client.industry}
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Para actualizar esta información, contacta con nosotros.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientInfoCard;
