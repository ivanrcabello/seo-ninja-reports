
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brush, Save, RotateCcw } from 'lucide-react';

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (signature: string) => void;
  title?: string;
  description?: string;
  isAdmin?: boolean;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onOpenChange,
  onSign,
  title = "Firma",
  description = "Dibuja tu firma en el área a continuación.",
  isAdmin
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  // Set up canvas when dialog opens
  useEffect(() => {
    if (open) {
      console.log("SignatureDialog opened, setting up canvas");
      setTimeout(() => {
        setupCanvas();
      }, 100); // Short delay to ensure canvas is available
    }
  }, [open]);
  
  const setupCanvas = () => {
    if (!canvasRef.current) {
      console.warn("Canvas ref is not available");
      return;
    }
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      console.log("Setting up canvas for signature");
      
      // Clear canvas and set styles
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = '#000000';
      
      // Draw bottom guide line
      context.beginPath();
      context.moveTo(10, canvas.height - 10);
      context.lineTo(canvas.width - 10, canvas.height - 10);
      context.stroke();
      
      setHasSignature(false);
    } else {
      console.error("Failed to get canvas context");
    }
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      setIsDrawing(true);
      
      const { offsetX, offsetY } = getCoordinates(e);
      
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      const { offsetX, offsetY } = getCoordinates(e);
      
      context.lineTo(offsetX, offsetY);
      context.stroke();
      setHasSignature(true);
    }
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling when drawing
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };
  
  const clearCanvas = () => {
    console.log("Clearing signature canvas");
    setupCanvas();
  };
  
  const saveSignature = () => {
    if (!canvasRef.current) {
      console.error("Cannot save signature - canvas not available");
      return;
    }
    
    console.log("Saving signature");
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    console.log("Signature data URL generated successfully");
    
    onSign(dataUrl);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div 
            className="border-2 border-muted rounded-md mb-4 overflow-hidden"
            style={{ touchAction: 'none' }}
          >
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
              className="w-full cursor-crosshair bg-white"
            />
          </div>
          
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearCanvas}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Borrar
            </Button>
            
            <Button
              type="button"
              onClick={saveSignature}
              disabled={!hasSignature}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar firma
            </Button>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
            <Brush className="h-4 w-4" />
            <span>Dibuja tu firma arrastrando el cursor o tu dedo en el área.</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
