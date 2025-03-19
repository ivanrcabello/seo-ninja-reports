
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, ExternalLink, Share2 } from 'lucide-react';
import ShareReportDialog from '../ShareReportDialog';
import { useNavigate, useLocation } from 'react-router-dom';

export interface ReportHeaderProps {
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
  const navigate = useNavigate();
  const location = useLocation();
  
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const toggleEditMode = () => {
    if (isEditing) {
      // Remove the query parameter when exiting edit mode
      navigate(`/reports/${reportId}`);
    } else {
      // Add the query parameter when entering edit mode
      navigate(`/reports/${reportId}?mode=edit`);
    }
    setIsEditing(!isEditing);
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            <time dateTime={date}>{formattedDate}</time>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {url && (
            <Button variant="outline" size="sm" onClick={() => window.open(url, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Sitio
            </Button>
          )}
          
          <Button 
            variant={isEditing ? "secondary" : "outline"} 
            size="sm" 
            onClick={toggleEditMode}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {isEditing ? 'Guardar' : 'Editar'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>
      
      <ShareReportDialog 
        open={shareDialogOpen} 
        onOpenChange={setShareDialogOpen} 
        reportId={reportId}
      />
    </div>
  );
};

export default ReportHeader;
