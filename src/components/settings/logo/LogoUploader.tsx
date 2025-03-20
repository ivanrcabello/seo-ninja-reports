
import React, { useCallback, useState } from 'react';
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleFile = async (file: File) => {
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Por favor sube un archivo de imagen (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10); // Start progress
    
    try {
      console.log('Starting logo upload process...');
      setUploadProgress(30);
      
      // Upload to storage
      const publicUrl = await uploadLogoToStorage(file);
      setUploadProgress(70);
      
      if (publicUrl) {
        // Update settings
        await updateLogoInSettings(publicUrl);
        setUploadProgress(100);
        setLogo(publicUrl);
        
        toast({
          title: "Logo actualizado",
          description: "El logo se ha actualizado correctamente.",
          variant: "default",
        });
        
        // Reload the page to refresh the logo in the header
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
      setUploadProgress(0);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    handleFile(file);
    // Reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };
  
  const handleRemoveLogo = async () => {
    try {
      setIsUploading(true);
      console.log('Removing logo...');
      await updateLogoInSettings(null);
      setLogo(null);
      
      toast({
        title: "Logo eliminado",
        description: "El logo ha sido eliminado correctamente.",
        variant: "default",
      });
      
      // Reload the page to refresh the header
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error('Error removing logo:', error);
      toast({
        title: "Error al eliminar el logo",
        description: error.message || "Ha ocurrido un error al eliminar el logo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-md p-4 transition-all flex flex-col items-center justify-center",
        "cursor-pointer hover:border-emerald-600/50 hover:bg-muted/20",
        dragActive && "border-emerald-600 bg-emerald-50/10",
        logo ? "h-auto" : "h-40"
      )}
      onClick={() => document.getElementById('logo-upload')?.click()}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
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
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium">Subiendo logo... {uploadProgress}%</p>
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
