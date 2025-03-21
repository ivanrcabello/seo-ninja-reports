
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Info, RefreshCw, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BusinessProfile } from '@/types/report.types';
import { extractValueserpData } from '@/services/api/businessProfile/extractValueserpData';
import { Separator } from '@/components/ui/separator';

interface ReportGeneratorStep2Props {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  customPrompt: string;
  setCustomPrompt: React.Dispatch<React.SetStateAction<string>>;
  hasGoogleApiKey: boolean;
  pageSpeedDataFetched: boolean;
  isLoading: boolean;
  previousStep: () => void;
  nextStep: () => void;
  businessUrl?: string;
  setBusinessUrl: (url: string) => void;
  businessProfile: Partial<BusinessProfile> | null;
  setBusinessProfile: (profile: Partial<BusinessProfile> | null) => void;
}

const ReportGeneratorStep2: React.FC<ReportGeneratorStep2Props> = ({
  files,
  setFiles,
  customPrompt,
  setCustomPrompt,
  hasGoogleApiKey,
  pageSpeedDataFetched,
  isLoading,
  previousStep,
  nextStep,
  businessUrl,
  setBusinessUrl,
  businessProfile,
  setBusinessProfile
}) => {
  const [isLoadingBusinessProfile, setIsLoadingBusinessProfile] = React.useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const handleDefaultPrompt = () => {
    const defaultPrompt = localStorage.getItem('default_seo_prompt');
    if (defaultPrompt) {
      setCustomPrompt(defaultPrompt);
      toast.success('Prompt predeterminado cargado');
    } else {
      toast.error('No hay prompt predeterminado configurado');
    }
  };
  
  const handleFetchBusinessProfile = async () => {
    if (!businessUrl || businessUrl.trim() === '') {
      toast.error('Ingresa el nombre del negocio o página');
      return;
    }
    
    setIsLoadingBusinessProfile(true);
    
    try {
      const searchTerm = businessUrl.trim();
      const profileData = await extractValueserpData(searchTerm);
      
      if (profileData) {
        setBusinessProfile(profileData);
        toast.success('Perfil de negocio extraído correctamente');
        
        // Si es un perfil simulado, mostrar advertencia
        if (profileData.businessName === 'Negocio de ejemplo' || 
            profileData.businessName?.includes('ejemplo')) {
          toast.warning('Se están usando datos de perfil simulados', {
            description: 'Intenta con un nombre de negocio más específico'
          });
        }
      } else {
        toast.error('No se pudo extraer el perfil del negocio');
      }
    } catch (error: any) {
      console.error('Error al extraer perfil de negocio:', error);
      toast.error('Error al extraer perfil de negocio', {
        description: error.message || 'Intenta con un nombre más específico'
      });
    } finally {
      setIsLoadingBusinessProfile(false);
    }
  };

  return (
    <div className="space-y-4">
      <CardContent className="space-y-4 p-4 pt-0">
        <h3 className="text-xl font-semibold mb-4">Añade material de apoyo</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessUrl">Nombre del negocio</Label>
            <div className="flex space-x-2">
              <Input
                id="businessUrl"
                placeholder="Nombre del negocio y ubicación"
                value={businessUrl || ''}
                onChange={(e) => setBusinessUrl(e.target.value)}
              />
              <Button 
                variant="outline"
                size="icon"
                type="button"
                onClick={handleFetchBusinessProfile}
                disabled={isLoadingBusinessProfile}
              >
                {isLoadingBusinessProfile ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Building2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            {businessProfile && (
              <div className="mt-2 p-2 border rounded-md bg-muted/30 text-xs">
                <p className="font-medium">Perfil extraído: {businessProfile.businessName}</p>
                {businessProfile.businessAddress && (
                  <p className="text-muted-foreground truncate">{businessProfile.businessAddress}</p>
                )}
                {businessProfile.businessRating && (
                  <p className="text-muted-foreground">
                    Rating: {businessProfile.businessRating} ({businessProfile.businessReviewsCount} reseñas)
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file-upload">Archivos adicionales</Label>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              
              {files.length > 0 && (
                <div className="mt-2 p-2 border rounded-md bg-muted/30 max-h-20 overflow-auto">
                  <div className="text-xs space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => handleRemoveFile(file.name)}
                        >
                          <span className="sr-only">Eliminar</span>
                          <span aria-hidden="true">×</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="custom-prompt">Instrucciones personalizadas</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDefaultPrompt}
            >
              Cargar predeterminado
            </Button>
          </div>
          
          <ScrollArea className="h-[150px] rounded-md border">
            <Textarea
              id="custom-prompt"
              placeholder="Instrucciones específicas para generar este informe..."
              className="min-h-[150px] border-0 focus-visible:ring-0"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </ScrollArea>
          
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5" />
            <p>
              Puedes personalizar las instrucciones para el informe. El sistema
              aún generará todas las secciones requeridas.
            </p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex gap-2 items-center">
            <Upload className={`h-4 w-4 ${pageSpeedDataFetched ? 'text-green-500' : 'text-muted-foreground'}`} />
            <span className={`text-sm ${pageSpeedDataFetched ? 'text-green-500' : 'text-muted-foreground'}`}>
              {pageSpeedDataFetched 
                ? 'Datos de PageSpeed obtenidos exitosamente' 
                : (hasGoogleApiKey 
                  ? 'Se obtendrán datos de PageSpeed para el análisis técnico' 
                  : 'No hay clave API configurada para PageSpeed')}
            </span>
          </div>
          
          <div className="flex gap-2 items-center">
            <Building2 className={`h-4 w-4 ${businessProfile ? 'text-green-500' : 'text-muted-foreground'}`} />
            <span className={`text-sm ${businessProfile ? 'text-green-500' : 'text-muted-foreground'}`}>
              {businessProfile 
                ? 'Datos de perfil de negocio obtenidos correctamente' 
                : 'Datos de perfil de negocio (opcional)'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={previousStep}
          disabled={isLoading}
        >
          Atrás
        </Button>
        <Button 
          onClick={nextStep}
          disabled={isLoading}
        >
          Siguiente
        </Button>
      </CardFooter>
    </div>
  );
};

export default ReportGeneratorStep2;
