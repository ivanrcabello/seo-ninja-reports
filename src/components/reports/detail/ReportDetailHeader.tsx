
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText } from 'lucide-react';
import { Client } from '@/types/client.types';

interface ReportDetailHeaderProps {
  client: Client | null;
}

const ReportDetailHeader: React.FC<ReportDetailHeaderProps> = ({ client }) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        asChild
        className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
      >
        {client ? (
          <Link to={`/clients/${client.id}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : (
          <Link to="/reports">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        )}
      </Button>
      <div className="flex flex-col gap-1">
        <Link to="/reports" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Todos los informes
        </Link>
        {client && (
          <Link to={`/clients/${client.id}`}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              {client.name}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReportDetailHeader;
