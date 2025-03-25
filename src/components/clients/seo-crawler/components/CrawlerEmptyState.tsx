
import React from 'react';
import { Button } from '@/components/ui/button';

interface CrawlerEmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

const CrawlerEmptyState: React.FC<CrawlerEmptyStateProps> = ({ searchTerm, onClearSearch }) => {
  return (
    <div className="py-12 text-center">
      <p className="text-muted-foreground">
        {searchTerm ? 
          "No se encontraron análisis que coincidan con la búsqueda" : 
          "No hay análisis SEO realizados todavía"
        }
      </p>
      {searchTerm && (
        <Button 
          variant="link" 
          onClick={onClearSearch}
        >
          Mostrar todos los análisis
        </Button>
      )}
    </div>
  );
};

export default CrawlerEmptyState;
