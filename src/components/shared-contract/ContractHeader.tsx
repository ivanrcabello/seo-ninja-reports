
import React from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, CalendarDays, Globe, Building } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SharedContract, SharedContentStatus } from '@/types/shared-content';
import { PublicContract } from './types';

interface ContractHeaderProps {
  contract: PublicContract;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({ contract }) => {
  const getStatusIndicator = () => {
    if (contract.client_signed && contract.admin_signed) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Firmado por ambas partes</span>
        </div>
      );
    } else if (contract.client_signed) {
      return (
        <div className="flex items-center text-blue-600">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Firmado por cliente</span>
        </div>
      );
    } else if (contract.admin_signed) {
      return (
        <div className="flex items-center text-yellow-600">
          <Clock className="h-5 w-5 mr-2" />
          <span>Pendiente de firma de cliente</span>
        </div>
      );
    } else if (contract.status === "signed") {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Firmado</span>
        </div>
      );
    } else if (contract.status === "expired") {
      return (
        <div className="flex items-center text-gray-600">
          <XCircle className="h-5 w-5 mr-2" />
          <span>Expirado</span>
        </div>
      );
    } else if (contract.status === "cancelled") {
      return (
        <div className="flex items-center text-red-600">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>Cancelado</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-yellow-600">
          <Clock className="h-5 w-5 mr-2" />
          <span>Pendiente de firma</span>
        </div>
      );
    }
  };

  const getStatusClass = () => {
    if (contract.client_signed && contract.admin_signed) {
      return "bg-green-100 text-green-800";
    } else if (contract.client_signed) {
      return "bg-blue-100 text-blue-800";
    } else if (contract.admin_signed) {
      return "bg-yellow-100 text-yellow-800";
    } else if (["signed"].includes(contract.status as string)) {
      return "bg-green-100 text-green-800";
    } else if (["expired"].includes(contract.status as string)) {
      return "bg-gray-100 text-gray-800";
    } else if (["cancelled"].includes(contract.status as string)) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg mb-6 p-6">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{contract.title}</h1>
          
          <div className="space-y-1 text-sm text-gray-600">
            {contract.created_at && (
              <p className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 inline" />
                Creado el {format(new Date(contract.created_at), 'd MMMM yyyy', { locale: es })}
              </p>
            )}
            
            {contract.client_name && (
              <p className="flex items-center">
                <Building className="h-4 w-4 mr-2 inline" />
                Cliente: {contract.client_name}
              </p>
            )}
            
            {contract.client_website && (
              <p className="flex items-center">
                <Globe className="h-4 w-4 mr-2 inline" />
                <a 
                  href={contract.client_website.startsWith('http') ? contract.client_website : `https://${contract.client_website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {contract.client_website}
                </a>
              </p>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <div className={`px-4 py-2 rounded-full inline-flex items-center ${getStatusClass()}`}>
            {getStatusIndicator()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractHeader;
