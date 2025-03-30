
import React, { useState } from 'react';
import { MoreHorizontal, Share2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import ShareReportDialog from '@/components/reports/ShareReportDialog';

interface ReportDetailActionsProps {
  onDeleteReport: () => Promise<void>;
  reportId?: string;
  reportTitle?: string;
}

const ReportDetailActions: React.FC<ReportDetailActionsProps> = ({ 
  onDeleteReport, 
  reportId = '',
  reportTitle = 'Informe'
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };
  
  const handleShareClick = () => {
    setIsShareDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await onDeleteReport();
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error al eliminar el informe:', error);
      toast.error('No se pudo eliminar el informe');
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleShareClick}
          className="hover:bg-primary/10"
          title="Compartir informe"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Más opciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={handleDeleteClick}
              className="text-red-500 focus:text-red-500 cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {reportId && (
        <ShareReportDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          reportId={reportId}
          reportTitle={reportTitle}
        />
      )}
    </>
  );
};

export default ReportDetailActions;
