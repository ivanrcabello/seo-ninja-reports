
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CrawlPage, CrawlIssue, CrawlLink } from '@/services/seo-crawler/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import PagesList from './PagesList';
import PageDetail from './PageDetail';

interface PagesTabProps {
  pages: CrawlPage[];
  selectedPage: CrawlPage | null;
  pageIssues: CrawlIssue[];
  pageLinks?: CrawlLink[];
  onPageSelect: (page: CrawlPage) => void;
}

const PagesTab: React.FC<PagesTabProps> = ({
  pages,
  selectedPage,
  pageIssues,
  pageLinks = [],
  onPageSelect
}) => {
  if (!pages || pages.length === 0) {
    return (
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No se encontraron páginas</AlertTitle>
        <AlertDescription>
          No se pudieron encontrar páginas para analizar. Esto puede deberse a problemas de acceso al sitio web 
          o a errores durante el análisis. Intente nuevamente y verifique que la URL sea accesible.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <PagesList 
            pages={pages}
            selectedPage={selectedPage}
            onPageSelect={onPageSelect}
          />
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          {selectedPage ? (
            <PageDetail
              page={selectedPage}
              issues={pageIssues}
              links={pageLinks}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PagesTab;
