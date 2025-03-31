
import React from 'react';
import { ArrowLeft, Calendar, AlertCircle, CheckCircle, Download, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SharedContentStatus } from '@/types/shared-content';
import { PublicContract } from './types';

interface ContractHeaderProps {
  contract: PublicContract;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({ contract }) => {
  const {
    title,
    client_name,
    created_at,
    status,
    admin_signed,
    client_signed
  } = contract;
  
  const formattedDate = created_at ? format(new Date(created_at), 'dd/MM/yyyy') : '';
  
  const getStatusBadge = () => {
    switch (status) {
      case "signed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Firmado
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Borrador
          </Badge>
        );
      case "sent":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Enviado
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Expirado
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };
  
  const getContractStatus = () => {
    if (status === "signed") {
      return "Firmado";
    } else if (status === "expired") {
      return "Expirado";
    } else if (status === "cancelled") {
      return "Cancelado";
    } else if (admin_signed && !client_signed) {
      return "Pendiente de firma del cliente";
    } else if (!admin_signed && client_signed) {
      return "Pendiente de firma de la empresa";
    } else {
      return "Pendiente de firmas";
    }
  };
  
  const getContractStatusColor = () => {
    if (status === "signed") {
      return "text-green-600";
    } else if (status === "expired") {
      return "text-red-600";
    } else if (status === "cancelled") {
      return "text-red-600";
    } else {
      return "text-amber-600";
    }
  };
  
  return (
    <div className="p-6 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver
        </Link>
        
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button size="sm" variant="ghost" className="ml-2 hidden md:flex print:hidden">
            <Download className="h-4 w-4 mr-1.5" />
            Descargar PDF
          </Button>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
        {client_name && (
          <div className="inline-flex items-center">
            Cliente: <span className="font-medium text-foreground ml-1">{client_name}</span>
          </div>
        )}
        
        {formattedDate && (
          <div className="inline-flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
            {formattedDate}
          </div>
        )}
        
        <div className={`inline-flex items-center font-medium ${getContractStatusColor()}`}>
          {getContractStatus()}
        </div>
      </div>
      
      <Separator className="mt-4" />
    </div>
  );
};

export default ContractHeader;
