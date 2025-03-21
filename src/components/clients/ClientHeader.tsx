
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Link, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Client } from '@/types/client.types';
import EditClientForm from './EditClientForm';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import useClients from '@/hooks/useClients';

interface ClientHeaderProps {
  client: Client;
  isDeleting: boolean;
  onDeleteClient: () => Promise<void>;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ 
  client,
  isDeleting,
  onDeleteClient
}) => {
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const { updateClient } = useClients();

  const copyClientUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('URL copiada al portapapeles');
  };

  const handleToggleActive = async () => {
    try {
      setIsTogglingActive(true);
      await updateClient(client.id, { active: !client.active });
      toast.success(`Cliente marcado como ${!client.active ? 'activo' : 'inactivo'}`);
    } catch (error) {
      console.error('Error toggling client active status:', error);
      toast.error('Error actualizando estado del cliente');
    } finally {
      setIsTogglingActive(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{client.name}</h1>
          <div className="flex items-center mt-1.5 gap-2">
            <a 
              href={client.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              {client.website.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <span className="text-muted-foreground mx-1">•</span>
            <span className="text-muted-foreground">{client.industry}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center space-x-2 mr-4">
            <Switch 
              id="active-status" 
              checked={client.active}
              onCheckedChange={handleToggleActive}
              disabled={isTogglingActive}
            />
            <Label htmlFor="active-status" className={client.active ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
              {client.active ? "Cliente Activo" : "Cliente Inactivo"}
            </Label>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5"
            onClick={copyClientUrl}
          >
            <Link className="h-4 w-4" />
            <span className="hidden sm:inline">Copiar URL</span>
          </Button>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl glass">
              <EditClientForm 
                client={client} 
                onSuccess={() => setIsEditDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1.5">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Eliminar</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente el cliente "{client.name}" y todos sus informes asociados. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async (e) => {
                    e.preventDefault();
                    await onDeleteClient();
                    setIsDeleteDialogOpen(false);
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
