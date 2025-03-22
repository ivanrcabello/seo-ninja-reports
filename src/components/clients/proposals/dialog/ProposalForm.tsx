
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Send } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ServicesList from './ServicesList';

interface ProposalFormProps {
  title: string;
  description: string;
  services: string[];
  newService: string;
  price: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onNewServiceChange: (value: string) => void;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onPriceChange: (value: string) => void;
  onStatusChange: (value: 'draft' | 'sent' | 'accepted' | 'rejected') => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  title,
  description,
  services,
  newService,
  price,
  status,
  onTitleChange,
  onDescriptionChange,
  onNewServiceChange,
  onAddService,
  onRemoveService,
  onPriceChange,
  onStatusChange,
  onCancel,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => onTitleChange(e.target.value)} 
            placeholder="Ej: Propuesta SEO mensual"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <RichTextEditor 
            value={description} 
            onChange={onDescriptionChange} 
          />
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
          <ServicesList
            services={services}
            newService={newService}
            onNewServiceChange={onNewServiceChange}
            onAddService={onAddService}
            onRemoveService={onRemoveService}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Precio (€)</Label>
          <Input 
            id="price" 
            type="number" 
            value={price} 
            onChange={(e) => onPriceChange(e.target.value)} 
            placeholder="Ej: 299.99"
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={status} onValueChange={(value) => onStatusChange(value as any)}>
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
          onClick={onCancel}
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
  );
};

export default ProposalForm;
