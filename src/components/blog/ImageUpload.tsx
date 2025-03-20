
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageSelected: (file: File | null) => void;
  onImageUrlChange: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImageUrl, 
  onImageSelected, 
  onImageUrlChange 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [useUrl, setUseUrl] = useState<boolean>(!!(currentImageUrl && !currentImageUrl.includes('blob:')));
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setUseUrl(false);
    onImageSelected(file);
    
    // Reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
    onImageUrlChange(url);
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageSelected(null);
    onImageUrlChange('');
  };
  
  const toggleMode = () => {
    setUseUrl(!useUrl);
    if (!useUrl) {
      onImageSelected(null);
    } else {
      onImageUrlChange('');
    }
    setPreviewUrl(null);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Imagen del artículo</label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={toggleMode}
        >
          {useUrl ? 'Subir archivo' : 'Usar URL'}
        </Button>
      </div>
      
      {useUrl ? (
        <Input
          type="url"
          placeholder="URL de la imagen"
          value={previewUrl || ''}
          onChange={handleUrlChange}
          className="w-full"
        />
      ) : (
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-4 transition-all flex flex-col items-center justify-center",
            "cursor-pointer hover:border-primary/50 hover:bg-muted/20",
            previewUrl ? "h-auto" : "h-48"
          )}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <input 
            type="file" 
            id="image-upload" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          
          {previewUrl ? (
            <div className="relative w-full">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-64 mx-auto rounded-md object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Upload className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Haz clic para subir una imagen</p>
              <p className="text-xs">o arrastra y suelta aquí</p>
            </div>
          )}
        </div>
      )}
      
      {previewUrl && useUrl && (
        <div className="mt-2 relative">
          <div className="border rounded-md p-2">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1 z-10 h-6 w-6 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-48 mx-auto rounded-md object-contain"
              onError={() => {
                setPreviewUrl('https://via.placeholder.com/640x360?text=Invalid+URL');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
