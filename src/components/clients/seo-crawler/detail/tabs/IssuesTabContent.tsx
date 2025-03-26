import React, { useState, useMemo } from 'react';
import { CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';
import BlurredCard from '@/components/ui/BlurredCard';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AlertTriangle, Search, AlertCircle, Info, CheckCircle, Triangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IssuesTabContentProps {
  issuesByType: Record<string, CrawlIssue[]>;
  pageIssues: CrawlIssue[];
  selectedPage: CrawlPage | null;
}

const IssuesTabContent: React.FC<IssuesTabContentProps> = ({
  issuesByType,
  pageIssues,
  selectedPage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  
  const allIssues = useMemo(() => {
    // Flatten all issues from the issuesByType object
    return Object.values(issuesByType).flat();
  }, [issuesByType]);
  
  // Filter issues based on search term and severity
  const filteredIssues = useMemo(() => {
    let filtered = allIssues;
    
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issue_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.page_url && issue.page_url.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(issue => issue.severity === selectedSeverity);
    }
    
    return filtered;
  }, [allIssues, searchTerm, selectedSeverity]);
  
  // Filter page issues based on search term and severity
  const filteredPageIssues = useMemo(() => {
    let filtered = pageIssues;
    
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issue_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(issue => issue.severity === selectedSeverity);
    }
    
    return filtered;
  }, [pageIssues, searchTerm, selectedSeverity]);
  
  // Group issues by severity
  const issuesBySeverity = useMemo(() => {
    const result: Record<string, CrawlIssue[]> = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: []
    };
    
    allIssues.forEach(issue => {
      if (issue.severity in result) {
        result[issue.severity].push(issue);
      }
    });
    
    return result;
  }, [allIssues]);
  
  // Get severity icon based on severity level
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'medium':
        return <Triangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get severity badge based on severity level
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800">{getSeverityIcon(severity)} Crítico</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">{getSeverityIcon(severity)} Alto</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{getSeverityIcon(severity)} Medio</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{getSeverityIcon(severity)} Bajo</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{getSeverityIcon(severity)} Info</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };
  
  if (Object.keys(issuesByType).length === 0 && pageIssues.length === 0) {
    return (
      <BlurredCard className="p-6">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">No se encontraron problemas</h3>
          <p className="text-muted-foreground max-w-md">
            No se detectaron problemas SEO en este análisis. ¡Felicidades! Tu sitio web cumple con las mejores prácticas SEO.
          </p>
        </div>
      </BlurredCard>
    );
  }
  
  return (
    <BlurredCard>
      <CardHeader>
        <CardTitle>Análisis de Problemas SEO</CardTitle>
        <CardDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span>Total: {allIssues.length} problemas encontrados</span>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar problemas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select 
              value={selectedSeverity} 
              onValueChange={setSelectedSeverity}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filtrar por gravedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las gravedades</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="medium">Medio</SelectItem>
                <SelectItem value="low">Bajo</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <Tabs defaultValue={selectedPage ? "page" : "all"}>
          <TabsList>
            <TabsTrigger value="all">Todos los problemas ({allIssues.length})</TabsTrigger>
            <TabsTrigger value="page" disabled={!selectedPage}>
              Problemas de página {selectedPage ? `(${filteredPageIssues.length})` : ''}
            </TabsTrigger>
            <TabsTrigger value="by-severity">Por gravedad</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <IssuesList issues={filteredIssues} getSeverityBadge={getSeverityBadge} />
          </TabsContent>
          
          <TabsContent value="page" className="mt-4">
            {selectedPage ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-1">Problemas para: {selectedPage.url}</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredPageIssues.length} problemas encontrados para esta página
                  </p>
                </div>
                <IssuesList issues={filteredPageIssues} getSeverityBadge={getSeverityBadge} />
              </>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Selecciona una página para ver sus problemas específicos
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="by-severity" className="mt-4">
            <div className="space-y-6">
              {Object.entries(issuesBySeverity).map(([severity, issues]) => (
                issues.length > 0 && (
                  <div key={severity} className="space-y-2">
                    <h3 className="flex items-center text-lg font-medium">
                      {getSeverityIcon(severity)}
                      <span className="ml-2 capitalize">{severity === 'critical' ? 'Crítico' : 
                                                       severity === 'high' ? 'Alto' :
                                                       severity === 'medium' ? 'Medio' :
                                                       severity === 'low' ? 'Bajo' : 'Info'}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({issues.length} {issues.length === 1 ? 'problema' : 'problemas'})
                      </span>
                    </h3>
                    <IssuesList issues={issues} getSeverityBadge={getSeverityBadge} />
                  </div>
                )
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </BlurredCard>
  );
};

interface IssuesListProps {
  issues: CrawlIssue[];
  getSeverityBadge: (severity: string) => React.ReactNode;
}

const IssuesList: React.FC<IssuesListProps> = ({ issues, getSeverityBadge }) => {
  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron problemas que coincidan con los criterios de búsqueda
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo de problema</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Gravedad</TableHead>
            <TableHead>Página</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell className="font-medium">{issue.issue_type}</TableCell>
              <TableCell>{issue.description}</TableCell>
              <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
              <TableCell className="max-w-xs truncate">
                {issue.page_url ? (
                  <a 
                    href={issue.page_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate block"
                  >
                    {issue.page_url.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  'N/A'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default IssuesTabContent;
