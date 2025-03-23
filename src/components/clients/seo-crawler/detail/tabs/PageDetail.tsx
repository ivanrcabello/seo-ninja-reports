
import React from 'react';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { CrawlPage, CrawlIssue } from '@/services/seo-crawler';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getIssueTypeIcon, getSeverityColor } from '../utils/crawlerUtils';

interface PageDetailProps {
  page: CrawlPage;
  issues: CrawlIssue[];
}

const PageDetail: React.FC<PageDetailProps> = ({ page, issues }) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Detalles de la página</CardTitle>
        <CardDescription>
          <a 
            href={page.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center"
          >
            {page.url}
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <PageDetailItem 
                title="Título" 
                content={page.title} 
              />
              
              <PageDetailItem 
                title="Meta descripción" 
                content={page.meta_description} 
              />
              
              <PageDetailItem 
                title="H1" 
                content={page.h1}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Código de estado</h3>
                <div className="p-3 bg-muted rounded-md">
                  <Badge 
                    variant="outline" 
                    className={
                      page.status_code >= 200 && page.status_code < 300
                        ? 'bg-green-100 text-green-800'
                        : page.status_code >= 300 && page.status_code < 400
                        ? 'bg-yellow-100 text-yellow-800'
                        : page.status_code >= 400
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {page.status_code}
                  </Badge>
                </div>
              </div>
              
              <CanonicalUrlItem url={page.canonical_url} />
              
              <PageDetailItem 
                title="Directivas robots" 
                content={page.robots_directives} 
              />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Indexable</h3>
                <div className="p-3 bg-muted rounded-md">
                  {page.is_indexable ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Sí
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" /> No
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Problemas detectados en esta página</h3>
            
            {issues.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problema</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Solución recomendada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map(issue => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getIssueTypeIcon(issue.issue_type)}
                          <span className="ml-2">
                            {issue.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getSeverityColor(issue.severity)}
                        >
                          {issue.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{issue.recommended_fix}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No se encontraron problemas en esta página.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </>
  );
};

interface PageDetailItemProps {
  title: string;
  content: string | null;
}

const PageDetailItem: React.FC<PageDetailItemProps> = ({ title, content }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="p-3 bg-muted rounded-md">
        {content || <span className="text-muted-foreground">No definido</span>}
      </div>
    </div>
  );
};

interface CanonicalUrlItemProps {
  url: string | null;
}

const CanonicalUrlItem: React.FC<CanonicalUrlItemProps> = ({ url }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">URL canónica</h3>
      <div className="p-3 bg-muted rounded-md">
        {url ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center"
          >
            {url}
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        ) : (
          <span className="text-muted-foreground">No definida</span>
        )}
      </div>
    </div>
  );
};

export default PageDetail;
