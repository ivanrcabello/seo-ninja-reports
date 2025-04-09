
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePersistentState } from '@/hooks/usePersistentState';
import { supabase } from '@/integrations/supabase/client';

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
  // Use localStorage instead of props for better persistence
  const [localGoogleKey, setLocalGoogleKey] = usePersistentState('pagespeed_api_key', googleApiKey);
  
  // Sync the local state with the props
  useEffect(() => {
    setGoogleKey(localGoogleKey);
  }, [localGoogleKey, setGoogleKey]);
  
  // Also sync props with local state on mount
  useEffect(() => {
    if (googleApiKey && googleApiKey !== localGoogleKey) {
      setLocalGoogleKey(googleApiKey);
    }
  }, [googleApiKey]);
  
  // Intenta guardar la clave API en la base de datos
  useEffect(() => {
    const saveApiKeyToDatabase = async () => {
      try {
        // Solo actualizar si la clave no está vacía
        if (localGoogleKey.trim()) {
          // Intentar obtener el registro de configuración actual
          const { data, error } = await supabase
            .from('settings')
            .select('id, google_key')
            .limit(1)
            .single();
            
          if (!error) {
            // Actualizar el valor en la base de datos
            await supabase
              .from('settings')
              .update({ google_key: localGoogleKey })
              .eq('id', data.id);
            
            console.log('Google PageSpeed API key saved to database');
          }
        }
      } catch (error) {
        console.error('Error saving API key to database:', error);
        // No mostrar toast de error para no molestar al usuario
      }
    };
    
    // Si hay una clave guardada, intentar sincronizarla con la base de datos
    if (localGoogleKey) {
      saveApiKeyToDatabase();
    }
  }, [localGoogleKey]);
  
  // Función para guardar los cambios
  const handleSave = async () => {
    setGoogleKey(localGoogleKey);
    
    // También guardar en la base de datos
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .single();
        
      if (!error && data) {
        await supabase
          .from('settings')
          .update({ google_key: localGoogleKey })
          .eq('id', data.id);
        
        toast.success('Clave API de Google guardada correctamente');
      }
    } catch (error) {
      console.error('Error saving Google API key to database:', error);
      toast.error('Error al guardar la clave API de Google');
    }
  };

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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleApiKey">API Key de Google</Label>
            <Input
              id="googleApiKey"
              type="password"
              value={localGoogleKey}
              onChange={(e) => setLocalGoogleKey(e.target.value)}
              className="glass-input"
              placeholder="AIza..."
            />
            <p className="text-xs text-muted-foreground">
              Tu clave API de Google para analizar sitios web con PageSpeed Insights. Obtén una clave en <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
            </p>
          </div>
          
          <Button onClick={handleSave} className="w-full">
            Guardar Clave API
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSettings;
