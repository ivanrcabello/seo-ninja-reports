
import React, { useState, useEffect } from 'react';
import { LogoDisplay } from './logo/LogoDisplay';
import { LogoUploader } from './logo/LogoUploader';
import { LogoGuidelines } from './logo/LogoGuidelines';
import { fetchLogoFromSettings, createSettingsTableIfNeeded } from './logo/logoService';
import { useToast } from '@/components/ui/use-toast';

const LogoUpload = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeLogoSettings();
  }, []);

  const initializeLogoSettings = async () => {
    try {
      // First ensure the settings table exists
      await createSettingsTableIfNeeded();
      
      // Then fetch the logo
      const logoUrl = await fetchLogoFromSettings();
      if (logoUrl) {
        setLogo(logoUrl);
      }
    } catch (error) {
      console.error('Error initializing logo settings:', error);
      toast({
        title: "Error al cargar el logo",
        description: "No se pudo cargar la configuración del logo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Logo de la empresa</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Sube el logotipo de tu empresa para que aparezca en el encabezado y otros lugares de la aplicación.
      </p>
      
      <div className="space-y-4">
        <LogoUploader 
          logo={logo}
          setLogo={setLogo}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          toast={toast}
        />
        
        <LogoGuidelines />
      </div>
    </div>
  );
};

export default LogoUpload;
