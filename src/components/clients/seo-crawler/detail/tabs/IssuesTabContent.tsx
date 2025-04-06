
import React, { useState, useEffect } from 'react';
import { CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, AlertTriangle, XCircle } from 'lucide-react';
import SeverityBadge from '../SeverityBadge';

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
  const [activeTab, setActiveTab] = useState<string>('by-page');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filteredIssues, setFilteredIssues] = useState<CrawlIssue[]>([]);
  
  // Get all issues to use when no specific filter is applied
  const allIssues = Object.values(issuesByType).flat();
  
  console.log(`[IssuesTabContent] All issues:`, allIssues);
  console.log(`[IssuesTabContent] Has issues: ${allIssues.length > 0 || pageIssues.length > 0} all issues length: ${allIssues.length} pageIssues length: ${pageIssues.length}`);
  
  // Prepare issue types for the dropdown
  const issueTypes = Object.keys(issuesByType);
  
  useEffect(() => {
    if (activeTab === 'by-page' && selectedPage) {
      setFilteredIssues(pageIssues);
    } else if (activeTab === 'by-type') {
      if (selectedType === 'all') {
        setFilteredIssues(allIssues);
      } else {
        setFilteredIssues(issuesByType[selectedType] || []);
      }
    } else if (activeTab === 'by-severity') {
      // Show all issues grouped by severity
      setFilteredIssues(allIssues);
    } else {
      // Default to showing all issues
      setFilteredIssues(allIssues);
    }
  }, [activeTab, selectedType, selectedPage, pageIssues, issuesByType, allIssues]);
  
  // Handle case when there are no issues at all
  if ((allIssues.length === 0 && pageIssues.length === 0) || 
      (selectedPage && pageIssues.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="bg-green-100 rounded-full p-3">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium">¡No se encontraron problemas!</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {selectedPage 
            ? `La página "${selectedPage.url}" no tiene problemas SEO detectados.` 
            : 'No se encontraron problemas SEO en ninguna de las páginas analizadas.'}
        </p>
      </div>
    );
  }
  
  // Format issue data for display
  const formatIssueType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="by-page">Por página</TabsTrigger>
          <TabsTrigger value="by-type">Por tipo</TabsTrigger>
          <TabsTrigger value="by-severity">Por severidad</TabsTrigger>
        </TabsList>
        
        <TabsContent value="by-page">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {selectedPage
                  ? `Problemas en ${selectedPage.url}`
                  : 'Selecciona una página para ver sus problemas'}
              </h3>
            </div>
            
            {!selectedPage ? (
              <Alert>
                <AlertTitle>Selecciona una página</AlertTitle>
                <AlertDescription>
                  Selecciona una página en la pestaña "Páginas" para ver los problemas específicos.
                </AlertDescription>
              </Alert>
            ) : pageIssues.length === 0 ? (
              <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                <Check className="h-4 w-4" />
                <AlertTitle>No se encontraron problemas</AlertTitle>
                <AlertDescription>
                  No se encontraron problemas SEO en esta página.
                </AlertDescription>
              </Alert>
            ) : (
              <IssuesTable issues={pageIssues} />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="by-type">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Problemas por tipo</h3>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {issueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {formatIssueType(type)} ({issuesByType[type].length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {filteredIssues.length === 0 ? (
              <Alert>
                <AlertTitle>No se encontraron problemas de este tipo</AlertTitle>
                <AlertDescription>
                  No se encontraron problemas del tipo seleccionado.
                </AlertDescription>
              </Alert>
            ) : (
              <IssuesTable issues={filteredIssues} />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="by-severity">
          <div className="space-y-8">
            <h3 className="text-lg font-medium">Problemas por severidad</h3>
            
            {Object.entries(issuesBySeverity).map(([severity, issues]) => (
              <div key={severity} className="space-y-2">
                <div className="flex items-center">
                  <SeverityBadge severity={severity} />
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({issues.length} {issues.length === 1 ? 'problema' : 'problemas'})
                  </span>
                </div>
                
                {issues.length > 0 && (
                  <IssuesTable issues={issues} />
                )}
              </div>
            ))}
            
            {Object.keys(issuesBySeverity).length === 0 && (
              <Alert>
                <AlertTitle>No se encontraron problemas</AlertTitle>
                <AlertDescription>
                  No se encontraron problemas SEO en las páginas analizadas.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Table component for displaying issues
const IssuesTable: React.FC<{ issues: CrawlIssue[] }> = ({ issues }) => {
  // Get icon for issue (moved inside the component where it's used)
  const getIssueIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    }
  };
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problema</TableHead>
            <TableHead className="w-32">Severidad</TableHead>
            <TableHead className="w-44">URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue, index) => (
            <TableRow key={issue.id || `issue-${index}`}>
              <TableCell>
                <div className="flex items-start gap-2">
                  {getIssueIcon(issue.severity)}
                  <span>{issue.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <SeverityBadge severity={issue.severity} />
              </TableCell>
              <TableCell className="truncate max-w-[180px]">
                {issue.page_url || (issue as any).seo_crawler_pages?.url || ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default IssuesTabContent;
