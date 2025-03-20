
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleServiceError } from '@/services/api/baseService';

const LogoUpload = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      // Check if settings table exists
      const { data: tableInfo, error: tableError } = await supabase
        .from('settings')
        .select('count(*)', { count: 'exact', head: true });
      
      if (tableError) {
        console.error('Error checking settings table:', tableError);
        // Create settings table if it doesn't exist
        await createSettingsTable();
        return;
      }
      
      const { data, error } = await supabase
        .from('settings')
        .select('logo_url')
        .eq('id', 1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No settings record, create one
          await createSettingsRecord();
        } else {
          console.error('Error fetching logo:', error);
        }
        return;
      }
      
      if (data?.logo_url) {
        setLogo(data.logo_url);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const createSettingsTable = async () => {
    try {
      // Create the settings table if it doesn't exist
      const { error } = await supabase.rpc('create_settings_table_if_not_exists');
      
      if (error) {
        console.error('Error creating settings table:', error);
        return;
      }
      
      // Create initial record
      await createSettingsRecord();
    } catch (error) {
      console.error('Error creating settings table:', error);
    }
  };

  const createSettingsRecord = async () => {
    try {
      const { error } = await supabase
        .from('settings')
        .insert({ id: 1, logo_url: null })
        .select();
        
      if (error) {
        console.error('Error creating settings record:', error);
      }
    } catch (error) {
      console.error('Error creating settings record:', error);
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
        // Check if settings table has data
        const { count, error: countError } = await supabase
          .from('settings')
          .select('*', { count: 'exact', head: true });
          
        if (countError) {
          console.error('Error checking settings count:', countError);
          await createSettingsRecord();
        }
        
        // Save URL to settings table
        const { error: updateError } = await supabase
          .from('settings')
          .upsert({ id: 1, logo_url: publicURL.publicUrl })
          .select();
        
        if (updateError) {
          throw updateError;
        }
        
        setLogo(publicURL.publicUrl);
        
        toast({
          title: "Logo actualizado",
          description: "El logo se ha actualizado correctamente.",
          variant: "default",
        });
        
        // Reload the page to refresh the logo in the header
        window.location.reload();
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
        .update({ logo_url: null })
        .eq('id', 1);
      
      if (error) {
        throw error;
      }
      
      setLogo(null);
      
      toast({
        title: "Logo eliminado",
        description: "El logo ha sido eliminado correctamente.",
        variant: "default",
      });
      
      // Reload the page to refresh the header
      window.location.reload();
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
            "cursor-pointer hover:border-emerald-600/50 hover:bg-muted/20",
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
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-2"></div>
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
