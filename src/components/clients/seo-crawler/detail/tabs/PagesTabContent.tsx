
import React from 'react';
import { CrawlPage, CrawlIssue } from '@/services/seo-crawler';
import BlurredCard from '@/components/ui/BlurredCard';
import PagesList from './PagesList';
import PageDetail from './PageDetail';
import { AlertTriangle } from 'lucide-react';

interface PagesTabContentProps {
  pages: CrawlPage[];
  selectedPage: CrawlPage | null;
  pageIssues: CrawlIssue[];
  onPageSelect: (page: CrawlPage) => void;
}

const PagesTabContent: React.FC<PagesTabContentProps> = ({
  pages,
  selectedPage,
  pageIssues,
  onPageSelect
}) => {
  if (!pages || pages.length === 0) {
    return (
      <BlurredCard className="p-6">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">No se encontraron páginas analizadas</h3>
          <p className="text-muted-foreground max-w-md">
            No se pudieron encontrar páginas para analizar. Esto puede deberse a problemas de acceso al sitio web 
            o a errores durante el análisis. Intente nuevamente y verifique que la URL sea accesible.
          </p>
        </div>
      </BlurredCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BlurredCard className="md:col-span-1">
        <PagesList 
          pages={pages}
          selectedPage={selectedPage}
          onPageSelect={onPageSelect}
        />
      </BlurredCard>
      
      <BlurredCard className="md:col-span-2">
        {selectedPage ? (
          <PageDetail
            page={selectedPage}
            issues={pageIssues}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Selecciona una página</h3>
              <p className="text-muted-foreground">
                Haz clic en una página en la lista para ver sus detalles
              </p>
            </div>
          </div>
        )}
      </BlurredCard>
    </div>
  );
};

export default PagesTabContent;
