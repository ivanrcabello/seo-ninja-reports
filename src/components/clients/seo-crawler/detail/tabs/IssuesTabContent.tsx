
import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { CrawlIssue } from '@/services/seo-crawler';
import BlurredCard from '@/components/ui/BlurredCard';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getIssueTypeIcon, getSeverityColor } from '../utils/crawlerUtils';

interface IssuesTabContentProps {
  issuesByType: Record<string, CrawlIssue[]>;
}

const IssuesTabContent: React.FC<IssuesTabContentProps> = ({ issuesByType }) => {
  return (
    <BlurredCard>
      <CardHeader>
        <CardTitle>Problemas agrupados por tipo</CardTitle>
        <CardDescription>
          Los problemas encontrados durante el análisis
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {Object.keys(issuesByType).length > 0 ? (
            Object.entries(issuesByType).map(([issueType, issues]) => (
              <AccordionItem value={issueType} key={issueType}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                  <div className="flex items-center">
                    {getIssueTypeIcon(issueType)}
                    <span className="ml-2">
                      {issueType.replace(/_/g, ' ')} ({issues.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 px-6">
                  <div className="space-y-4">
                    <p className="text-sm font-medium">
                      {issues[0].description}
                    </p>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Páginas afectadas:</h4>
                      <div className="max-h-64 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>URL</TableHead>
                              <TableHead>Severidad</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {issues.map((issue: any) => (
                              <TableRow key={issue.id}>
                                <TableCell className="font-medium flex items-center">
                                  <a 
                                    href={issue.page_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center"
                                  >
                                    {issue.page_url.length > 60 
                                      ? issue.page_url.substring(0, 60) + '...' 
                                      : issue.page_url}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline" 
                                    className={getSeverityColor(issue.severity)}
                                  >
                                    {issue.severity}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Solución recomendada:</h4>
                      <p className="text-sm">{issues[0].recommended_fix}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium">¡No se encontraron problemas!</h3>
              <p className="text-muted-foreground">
                El sitio web no presenta problemas técnicos SEO.
              </p>
            </div>
          )}
        </Accordion>
      </CardContent>
    </BlurredCard>
  );
};

export default IssuesTabContent;
