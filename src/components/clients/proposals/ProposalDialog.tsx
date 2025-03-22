
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Save, Send } from 'lucide-react';
import { ClientProposal } from '@/types/client.types';

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
      alert('El título es obligatorio');
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{proposal ? 'Editar propuesta' : 'Nueva propuesta'}</DialogTitle>
            <DialogDescription>
              {proposal 
                ? 'Modifica los detalles de la propuesta existente' 
                : 'Crea una nueva propuesta para el cliente'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Ej: Propuesta SEO mensual"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <div className="border rounded-md">
                <div className="p-1 bg-muted/50 border-b flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 hover:bg-muted rounded"
                    onClick={() => setDescription(description + '<b>Texto en negrita</b>')}
                  >
                    <b>N</b>
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-muted rounded"
                    onClick={() => setDescription(description + '<i>Texto en cursiva</i>')}
                  >
                    <i>C</i>
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-muted rounded"
                    onClick={() => setDescription(description + '<u>Texto subrayado</u>')}
                  >
                    <u>S</u>
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-muted rounded"
                    onClick={() => setDescription(description + '<h3>Título</h3>')}
                  >
                    T
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-muted rounded"
                    onClick={() => setDescription(description + '<ul><li>Elemento de lista</li></ul>')}
                  >
                    • Lista
                  </button>
                </div>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe brevemente esta propuesta... (Admite HTML)"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={6}
                />
              </div>
              {description && (
                <div className="mt-2">
                  <Label>Vista previa:</Label>
                  <div 
                    className="p-3 border rounded-md mt-1 prose max-w-full"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Servicios incluidos</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    value={newService} 
                    onChange={(e) => setNewService(e.target.value)} 
                    placeholder="Ej: Optimización técnica SEO"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddService} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir
                  </Button>
                </div>
                
                {services.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {services.map((service, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2">
                        <span className="text-sm">{service}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveService(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Precio (€)</Label>
              <Input 
                id="price" 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Ej: 299.99"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="accepted">Aceptada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            
            <Button 
              type="submit" 
              className="gap-1"
            >
              {status === 'draft' ? (
                <>
                  <Save className="h-4 w-4" />
                  Guardar borrador
                </>
              ) : status === 'sent' ? (
                <>
                  <Send className="h-4 w-4" />
                  Guardar y enviar
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
