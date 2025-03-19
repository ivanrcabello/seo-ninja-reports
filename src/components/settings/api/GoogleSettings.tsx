
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface GoogleSettingsProps {
  googleApiKey: string;
  setGoogleApiKey: (key: string) => void;
  hasConfiguredGoogleKey: boolean;
}

const GoogleSettings: React.FC<GoogleSettingsProps> = ({
  googleApiKey,
  setGoogleApiKey,
  hasConfiguredGoogleKey,
}) => {
  return (
    <div className="space-y-6">
      {!hasConfiguredGoogleKey && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No has configurado una API key de Google. Debes configurar una API key válida para utilizar la funcionalidad de análisis con PageSpeed Insights.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="googleApiKey">API Key de Google</Label>
        <Input
          id="googleApiKey"
          type="password"
          value={googleApiKey}
          onChange={(e) => setGoogleApiKey(e.target.value)}
          className="glass-input"
          placeholder="AIza..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Tu clave API de Google para analizar sitios web con PageSpeed Insights. Obtén una clave en <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
        </p>
      </div>
    </div>
  );
};

export default GoogleSettings;
