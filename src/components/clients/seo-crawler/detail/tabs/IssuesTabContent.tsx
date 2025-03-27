
import React, { useState, useEffect } from 'react';
import { CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ExternalLink } from 'lucide-react';
import SeverityBadge from '../../detail/SeverityBadge';

interface IssuesTabContentProps {
  issuesByType: Record<string, CrawlIssue[]>;
  issuesBySeverity: Record<string, CrawlIssue[]>;
  pageIssues: CrawlIssue[];
  selectedPage: CrawlPage | null;
}

const IssuesTabContent: React.FC<IssuesTabContentProps> = ({
  issuesByType,
  issuesBySeverity,
  pageIssues,
  selectedPage
}) => {
  const [activeTab, setActiveTab] = useState<string>("type");
  const [hasIssues, setHasIssues] = useState<boolean>(false);
  
  useEffect(() => {
    // Verificar si hay problemas disponibles para mostrar
    const allIssues = Object.values(issuesByType).flat();
    const pageLevelIssues = pageIssues || [];
    
    console.log("All issues in IssuesTabContent:", allIssues);
    console.log("Has issues:", (allIssues.length > 0 || pageLevelIssues.length > 0), "all issues length:", allIssues.length, "pageIssues length:", pageLevelIssues.length);
    
    setHasIssues(allIssues.length > 0 || pageLevelIssues.length > 0);
  }, [issuesByType, pageIssues]);
  
  // Si no hay problemas, mostrar mensaje
  if (!hasIssues && pageIssues.length === 0 && Object.keys(issuesByType).length === 0 && Object.keys(issuesBySeverity).length === 0) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No se encontraron problemas</AlertTitle>
        <AlertDescription>
          No se encontraron problemas SEO en {selectedPage ? `la página ${selectedPage.url}` : 'las páginas analizadas'}.
        </AlertDescription>
      </Alert>
    );
  }

  // Si hay problemas de página específica (pero no generales), mostrar solo esos
  if (pageIssues && pageIssues.length > 0 && Object.keys(issuesByType).length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Problemas en {selectedPage?.url}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Severidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageIssues.map((issue, index) => (
                  <TableRow key={issue.id || `page-issue-${index}`}>
                    <TableCell className="font-medium">{issue.description}</TableCell>
                    <TableCell>{issue.issue_type}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={issue.severity || 'medium'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="type">Por Tipo</TabsTrigger>
          <TabsTrigger value="severity">Por Severidad</TabsTrigger>
          {selectedPage && pageIssues.length > 0 && (
            <TabsTrigger value="page">Página Actual</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="type" className="space-y-6 pt-4">
          {Object.keys(issuesByType).length > 0 ? (
            Object.entries(issuesByType).map(([type, issues]) => (
              <Card key={type} className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>{type.replace(/_/g, ' ')}</span>
                    <Badge variant="outline">{issues.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Severidad</TableHead>
                          {issues.some(issue => issue.page_url) && (
                            <TableHead>URL</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {issues.map((issue, index) => (
                          <TableRow key={issue.id || `${type}-issue-${index}`}>
                            <TableCell>{issue.description}</TableCell>
                            <TableCell>
                              <SeverityBadge severity={issue.severity || 'medium'} />
                            </TableCell>
                            {issues.some(issue => issue.page_url) && (
                              <TableCell className="max-w-[200px] truncate">
                                {issue.page_url && (
                                  <a 
                                    href={issue.page_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center"
                                  >
                                    {issue.page_url}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No hay problemas por tipo disponibles</AlertTitle>
              <AlertDescription>
                No se han encontrado problemas clasificados por tipo.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="severity" className="space-y-6 pt-4">
          {Object.keys(issuesBySeverity).length > 0 ? (
            Object.entries(issuesBySeverity).map(([severity, issues]) => (
              <Card key={severity} className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <SeverityBadge severity={severity} className="mr-2" />
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </span>
                    <Badge variant="outline">{issues.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Tipo</TableHead>
                          {issues.some(issue => issue.page_url) && (
                            <TableHead>URL</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {issues.map((issue, index) => (
                          <TableRow key={issue.id || `${severity}-issue-${index}`}>
                            <TableCell>{issue.description}</TableCell>
                            <TableCell>{issue.issue_type.replace(/_/g, ' ')}</TableCell>
                            {issues.some(issue => issue.page_url) && (
                              <TableCell className="max-w-[200px] truncate">
                                {issue.page_url && (
                                  <a 
                                    href={issue.page_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center"
                                  >
                                    {issue.page_url}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No hay problemas por severidad disponibles</AlertTitle>
              <AlertDescription>
                No se han encontrado problemas clasificados por severidad.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {selectedPage && (
          <TabsContent value="page" className="space-y-6 pt-4">
            {pageIssues.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Problemas en {selectedPage.url}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Severidad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageIssues.map((issue, index) => (
                        <TableRow key={issue.id || `page-issue-${index}`}>
                          <TableCell className="font-medium">{issue.description}</TableCell>
                          <TableCell>{issue.issue_type.replace(/_/g, ' ')}</TableCell>
                          <TableCell>
                            <SeverityBadge severity={issue.severity || 'medium'} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No hay problemas en esta página</AlertTitle>
                <AlertDescription>
                  No se encontraron problemas SEO en la página {selectedPage.url}.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default IssuesTabContent;
