
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, Calendar, Globe, PenLine, CheckCircle, ExternalLink } from 'lucide-react';
import BlurredCard from '../ui/BlurredCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ShareReportDialog from './ShareReportDialog';

interface ReportHeaderProps {
  title: string;
  date: string;
  url?: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  reportId: string;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  title, 
  date, 
  url, 
  isEditing, 
  setIsEditing,
  reportId
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  return (
    <BlurredCard className="w-full bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-lg border-primary/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gradient-primary">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(date), 'd MMM yyyy', { locale: es })}</span>
            </div>
            {url && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full group hover:bg-primary/20 transition-all">
                <Globe className="h-4 w-4" />
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  {url.replace(/^https?:\/\//, '').split('/')[0]}
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 self-end md:self-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 group hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <CheckCircle className="h-4 w-4 group-hover:text-primary-foreground" />
                <span className="hidden sm:inline">Terminar Edición</span>
              </>
            ) : (
              <>
                <PenLine className="h-4 w-4 group-hover:text-primary-foreground" />
                <span className="hidden sm:inline">Editar</span>
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="gap-1 group hover:bg-primary hover:text-primary-foreground transition-all">
            <Download className="h-4 w-4 group-hover:text-primary-foreground" />
            <span className="hidden sm:inline">Descargar</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 group hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={() => setShareDialogOpen(true)}
          >
            <Share className="h-4 w-4 group-hover:text-primary-foreground" />
            <span className="hidden sm:inline">Compartir</span>
          </Button>
        </div>
      </div>
      
      <ShareReportDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        reportId={reportId}
        reportTitle={title}
      />
    </BlurredCard>
  );
};

export default ReportHeader;
