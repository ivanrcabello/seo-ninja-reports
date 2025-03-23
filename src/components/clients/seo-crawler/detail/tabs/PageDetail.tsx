
import React from 'react';
import { ExternalLink, CheckCircle, XCircle, FileText, Image, Link, Link2, Code } from 'lucide-react';
import { CrawlPage, CrawlIssue, CrawlLink } from '@/services/seo-crawler';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getIssueTypeIcon, getSeverityColor } from '../utils/crawlerUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageDetailProps {
  page: CrawlPage;
  issues: CrawlIssue[];
  links?: CrawlLink[];
}

const PageDetail: React.FC<PageDetailProps> = ({ page, issues, links = [] }) => {
  const internalLinks = links.filter(link => link.is_internal);
  const externalLinks = links.filter(link => !link.is_internal);
  const brokenLinks = links.filter(link => link.is_broken);

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
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="technical">Técnico</TabsTrigger>
            <TabsTrigger value="issues">Problemas ({issues.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
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

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Estadísticas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <StatBadge 
                      icon={<FileText className="h-4 w-4" />} 
                      label="Palabras" 
                      value={page.word_count || 0} 
                    />
                    <StatBadge 
                      icon={<Image className="h-4 w-4" />} 
                      label="Imágenes" 
                      value={page.image_count || 0} 
                    />
                    <StatBadge 
                      icon={<Link className="h-4 w-4" />} 
                      label="Links internos" 
                      value={page.internal_links_count || internalLinks.length} 
                    />
                    <StatBadge 
                      icon={<Link2 className="h-4 w-4" />} 
                      label="Links externos" 
                      value={page.external_links_count || externalLinks.length} 
                    />
                  </div>
                </div>
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

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tamaño de página</h3>
                  <div className="p-3 bg-muted rounded-md">
                    {page.page_size_kb ? `${page.page_size_kb} KB` : "No disponible"}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Estructura del contenido</h3>
                  <StatItem label="H1" value={page.h1 ? "1" : "0"} />
                  <StatItem label="H2" value={page.h2_count?.toString() || "0"} />
                  <StatItem label="H3" value={page.h3_count?.toString() || "0"} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Elementos multimedia</h3>
                  <StatItem 
                    label="Imágenes" 
                    value={page.image_count?.toString() || "0"} 
                  />
                  <StatItem 
                    label="Imágenes sin texto alt" 
                    value={page.images_without_alt?.toString() || "0"} 
                    warning={page.images_without_alt && page.images_without_alt > 0}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Estadísticas de contenido</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard 
                    title="Palabras" 
                    value={page.word_count || 0} 
                    icon={<FileText className="h-5 w-5 text-blue-500" />}
                    warning={page.word_count < 300}
                  />
                  <StatCard 
                    title="Tiempo de carga" 
                    value={`${Math.round((page.load_time_ms || 0) / 100) / 10}s`} 
                    icon={<FileText className="h-5 w-5 text-green-500" />}
                    warning={(page.load_time_ms || 0) > 2000}
                  />
                  <StatCard 
                    title="Tamaño" 
                    value={page.page_size_kb ? `${page.page_size_kb} KB` : "N/A"} 
                    icon={<FileText className="h-5 w-5 text-purple-500" />}
                    warning={page.page_size_kb && page.page_size_kb > 500}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="technical">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Metadatos</h3>
                  <StatItem 
                    label="Meta robots" 
                    value={page.meta_robots || page.robots_directives || "No definido"} 
                  />
                  <StatItem 
                    label="Canonical URL" 
                    value={page.canonical_url || "No definido"} 
                    warning={!page.canonical_url}
                  />
                  <StatItem 
                    label="Mobile friendly" 
                    value={page.mobile_friendly ? "Sí" : "No"} 
                    warning={page.mobile_friendly === false}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Marcado estructurado</h3>
                  <StatItem 
                    label="Schema.org markup" 
                    value={page.has_schema_markup ? "Presente" : "No presente"} 
                    warning={!page.has_schema_markup}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Enlaces</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard 
                    title="Enlaces internos" 
                    value={page.internal_links_count || internalLinks.length} 
                    icon={<Link className="h-5 w-5 text-blue-500" />}
                  />
                  <StatCard 
                    title="Enlaces externos" 
                    value={page.external_links_count || externalLinks.length} 
                    icon={<Link2 className="h-5 w-5 text-green-500" />}
                  />
                  <StatCard 
                    title="Enlaces rotos" 
                    value={brokenLinks.length} 
                    icon={<XCircle className="h-5 w-5 text-red-500" />}
                    warning={brokenLinks.length > 0}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="issues">
            <div className="space-y-4">
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
          </TabsContent>
        </Tabs>
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

interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

const StatBadge: React.FC<StatBadgeProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-muted p-2 rounded-md flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <span className="ml-1 text-sm">{label}</span>
      </div>
      <Badge variant="secondary">{value}</Badge>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
  warning?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, warning = false }) => {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span>{label}</span>
      <Badge variant={warning ? "destructive" : "outline"}>{value}</Badge>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  warning?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, warning = false }) => {
  return (
    <div className={`border p-4 rounded-lg ${warning ? 'border-yellow-300' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-semibold mt-1 ${warning ? 'text-yellow-600' : ''}`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
};

export default PageDetail;
