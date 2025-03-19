
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Client } from '@/types/client.types';
import { ChevronLeft, Trash2, PenLine, Loader2 } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

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
  return (
    <AnimatedContainer animation="slide-up" className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-1">
              {client.industry}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold">{client.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {client.name} and all associated reports.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDeleteClient}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" className="gap-1">
            <PenLine className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default ClientHeader;
