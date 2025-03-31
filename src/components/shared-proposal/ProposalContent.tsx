
import React from 'react';
import { SharedProposal } from '@/types/shared-content';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Printer, Download } from 'lucide-react';

interface ProposalContentProps {
  proposal: SharedProposal;
  onPrint?: () => void;
}

const ProposalContent: React.FC<ProposalContentProps> = ({ proposal, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Descripción */}
        {proposal.description && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Descripción</h2>
            <div className="prose max-w-none dark:prose-invert">
              <p>{proposal.description}</p>
            </div>
          </section>
        )}
        
        {/* Servicios */}
        {Array.isArray(proposal.services) && proposal.services.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Servicios</h2>
            <ul className="list-disc pl-6 space-y-2">
              {proposal.services.map((service, index) => (
                <li key={index} className="text-muted-foreground">
                  {service}
                </li>
              ))}
            </ul>
          </section>
        )}
        
        {/* Precio */}
        {proposal.price && (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Precio</h2>
            <div className="bg-card p-4 border border-border rounded-md">
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span className="text-xl font-bold">{formatCurrency(proposal.price)}</span>
              </div>
            </div>
          </section>
        )}
        
        {/* Botones */}
        <div className="flex flex-wrap gap-3 mt-6 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          {/* Otros botones que puedan necesitarse */}
        </div>
      </div>
    </div>
  );
};

export default ProposalContent;
