
import React from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import { LogoDisplay } from './LogoDisplay';
import { uploadLogoToStorage, updateLogoInSettings } from './logoService';
import { Toast } from '@/components/ui/toast';

interface LogoUploaderProps {
  logo: string | null;
  setLogo: React.Dispatch<React.SetStateAction<string | null>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: {
    toast: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => void;
  }["toast"];
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  logo, 
  setLogo, 
  isUploading, 
  setIsUploading,
  toast
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const publicUrl = await uploadLogoToStorage(file);
      
      if (publicUrl) {
        await updateLogoInSettings(publicUrl);
        setLogo(publicUrl);
        
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
      await updateLogoInSettings(null);
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
        <LogoDisplay 
          logo={logo} 
          onRemove={handleRemoveLogo} 
          isUploading={isUploading}
        />
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
  );
};
