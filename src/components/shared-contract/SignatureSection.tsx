
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Clock, Pencil, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PublicContract } from './types';
import { ContractActions } from './';
import { SharedContentStatus } from '@/types/shared-content';

interface SignatureSectionProps {
  contract: PublicContract;
  onOpenSignDialog: () => void;
  onPrint: () => void;
  onSign: (signature: string) => void;
  isSignDialogOpen: boolean;
  setIsSignDialogOpen: (open: boolean) => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({
  contract,
  onOpenSignDialog,
  onPrint,
  onSign,
  isSignDialogOpen,
  setIsSignDialogOpen
}) => {
  const [signature, setSignature] = React.useState('');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get position
    let clientX, clientY;
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignature(canvasRef.current.toDataURL());
    }
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };
  
  const handleSign = () => {
    if (!signature) {
      alert('Por favor, firme el documento antes de continuar.');
      return;
    }
    
    onSign(signature);
    setIsSignDialogOpen(false);
  };
  
  const canSignContract = !contract.client_signed && contract.status !== "cancelled" && contract.status !== "expired";
  
  return (
    <div className="bg-gray-50 border rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="w-full md:w-1/2 space-y-3">
          <h3 className="text-lg font-medium mb-3">Cliente</h3>
          
          {contract.client_signed ? (
            <div className="border rounded p-4 bg-white">
              <div className="flex items-center text-green-600 mb-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Firmado</span>
              </div>
              
              {contract.client_signed_at && (
                <p className="text-sm text-gray-500 mb-3">
                  Firmado el {format(new Date(contract.client_signed_at), 'd MMMM yyyy', { locale: es })}
                </p>
              )}
              
              {contract.client_signature && (
                <div className="border rounded p-2">
                  <img 
                    src={contract.client_signature} 
                    alt="Firma del cliente"
                    className="max-h-20 mx-auto"
                  />
                </div>
              )}
            </div>
          ) : canSignContract ? (
            <div className="border rounded p-4 bg-white">
              <div className="flex items-center text-yellow-600 mb-2">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Pendiente de firma</span>
              </div>
              
              <Button 
                onClick={onOpenSignDialog} 
                className="w-full mt-3 flex items-center justify-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Firmar ahora
              </Button>
            </div>
          ) : (
            <div className="border rounded p-4 bg-white">
              <div className="flex items-center text-gray-600 mb-2">
                <XCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">No disponible</span>
              </div>
              
              <p className="text-sm text-gray-500">
                Este contrato ya no está disponible para firma.
              </p>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 space-y-3">
          <h3 className="text-lg font-medium mb-3">Empresa</h3>
          
          {contract.admin_signed ? (
            <div className="border rounded p-4 bg-white">
              <div className="flex items-center text-green-600 mb-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Firmado</span>
              </div>
              
              {contract.admin_signed_at && (
                <p className="text-sm text-gray-500 mb-3">
                  Firmado el {format(new Date(contract.admin_signed_at), 'd MMMM yyyy', { locale: es })}
                </p>
              )}
              
              {contract.admin_signature && (
                <div className="border rounded p-2">
                  <img 
                    src={contract.admin_signature}
                    alt="Firma de la empresa"
                    className="max-h-20 mx-auto"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded p-4 bg-white">
              <div className="flex items-center text-yellow-600 mb-2">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Pendiente de firma</span>
              </div>
              
              <p className="text-sm text-gray-500">
                Esperando la firma de la empresa.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 hidden md:block">
        <ContractActions 
          // Type casting to match expected type
          contract={{...contract, status: contract.status as SharedContentStatus}}
          onOpenSignDialog={onOpenSignDialog}
          onPrint={onPrint}
        />
      </div>
      
      {/* Signature Dialog */}
      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Firma del Contrato</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Al firmar este documento, acepta todos los términos y condiciones establecidos en el contrato.
              </AlertDescription>
            </Alert>
            
            <div className="border rounded-md p-2 bg-white">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="border rounded w-full touch-none cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              
              <div className="flex justify-between mt-2">
                <Button variant="outline" size="sm" onClick={clearCanvas}>
                  Borrar firma
                </Button>
                
                <Button size="sm" onClick={handleSign} disabled={!signature}>
                  Firmar contrato
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignatureSection;
