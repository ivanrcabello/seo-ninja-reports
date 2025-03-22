
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClientProposal } from '@/types/client.types';
import ProposalForm from './dialog/ProposalForm';
import { toast } from 'sonner';

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: ClientProposal | null;
  onSave: (proposal: Partial<ClientProposal>) => void;
}

const ProposalDialog: React.FC<ProposalDialogProps> = ({ 
  open, 
  onOpenChange, 
  proposal, 
  onSave 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<'draft' | 'sent' | 'accepted' | 'rejected'>('draft');
  
  // Initialize form with proposal data if editing
  useEffect(() => {
    if (open) {
      if (proposal) {
        setTitle(proposal.title || '');
        setDescription(proposal.description || '');
        setServices(proposal.services || []);
        setPrice(proposal.price ? proposal.price.toString() : '');
        setStatus(proposal.status || 'draft');
      } else {
        // Reset form if creating new proposal
        setTitle('');
        setDescription('');
        setServices([]);
        setNewService('');
        setPrice('');
        setStatus('draft');
      }
    }
  }, [proposal, open]);
  
  const handleAddService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };
  
  const handleRemoveService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    
    onSave({
      title: title.trim(),
      description: description.trim(),
      services,
      price: price ? parseFloat(price) : undefined,
      status,
    });
  };
  
  // Handle explicit dialog close
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Allow a small delay before executing onOpenChange
      setTimeout(() => {
        onOpenChange(false);
      }, 100);
    } else {
      onOpenChange(true);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{proposal ? 'Editar propuesta' : 'Nueva propuesta'}</DialogTitle>
          <DialogDescription>
            {proposal 
              ? 'Modifica los detalles de la propuesta existente' 
              : 'Crea una nueva propuesta para el cliente'}
          </DialogDescription>
        </DialogHeader>

        <ProposalForm
          title={title}
          description={description}
          services={services}
          newService={newService}
          price={price}
          status={status}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onNewServiceChange={setNewService}
          onAddService={handleAddService}
          onRemoveService={handleRemoveService}
          onPriceChange={setPrice}
          onStatusChange={setStatus}
          onCancel={() => handleDialogClose(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
