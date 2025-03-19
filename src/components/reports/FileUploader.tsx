
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import BlurredCard from '../ui/BlurredCard';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string;
}

type UploadedFile = {
  file: File;
  id: string;
  progress: number;
  error?: string;
  uploaded: boolean;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesChange,
  maxFiles = 5,
  acceptedTypes = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.csv,.xlsx,.xls'
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files)
      .slice(0, maxFiles - uploadedFiles.length)
      .map(file => ({
        file,
        id: crypto.randomUUID(),
        progress: 0,
        uploaded: false
      }));

    if (newFiles.length === 0) return;

    // Simulate upload process
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));

    // Simulate progress
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(prevFiles =>
          prevFiles.map(f =>
            f.id === fileId ? { ...f, progress: 100, uploaded: true } : f
          )
        );
      } else {
        setUploadedFiles(prevFiles =>
          prevFiles.map(f =>
            f.id === fileId ? { ...f, progress } : f
          )
        );
      }
    }, 300);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <File className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/20'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept={acceptedTypes}
          onChange={e => handleFilesSelected(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Drag and drop files here</h3>
          <p className="text-sm text-muted-foreground mb-2">
            or click to browse your files
          </p>
          <p className="text-xs text-muted-foreground">
            Supports {acceptedTypes.replace(/\./g, '').replace(/,/g, ', ')}
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum {maxFiles} files
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <BlurredCard className="space-y-3">
          <h4 className="font-medium">Uploaded Files ({uploadedFiles.length}/{maxFiles})</h4>
          <div className="space-y-3">
            {uploadedFiles.map(fileObj => (
              <div key={fileObj.id} className="flex items-center space-x-3 p-2 bg-background/50 rounded-md">
                {getFileIcon(fileObj.file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={fileObj.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {fileObj.progress >= 100 ? 'Complete' : `${Math.round(fileObj.progress)}%`}
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex items-center">
                  {fileObj.error ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : fileObj.uploaded ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileObj.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </BlurredCard>
      )}
    </div>
  );
};

export default FileUploader;
