
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, FileText, Printer } from "lucide-react";
import { SharedProposal } from '@/types/shared-content';
import { formatCurrency } from '@/lib/utils';

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
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Descripción</h2>
        <div className="prose max-w-none dark:prose-invert">
          {proposal.description ? (
            <p className="text-slate-600 dark:text-slate-300">{proposal.description}</p>
          ) : (
            <p className="text-slate-500 italic">No se proporcionó descripción</p>
          )}
        </div>
      </div>

      {proposal.services && proposal.services.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Servicios Incluidos</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {proposal.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {proposal.price !== undefined && proposal.price !== null && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Precio</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(proposal.price)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <CardFooter className="flex justify-end px-0 pt-4 pb-0">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </CardFooter>
    </div>
  );
};

export default ProposalContent;
