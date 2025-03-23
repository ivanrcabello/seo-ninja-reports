
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  
  // Initialize canvas when dialog opens
  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        setContext(ctx);
        
        // Adjust canvas size to match its container
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Clear the canvas
        clearCanvas();
      }
    }
  }, [open]);
  
  // Ensure canvas adjusts correctly when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && context) {
        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
        context.putImageData(imageData, 0, 0);
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = '#000000';
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [context]);
  
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    return { x, y };
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;
    
    // Prevent default behavior for touch events to avoid scrolling
    if ('touches' in e) {
      e.preventDefault();
    }
    
    setIsDrawing(true);
    setHasSignature(true);
    
    const { x, y } = getCoordinates(e, canvasRef.current);
    
    context.beginPath();
    context.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    // Prevent default behavior for touch events to avoid scrolling
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e, canvasRef.current);
    
    context.lineTo(x, y);
    context.stroke();
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };
  
  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasSignature(false);
    }
  };
  
  const saveSignature = () => {
    if (canvasRef.current) {
      const signatureImage = canvasRef.current.toDataURL('image/png');
      onSign(signatureImage);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? 'Firma como Administrador' : 'Firma como Cliente'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="border rounded-md w-full bg-background overflow-hidden">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="w-full h-[200px] touch-none cursor-crosshair"
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
          
          <p className="text-xs text-muted-foreground text-center">
            Dibuja tu firma en el área blanca arriba
          </p>
          
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
        
        <DialogFooter className="mt-4 flex">
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
