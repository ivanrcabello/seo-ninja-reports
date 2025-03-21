
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Search } from 'lucide-react';

interface GmbUrlInputProps {
  businessUrl: string;
  setBusinessUrl: (url: string) => void;
  handleAnalyze: () => void;
  isAnalyzing: boolean;
  clientWebsite?: string;
  useWebsite: boolean;
  setUseWebsite: (use: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const GmbUrlInput: React.FC<GmbUrlInputProps> = ({
  businessUrl,
  setBusinessUrl,
  handleAnalyze,
  isAnalyzing,
  clientWebsite,
  useWebsite,
  setUseWebsite,
  error,
  setError
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Introduce la URL del perfil de Google Business para analizar la información o usa el sitio web del cliente
      </p>
      
      {clientWebsite && (
        <div className="flex items-center space-x-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setUseWebsite(!useWebsite);
              setError(null);
            }}
            className={useWebsite ? "bg-primary/10" : ""}
          >
            <Globe className="h-4 w-4 mr-2" />
            {useWebsite ? "Usando sitio web" : "Usar sitio web del cliente"}
          </Button>
          {useWebsite && (
            <p className="text-xs text-muted-foreground">
              Se analizará: {clientWebsite}
            </p>
          )}
        </div>
      )}
      
      {!useWebsite && (
        <div className="flex gap-2">
          <Input
            placeholder="https://maps.app.goo.gl/... o https://www.google.com/maps/..."
            value={businessUrl}
            onChange={(e) => {
              setBusinessUrl(e.target.value);
              setError(null);
            }}
            className={error ? "border-red-500" : ""}
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !businessUrl.trim()}
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <span className="loading mr-2">●</span>
                Analizando
              </span>
            ) : (
              <span className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Analizar
              </span>
            )}
          </Button>
        </div>
      )}
      
      {useWebsite && (
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !clientWebsite}
          className="w-full"
        >
          {isAnalyzing ? (
            <span className="flex items-center">
              <span className="loading mr-2">●</span>
              Analizando con sitio web
            </span>
          ) : (
            <span className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Analizar con sitio web
            </span>
          )}
        </Button>
      )}
    </div>
  );
};

export default GmbUrlInput;
