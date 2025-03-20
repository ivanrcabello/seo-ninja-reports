
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LogoUpload = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const { data: settings } = await supabase
        .from('settings')
        .select('logo_url')
        .single();
      
      if (settings?.logo_url) {
        setLogo(settings.logo_url);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('blog_images') // Using the same bucket we created for blog images
        .upload(fileName, file);
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('blog_images')
        .getPublicUrl(fileName);
      
      if (publicURL) {
        // Save URL to settings table
        const { error: updateError } = await supabase
          .from('settings')
          .upsert({ 
            id: 1, // Using a fixed ID for settings
            logo_url: publicURL.publicUrl 
          });
        
        if (updateError) {
          throw updateError;
        }
        
        setLogo(publicURL.publicUrl);
        
        toast({
          title: "Logo actualizado",
          description: "El logo se ha actualizado correctamente.",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error al subir el logo",
        description: error.message || "Ha ocurrido un error al subir el logo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };
  
  const handleRemoveLogo = async () => {
    try {
      // Update the settings to remove the logo URL
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          id: 1,
          logo_url: null 
        });
      
      if (error) {
        throw error;
      }
      
      setLogo(null);
      
      toast({
        title: "Logo eliminado",
        description: "El logo ha sido eliminado correctamente.",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error removing logo:', error);
      toast({
        title: "Error al eliminar el logo",
        description: error.message || "Ha ocurrido un error al eliminar el logo.",
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
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-4 transition-all flex flex-col items-center justify-center",
            "cursor-pointer hover:border-primary/50 hover:bg-muted/20",
            logo ? "h-auto" : "h-40"
          )}
          onClick={() => document.getElementById('logo-upload')?.click()}
        >
          <input 
            type="file" 
            id="logo-upload" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          {logo ? (
            <div className="relative w-full">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLogo();
                }}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex justify-center">
                <img 
                  src={logo} 
                  alt="Logo de la empresa" 
                  className="max-h-32 mx-auto object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
                  <p className="text-sm font-medium">Subiendo logo...</p>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 mb-2" />
                  <p className="text-sm font-medium">Haz clic para subir un logo</p>
                  <p className="text-xs">o arrastra y suelta aquí</p>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Formatos recomendados: PNG, SVG o JPEG con fondo transparente.</p>
          <p>Tamaño máximo: 2MB. Dimensiones recomendadas: 200x50px.</p>
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;
