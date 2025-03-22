
import React from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SeoReport } from '@/types/seo-reporting.types';
import { Info, FileSearch } from 'lucide-react';

interface ReportGeneratorStep4Props {
  notes: string;
  setNotes: (notes: string) => void;
  seoReports: SeoReport[];
  selectedSeoReport: string | null;
  setSelectedSeoReport: (reportId: string | null) => void;
  isLoading: boolean;
  previousStep: () => void;
  nextStep: () => void;
}

const ReportGeneratorStep4: React.FC<ReportGeneratorStep4Props> = ({
  notes,
  setNotes,
  seoReports,
  selectedSeoReport,
  setSelectedSeoReport,
  isLoading,
  previousStep,
  nextStep,
}) => {
  return (
    <div>
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
          <div className="h-0.5 w-10 bg-muted"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
            5
          </div>
        </div>
      </div>
      
      <CardContent className="space-y-6 pt-4">
        {seoReports.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="seo-report">Informes SEO existentes</Label>
            <Select
              value={selectedSeoReport || "none"}
              onValueChange={(value) => setSelectedSeoReport(value === "none" ? null : value)}
            >
              <SelectTrigger id="seo-report">
                <SelectValue placeholder="Seleccionar informe SEO existente (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguno</SelectItem>
                {seoReports.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.domain} ({new Date(report.createdAt).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Puedes seleccionar un informe SEO existente para incluir sus datos en el análisis
            </p>
            
            {selectedSeoReport && (
              <div className="mt-2 p-3 rounded-md bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-2">
                  <FileSearch className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">
                      Informe seleccionado: {
                        seoReports.find(r => r.id === selectedSeoReport)?.domain
                      }
                    </h4>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Tráfico:</span>{' '}
                        <span className="font-medium">{
                          seoReports.find(r => r.id === selectedSeoReport)?.traffic.toLocaleString()
                        }</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Keywords:</span>{' '}
                        <span className="font-medium">{
                          seoReports.find(r => r.id === selectedSeoReport)?.keywords.toLocaleString()
                        }</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Backlinks:</span>{' '}
                        <span className="font-medium">{
                          seoReports.find(r => r.id === selectedSeoReport)?.backlinks.toLocaleString()
                        }</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
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
              <Info className="h-5 w-5 text-blue-500" />
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
          disabled={isLoading}
        >
          Atrás
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          disabled={isLoading}
        >
          Siguiente
        </Button>
      </CardFooter>
    </div>
  );
};

export default ReportGeneratorStep4;
