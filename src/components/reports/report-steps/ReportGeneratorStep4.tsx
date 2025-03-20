
import React, { useEffect } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface ReportGeneratorStep4Props {
  notes: string;
  setNotes: (notes: string) => void;
  isLoading: boolean;
  previousStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ReportGeneratorStep4: React.FC<ReportGeneratorStep4Props> = ({
  notes,
  setNotes,
  isLoading,
  previousStep,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            1
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            2
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            3
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            4
          </div>
        </div>
      </div>
      
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Notas Adicionales</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Añade información adicional importante para el análisis, como detalles específicos del negocio, competidores principales, objetivos específicos, etc."
            className="min-h-[150px]"
          />
          <p className="text-xs text-muted-foreground">
            Estas notas serán procesadas por la IA para personalizar el informe según tus necesidades específicas.
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Recomendaciones para notas</h3>
              <p className="mt-1 text-xs text-blue-700">
                - Menciona si tienes algún enfoque específico para el informe<br />
                - Indica si hay áreas específicas que te interesan (conversiones, tráfico, UX)<br />
                - Comparte información sobre la competencia y el mercado<br />
                - Comenta cualquier problema técnico conocido
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
        >
          Atrás
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            'Generar Informe'
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default ReportGeneratorStep4;
