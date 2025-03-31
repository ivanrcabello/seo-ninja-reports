
import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eraser, CheckCircle, Loader2 } from 'lucide-react';

interface ContractSignProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (signatureData: string) => Promise<boolean>;
  isLoading: boolean;
}

const ContractSign: React.FC<ContractSignProps> = ({
  open,
  onOpenChange,
  onSign,
  isLoading
}) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [signing, setSigning] = useState(false);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsSigned(false);
    }
  };

  const handleSubmitSignature = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error('Por favor, firme antes de continuar');
      return;
    }

    try {
      setSigning(true);
      const signatureData = signatureRef.current.toDataURL('image/png');
      const success = await onSign(signatureData);

      if (success) {
        toast.success('Contrato firmado correctamente');
        onOpenChange(false);
      } else {
        toast.error('No se pudo firmar el contrato, intente nuevamente');
      }
    } catch (error) {
      console.error('Error al firmar:', error);
      toast.error('Error al procesar la firma');
    } finally {
      setSigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Firmar Contrato</DialogTitle>
          <DialogDescription>
            Dibuje su firma en el espacio a continuación para firmar el contrato.
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-md p-2 bg-background">
          <div className="border border-dashed border-gray-300 rounded-md h-40 flex items-center justify-center bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: 'signature-canvas w-full h-full',
                style: { width: '100%', height: '100%' }
              }}
              onEnd={() => setIsSigned(true)}
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearSignature}
              type="button"
            >
              <Eraser className="h-4 w-4 mr-2" />
              Borrar
            </Button>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={signing || isLoading}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSubmitSignature}
            disabled={!isSigned || signing || isLoading}
            className="flex items-center gap-2"
          >
            {signing || isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Firmar y Aceptar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractSign;
