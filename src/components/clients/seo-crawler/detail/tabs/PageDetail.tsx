
import React from 'react';
import { CrawlPage, CrawlIssue, CrawlLink } from '@/services/seo-crawler/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, CheckCircle, XCircle, AlertTriangle, FileText, Image, Link, Link2 } from 'lucide-react';

interface PageDetailProps {
  page: CrawlPage;
  issues: CrawlIssue[];
  links?: CrawlLink[];
}

const PageDetail: React.FC<PageDetailProps> = ({ page, issues, links = [] }) => {
  // Agrupar enlaces
  const internalLinks = links.filter(link => link.is_internal);
  const externalLinks = links.filter(link => !link.is_internal);
  const brokenLinks = links.filter(link => link.is_broken);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{page.title || 'Sin título'}</h2>
          <a 
            href={page.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center text-sm mt-1"
          >
            {page.url}
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
        
        <div className="flex items-center gap-3">
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
          
          {page.is_indexable ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" /> Indexable
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800">
              <XCircle className="h-3 w-3 mr-1" /> No indexable
            </Badge>
          )}
          
          {issues.length > 0 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              <AlertTriangle className="h-3 w-3 mr-1" /> {issues.length} {issues.length === 1 ? 'problema' : 'problemas'}
            </Badge>
          )}
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="technical">Técnico</TabsTrigger>
          <TabsTrigger value="issues">Problemas</TabsTrigger>
          <TabsTrigger value="links">Enlaces</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <MetadataItem 
                label="Título"
                value={page.title || 'No definido'}
                warning={!page.title}
              />
              
              <MetadataItem 
                label="Meta descripción"
                value={page.meta_description || 'No definida'}
                warning={!page.meta_description}
              />
              
              <MetadataItem 
                label="Encabezado H1"
                value={page.h1 || 'No definido'}
                warning={!page.h1}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium mb-2">Estadísticas</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <StatCard 
                  icon={<FileText className="h-4 w-4 text-blue-500" />}
                  label="Palabras"
                  value={page.word_count.toString()}
                />
                
                <StatCard 
                  icon={<Image className="h-4 w-4 text-purple-500" />}
                  label="Imágenes"
                  value={page.image_count.toString()}
                />
                
                <StatCard 
                  icon={<Link className="h-4 w-4 text-green-500" />}
                  label="Enlaces internos"
                  value={page.internal_links_count.toString()}
                />
                
                <StatCard 
                  icon={<Link2 className="h-4 w-4 text-amber-500" />}
                  label="Enlaces externos"
                  value={page.external_links_count.toString()}
                />
              </div>
              
              {page.canonical_url && (
                <MetadataItem 
                  label="URL canónica"
                  value={page.canonical_url}
                  isLink
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium mb-2">Metadatos técnicos</h3>
              
              <MetadataItem 
                label="Meta robots"
                value={page.meta_robots || 'No definido'}
              />
              
              <MetadataItem 
                label="Directivas de robots"
                value={page.robots_directives || 'No definido'}
              />
              
              <div className="flex justify-between items-center border-b pb-2">
                <span>Mobile friendly</span>
                <Badge variant={page.mobile_friendly ? 'outline' : 'destructive'}>
                  {page.mobile_friendly ? 'Sí' : 'No'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span>Marcado de esquema</span>
                <Badge variant={page.has_schema_markup ? 'outline' : 'destructive'}>
                  {page.has_schema_markup ? 'Sí' : 'No'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium mb-2">Rendimiento</h3>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span>Tamaño de página</span>
                <Badge variant="outline">
                  {page.page_size_kb ? `${page.page_size_kb} KB` : 'N/A'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span>Tiempo de carga</span>
                <Badge 
                  variant="outline"
                  className={
                    page.load_time_ms < 1000
                      ? 'bg-green-100 text-green-800'
                      : page.load_time_ms < 3000
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {page.load_time_ms ? `${(page.load_time_ms / 1000).toFixed(2)}s` : 'N/A'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span>Imágenes sin alt</span>
                <Badge 
                  variant={page.images_without_alt > 0 ? 'destructive' : 'outline'}
                >
                  {page.images_without_alt}
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="issues" className="pt-4">
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
                        {issue.severity === 'high' ? (
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        ) : issue.severity === 'medium' ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-blue-500 mr-2" />
                        )}
                        {issue.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          issue.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : issue.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }
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
            <div className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No se encontraron problemas en esta página.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="links" className="pt-4">
          {links.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-blue-100 text-blue-800">
                  {internalLinks.length} enlaces internos
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  {externalLinks.length} enlaces externos
                </Badge>
                {brokenLinks.length > 0 && (
                  <Badge variant="destructive">
                    {brokenLinks.length} enlaces rotos
                  </Badge>
                )}
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Texto de ancla</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map(link => (
                    <TableRow key={link.id}>
                      <TableCell className="max-w-[300px] truncate">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`flex items-center ${link.is_broken ? 'text-red-500' : 'text-primary'} hover:underline`}
                        >
                          {link.url}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </TableCell>
                      <TableCell>{link.anchor_text || 'N/A'}</TableCell>
                      <TableCell>
                        {link.is_internal ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Interno
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800">
                            Externo
                          </Badge>
                        )}
                        {link.is_broken && (
                          <Badge variant="destructive" className="ml-2">
                            Roto
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No se encontraron enlaces en esta página.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetadataItemProps {
  label: string;
  value: string;
  warning?: boolean;
  isLink?: boolean;
}

const MetadataItem: React.FC<MetadataItemProps> = ({ label, value, warning = false, isLink = false }) => {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium">{label}</h4>
      <div className={`p-3 rounded-md ${warning ? 'bg-red-50' : 'bg-muted'}`}>
        {isLink ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center text-sm"
          >
            {value}
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        ) : (
          <span className={warning ? 'text-red-600' : ''}>{value}</span>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center justify-between bg-muted p-3 rounded-md">
      <div className="flex items-center">
        {icon}
        <span className="ml-2 text-sm">{label}</span>
      </div>
      <Badge variant="secondary">{value}</Badge>
    </div>
  );
};

export default PageDetail;
