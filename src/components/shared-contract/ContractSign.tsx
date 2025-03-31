
import React, { useState, useRef } from 'react';
import { PublicContract } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Pen, Check, Trash2, AlertCircle } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

interface ContractSignProps {
  contract: PublicContract;
  onSign: (signature: string) => Promise<boolean>;
  onCancel: () => void;
}

const ContractSign: React.FC<ContractSignProps> = ({
  contract,
  onSign,
  onCancel,
}) => {
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const signCanvasRef = useRef<SignatureCanvas | null>(null);

  const handleClearSignature = () => {
    if (signCanvasRef.current) {
      signCanvasRef.current.clear();
      setSignatureComplete(false);
    }
  };

  const handleSign = async () => {
    if (!signCanvasRef.current || signCanvasRef.current.isEmpty()) {
      setError('Por favor, añade tu firma antes de firmar el contrato');
      return;
    }

    try {
      setIsSigning(true);
      setError(null);
      
      // Get signature as data URL
      const signatureDataUrl = signCanvasRef.current.toDataURL('image/png');
      
      // Send signature to backend
      const success = await onSign(signatureDataUrl);
      
      if (!success) {
        setError('No se pudo completar la firma. Por favor, inténtalo de nuevo.');
      }
    } catch (err: any) {
      console.error('Error signing contract:', err);
      setError(err.message || 'Error al firmar el contrato');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle>Firma el contrato</CardTitle>
        <CardDescription>
          Firma digitalmente el contrato "{contract.title}" para aceptar sus términos y condiciones
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-4">
          <p className="text-sm mb-4 text-muted-foreground">
            Al firmar este contrato, confirmas que has leído, entendido y aceptas los términos
            y condiciones establecidos en el documento.
          </p>
          
          <div className="mb-2">
            <p className="text-sm mb-1 font-medium">Tu firma:</p>
            <div className="border rounded-md bg-background p-1">
              <SignatureCanvas
                ref={signCanvasRef}
                canvasProps={{
                  width: 600,
                  height: 200,
                  className: 'signature-canvas w-full h-[200px] border border-dashed border-muted-foreground/20'
                }}
                onEnd={() => setSignatureComplete(true)}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="button"
              variant="ghost" 
              size="sm"
              onClick={handleClearSignature}
            >
              <Trash2 className="h-4 w-4 mr-2" /> 
              Borrar firma
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSigning}
        >
          Cancelar
        </Button>
        
        <Button
          type="button"
          onClick={handleSign}
          disabled={isSigning || !signatureComplete}
          className="gap-2"
        >
          {isSigning ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Firmando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Firmar contrato
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContractSign;
