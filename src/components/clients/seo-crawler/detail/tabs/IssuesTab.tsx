
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface IssuesTabProps {
  issuesByType: Record<string, CrawlIssue[]>;
  pages: CrawlPage[];
  onPageSelect: (page: CrawlPage) => void;
}

const IssuesTab: React.FC<IssuesTabProps> = ({ issuesByType, pages, onPageSelect }) => {
  // Función para obtener un icono según el tipo de problema
  const getIssueTypeIcon = (issueType: string) => {
    if (issueType.includes('missing') || issueType.includes('error')) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    } else if (issueType.includes('warning') || issueType.includes('too_')) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    } else {
      return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Función para obtener un color según la severidad
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Función para obtener un página por su URL
  const getPageByUrl = (url: string) => {
    return pages.find(page => page.url === url);
  };

  return (
    <div className="space-y-6">
      {Object.keys(issuesByType).length > 0 ? (
        Object.entries(issuesByType).map(([issueType, issues]) => (
          <Card key={issueType}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getIssueTypeIcon(issueType)}
                <span className="ml-2">{formatIssueType(issueType)}</span>
                <Badge className="ml-2">{issues.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Página</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Solución recomendada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map(issue => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <button 
                          onClick={() => {
                            const page = getPageByUrl(issue.page_url!);
                            if (page) onPageSelect(page);
                          }}
                          className="text-primary hover:underline truncate max-w-[200px] block"
                        >
                          {issue.page_url}
                        </button>
                      </TableCell>
                      <TableCell>{issue.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{issue.recommended_fix}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No se encontraron problemas</h3>
            <p className="text-muted-foreground">
              No se han detectado problemas SEO en las páginas analizadas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Función para formatear el tipo de problema de forma más legible
const formatIssueType = (issueType: string): string => {
  switch(issueType) {
    case 'missing_title':
      return 'Título ausente';
    case 'missing_meta_description':
      return 'Meta descripción ausente';
    case 'missing_h1':
      return 'Encabezado H1 ausente';
    case 'title_too_long':
      return 'Título demasiado largo';
    case 'meta_description_too_long':
      return 'Meta descripción demasiado larga';
    case 'multiple_h1':
      return 'Múltiples encabezados H1';
    case 'missing_alt_text':
      return 'Texto alternativo ausente';
    case 'no_schema_markup':
      return 'Sin marcado de esquema';
    case 'ERROR_CRAWL':
      return 'Error durante el análisis';
    case 'ERROR_ACCESO':
      return 'Error de acceso';
    default:
      return issueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

export default IssuesTab;
