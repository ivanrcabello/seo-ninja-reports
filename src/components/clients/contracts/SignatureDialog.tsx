
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, RefreshCw } from 'lucide-react';

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (signature: string) => void;
  isAdmin: boolean;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onOpenChange,
  onSign,
  isAdmin
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  // Initialize canvas when dialog opens
  useEffect(() => {
    if (!open) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas properties
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    
    // Set canvas dimensions to match displayed size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    
    // Cleanup function
    return () => {
      setIsDrawing(false);
      setHasSignature(false);
    };
  }, [open]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get the correct coordinates
    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientX - rect.left 
      : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientY - rect.top 
      : (e as React.TouchEvent).touches[0].clientY - rect.top;
    
    // Begin the path at the current position
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Prevent default behavior to avoid scrolling on touch devices
    e.preventDefault();
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get the correct coordinates
    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientX - rect.left 
      : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = e.type.includes('mouse') 
      ? (e as React.MouseEvent).clientY - rect.top 
      : (e as React.TouchEvent).touches[0].clientY - rect.top;
    
    // Draw line to the current position
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Prevent default behavior to avoid scrolling on touch devices
    e.preventDefault();
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.closePath();
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };
  
  const saveSignature = () => {
    if (!canvasRef.current) return;
    
    try {
      const signatureImage = canvasRef.current.toDataURL('image/png');
      onSign(signatureImage);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving signature:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? 'Firma como Administrador' : 'Firma como Cliente'}
          </DialogTitle>
          <DialogDescription>
            Dibuja tu firma en el área blanca de abajo
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="border rounded-md w-full bg-background overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-[200px] cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
              onTouchCancel={endDrawing}
            />
          </div>
          
          <div className="flex justify-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={clearCanvas}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Borrar
            </Button>
          </div>
        </div>
        
        <DialogFooter className="mt-4 flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          
          <Button 
            type="button" 
            onClick={saveSignature}
            disabled={!hasSignature}
          >
            <Check className="h-4 w-4 mr-2" />
            Firmar documento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
