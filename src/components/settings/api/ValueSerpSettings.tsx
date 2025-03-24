
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ValueSerpSettingsProps {
  valueSerpApiKey: string;
  setValueSerpApiKey: (key: string) => void;
  hasConfiguredValueSerpKey: boolean;
}

const ValueSerpSettings: React.FC<ValueSerpSettingsProps> = ({
  valueSerpApiKey,
  setValueSerpApiKey,
  hasConfiguredValueSerpKey,
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
      
      <div className="space-y-2">
        <Label htmlFor="valueSerpApiKey">API Key de Value SERP</Label>
        <Input
          id="valueSerpApiKey"
          type="password"
          value={valueSerpApiKey}
          onChange={(e) => setValueSerpApiKey(e.target.value)}
          className="glass-input"
          placeholder="vsrp_..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Tu clave API de Value SERP para análisis de perfiles de negocio. Obtén una clave en <a href="https://www.valueserp.com/signup" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">valueserp.com</a>
        </p>
      </div>
    </div>
  );
};

export default ValueSerpSettings;
