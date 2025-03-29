
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Share2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ShareReportDialog from '../ShareReportDialog';

interface ReportHeaderProps {
  title: string;
  date: string;
  url: string;
  isEditing: boolean;
  reportId: string;
  setIsEditing: (isEditing: boolean) => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  title, 
  date, 
  url, 
  isEditing,
  reportId,
  setIsEditing 
}) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <div className="p-6 border-b flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{format(new Date(date), 'd MMMM yyyy', { locale: es })}</span>
          {url && (
            <>
              <span className="mx-2">•</span>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {url}
              </a>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsShareDialogOpen(true)}
          className="flex gap-2"
        >
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="flex gap-2"
        >
          <Edit className="h-4 w-4" />
          {isEditing ? "Guardando..." : "Editar"}
        </Button>
      </div>
      
      <ShareReportDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        reportId={reportId}
        reportTitle={title}
      />
    </div>
  );
};

export default ReportHeader;
