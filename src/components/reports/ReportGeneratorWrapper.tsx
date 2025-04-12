
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReportGenerator from './ReportGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import useClients from '@/hooks/useClients';

interface ReportGeneratorWrapperProps {
  clientId?: string;
  onBack?: () => void;
}

const ReportGeneratorWrapper: React.FC<ReportGeneratorWrapperProps> = ({ 
  clientId: propClientId, 
  onBack 
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const { clients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  useEffect(() => {
    // Determine the client ID to use
    if (propClientId && propClientId !== 'new') {
      // Use the prop client ID if provided and not 'new'
      setSelectedClientId(propClientId);
    } else if (params.clientId && params.clientId !== 'new') {
      // Use the URL parameter client ID if available and not 'new'
      setSelectedClientId(params.clientId);
    } else if (clients.length > 0) {
      // Default to the first client if no specific client is selected
      setSelectedClientId(clients[0].id);
    }
  }, [propClientId, params.clientId, clients]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
      </Button>
      
      {selectedClientId ? (
        <ReportGenerator clientId={selectedClientId} />
      ) : (
        <div className="text-center p-6">
          <p className="mb-4">Seleccione un cliente para crear un informe</p>
          <Button onClick={() => navigate('/clients/new')}>
            Crear Nuevo Cliente
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReportGeneratorWrapper;
