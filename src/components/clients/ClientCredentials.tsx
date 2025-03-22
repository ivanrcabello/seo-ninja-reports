
import React, { useState } from 'react';
import { Client } from '@/types/client.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Globe, Server, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ClientCredentialsProps {
  client: Client;
}

const ClientCredentials: React.FC<ClientCredentialsProps> = ({ client }) => {
  const [showWpPassword, setShowWpPassword] = useState(false);
  const [showHostingPassword, setShowHostingPassword] = useState(false);
  
  const hasWpCredentials = client.wp_credentials && client.wp_credentials.username;
  const hasHostingCredentials = client.hosting_credentials && client.hosting_credentials.username;
  
  if (!hasWpCredentials && !hasHostingCredentials) {
    return null;
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Lock className="mr-2 h-5 w-5 text-primary" />
          Credenciales de acceso
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {hasWpCredentials && (
          <div className="bg-card/50 p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium flex items-center">
                <Globe className="mr-2 h-4 w-4 text-primary" />
                WordPress
              </h3>
            </div>
            <Separator className="my-2" />
            <div className="grid gap-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Usuario:</span>
                <span className="text-sm font-medium">{client.wp_credentials.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Contraseña:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {showWpPassword ? client.wp_credentials.password : '••••••••••'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setShowWpPassword(!showWpPassword)}
                  >
                    {showWpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {client.wp_credentials.url && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">URL:</span>
                  <a 
                    href={client.wp_credentials.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {client.wp_credentials.url}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        
        {hasHostingCredentials && (
          <div className="bg-card/50 p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium flex items-center">
                <Server className="mr-2 h-4 w-4 text-primary" />
                {client.hosting_credentials.provider || 'Hosting'}
              </h3>
            </div>
            <Separator className="my-2" />
            <div className="grid gap-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Usuario:</span>
                <span className="text-sm font-medium">{client.hosting_credentials.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Contraseña:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {showHostingPassword ? client.hosting_credentials.password : '••••••••••'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setShowHostingPassword(!showHostingPassword)}
                  >
                    {showHostingPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {client.hosting_credentials.url && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">URL:</span>
                  <a 
                    href={client.hosting_credentials.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {client.hosting_credentials.url}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientCredentials;
