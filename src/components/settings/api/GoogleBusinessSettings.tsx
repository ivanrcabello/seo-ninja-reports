
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface GoogleBusinessSettingsProps {
  googleBusinessApiKey: string;
  setGoogleBusinessApiKey: (key: string) => void;
  hasConfiguredGoogleBusinessKey: boolean;
}

const GoogleBusinessSettings: React.FC<GoogleBusinessSettingsProps> = ({
  googleBusinessApiKey,
  setGoogleBusinessApiKey,
  hasConfiguredGoogleBusinessKey,
}) => {
  return (
    <div className="space-y-6">
      {!hasConfiguredGoogleBusinessKey && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No has configurado una API key de Google Business. Debes configurar una API key válida para utilizar la funcionalidad de extracción de datos de Google Business.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="googleBusinessApiKey">API Key de Google Business</Label>
        <Input
          id="googleBusinessApiKey"
          type="password"
          value={googleBusinessApiKey}
          onChange={(e) => setGoogleBusinessApiKey(e.target.value)}
          className="glass-input"
          placeholder="AIza..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Tu clave API de Google Business Profile para extraer información de fichas de negocio. Obtén una clave en <a href="https://developers.google.com/my-business/reference/rest/v4/accounts/list" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-medium mb-2">Información importante</h4>
        <p className="text-xs">
          La API de Google Business Profile requiere verificación de la cuenta de Google y la creación de un proyecto en Google Cloud Console. Consulta la documentación oficial para más detalles sobre cómo obtener las credenciales necesarias.
        </p>
      </div>
    </div>
  );
};

export default GoogleBusinessSettings;
