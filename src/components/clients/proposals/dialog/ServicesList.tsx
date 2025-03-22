
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ServicesListProps {
  services: string[];
  newService: string;
  onNewServiceChange: (value: string) => void;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  newService,
  onNewServiceChange,
  onAddService,
  onRemoveService
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input 
          value={newService} 
          onChange={(e) => onNewServiceChange(e.target.value)} 
          placeholder="Ej: Optimización técnica SEO"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddService();
            }
          }}
        />
        <Button type="button" onClick={onAddService} variant="outline">
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
                onClick={() => onRemoveService(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServicesList;
