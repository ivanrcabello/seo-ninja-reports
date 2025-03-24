
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GoogleSettingsProps {
  googleApiKey: string;
  setGoogleKey: (key: string) => void;
  hasConfiguredGoogle: boolean;
}

const GoogleSettings: React.FC<GoogleSettingsProps> = ({
  googleApiKey,
  setGoogleKey,
  hasConfiguredGoogle,
}) => {
  return (
    <div className="space-y-6">
      {!hasConfiguredGoogle && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No has configurado una API key de Google. Debes configurar una API key válida para utilizar la funcionalidad de análisis con PageSpeed Insights.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="bg-background/50 border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Google API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="googleApiKey">API Key de Google</Label>
            <Input
              id="googleApiKey"
              type="password"
              value={googleApiKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              className="glass-input"
              placeholder="AIza..."
            />
            <p className="text-xs text-muted-foreground">
              Tu clave API de Google para analizar sitios web con PageSpeed Insights. Obtén una clave en <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSettings;
