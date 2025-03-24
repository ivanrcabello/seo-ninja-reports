
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

interface ValueSerpSettingsProps {
  valueSerpApiKey: string;
  setValueSerpApiKey: (key: string) => void;
  hasConfiguredValueSerpKey: boolean;
  brightDataUsername: string;
  setBrightDataUsername: (username: string) => void;
  brightDataPassword: string;
  setBrightDataPassword: (password: string) => void;
}

const ValueSerpSettings: React.FC<ValueSerpSettingsProps> = ({
  valueSerpApiKey,
  setValueSerpApiKey,
  hasConfiguredValueSerpKey,
  brightDataUsername,
  setBrightDataUsername,
  brightDataPassword,
  setBrightDataPassword,
}) => {
  return (
    <div className="space-y-6">
      {!hasConfiguredValueSerpKey && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No has configurado una API key de Value SERP. Esta API es útil para obtener información mejorada sobre perfiles de negocios para el análisis SEO.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="bg-background/50 border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Value SERP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="valueSerpApiKey">API Key de Value SERP</Label>
            <Input
              id="valueSerpApiKey"
              type="password"
              value={valueSerpApiKey}
              onChange={(e) => setValueSerpApiKey(e.target.value)}
              className="glass-input"
              placeholder="vsrp_..."
            />
            <p className="text-xs text-muted-foreground">
              Tu clave API de Value SERP para análisis de perfiles de negocio. Obtén una clave en <a href="https://www.valueserp.com/signup" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">valueserp.com</a>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background/50 border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Configuración de Bright Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brightDataUsername">Usuario de Bright Data (zone)</Label>
            <Input
              id="brightDataUsername"
              type="text"
              value={brightDataUsername}
              onChange={(e) => setBrightDataUsername(e.target.value)}
              className="glass-input"
              placeholder="brd-customer-hl_cbc2d791-zone-web_unlocker1"
            />
            <p className="text-xs text-muted-foreground">
              Tu nombre de usuario de Bright Data para el Web Unlocker. Por defecto: brd-customer-hl_cbc2d791-zone-web_unlocker1
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brightDataPassword">Contraseña de Bright Data</Label>
            <Input
              id="brightDataPassword"
              type="password"
              value={brightDataPassword}
              onChange={(e) => setBrightDataPassword(e.target.value)}
              className="glass-input"
              placeholder="Contraseña de Bright Data"
            />
            <p className="text-xs text-muted-foreground">
              Tu contraseña de Bright Data para el Web Unlocker. Por defecto: 5d024usr515b
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueSerpSettings;
