
import React from 'react';
import { Clock, FileText, Send, BadgeCheck, Ban } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { PublicContract } from './types';
import { SharedContentStatus } from '@/types/shared-content';

export interface ContractHeaderProps {
  contract: PublicContract | null;
  logo: string | null;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({ contract, logo }) => {
  return (
    <>
      {/* Logo Header */}
      {logo && (
        <div className="flex justify-center mb-8">
          <img 
            src={logo} 
            alt="Logo de la empresa" 
            className="h-16 object-contain"
          />
        </div>
      )}
      
      {/* Contract Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">{contract?.title}</h1>
        <div className="flex justify-center mb-4">
          <span className={`text-sm px-3 py-1.5 rounded-full flex items-center ${getStatusColor(contract)}`}>
            {getStatusIcon(contract)}
            <span className="ml-1.5">{getStatusLabel(contract)}</span>
          </span>
        </div>
        <div className="text-sm text-muted-foreground flex items-center justify-center">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          Última actualización: {formatDate(contract?.updated_at)}
        </div>
        {contract?.client_name && (
          <div className="text-sm text-muted-foreground mt-1">
            Contrato para: <span className="font-medium">{contract.client_name}</span>
          </div>
        )}
      </div>
    </>
  );
};

function getStatusIcon(contract: PublicContract | null) {
  if (!contract) return <FileText className="h-5 w-5" />;
    
  switch (contract.status) {
    case "draft":
      return <FileText className="h-5 w-5 text-muted-foreground" />;
    case "sent":
      return <Send className="h-5 w-5 text-blue-500" />;
    case "signed":
      return <BadgeCheck className="h-5 w-5 text-green-500" />;
    case "expired":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "cancelled":
      return <Ban className="h-5 w-5 text-red-500" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
}

function getStatusLabel(contract: PublicContract | null) {
  if (!contract) return 'Desconocido';
    
  switch (contract.status) {
    case "draft": return 'Borrador';
    case "sent": return 'Enviado';
    case "signed": return 'Firmado';
    case "expired": return 'Vencido';
    case "cancelled": return 'Cancelado';
    default: return 'Desconocido';
  }
}

function getStatusColor(contract: PublicContract | null) {
  if (!contract) return 'bg-muted text-muted-foreground';
    
  switch (contract.status) {
    case "draft": return 'bg-muted text-muted-foreground';
    case "sent": return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case "signed": return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case "expired": return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    case "cancelled": return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-muted text-muted-foreground';
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return 'No disponible';
  try {
    return formatDistance(new Date(dateString), new Date(), { 
      addSuffix: true,
      locale: es
    });
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Fecha desconocida';
  }
}

export default ContractHeader;
