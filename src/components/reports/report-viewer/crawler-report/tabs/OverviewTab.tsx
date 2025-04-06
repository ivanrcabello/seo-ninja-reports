
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlHeading } from '@/services/seo-crawler/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';
import { groupIssuesByType, groupIssuesBySeverity, groupHeadingsByPage, hasMultipleH1s, isMissingH1, CHART_COLORS, SEVERITY_COLORS } from '../utils/crawlerReportUtils';

interface OverviewTabProps {
  crawlResult: CrawlResult;
  pages: CrawlPage[];
  issues: CrawlIssue[];
  headings?: CrawlHeading[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  crawlResult,
  pages = [],
  issues = [],
  headings = []
}) => {
  const issuesByType = groupIssuesByType(issues);
  const issuesBySeverity = groupIssuesBySeverity(issues);
  const headingsByPage = groupHeadingsByPage(headings);
  
  const issueTypeChartData = Object.entries(issuesByType).map(([type, typeIssues]) => ({
    name: type,
    count: typeIssues.length
  })).sort((a, b) => b.count - a.count).slice(0, 10);
  
  const issueSeverityChartData = Object.entries(issuesBySeverity).map(([severity, sevIssues]) => ({
    name: severity,
    value: sevIssues.length
  }));
  
  const pagesWithMultipleH1 = Object.keys(headingsByPage).filter(pageId => 
    hasMultipleH1s(pageId, headingsByPage)
  ).length;
  
  const pagesWithMissingH1 = Object.keys(headingsByPage).filter(pageId => 
    isMissingH1(pageId, headingsByPage)
  ).length;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Páginas analizadas</CardTitle>
            <CardDescription>Total de páginas en el sitio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Problemas detectados</CardTitle>
            <CardDescription>Total de problemas SEO</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{issues.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Problemas críticos</CardTitle>
            <CardDescription>Necesitan atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{issuesBySeverity.critical?.length || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Problemas por tipo</CardTitle>
            <CardDescription>Los 10 tipos de problemas más comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={issueTypeChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Problemas por severidad</CardTitle>
            <CardDescription>Distribución de problemas según importancia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueSeverityChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {issueSeverityChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS] || CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Problemas de estructura de encabezados</CardTitle>
          <CardDescription>Problemas con la jerarquía de encabezados H1, H2, H3</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert variant={pagesWithMultipleH1 > 0 ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Páginas con múltiples H1</AlertTitle>
              <AlertDescription>
                {pagesWithMultipleH1} páginas tienen más de un encabezado H1
              </AlertDescription>
            </Alert>
            
            <Alert variant={pagesWithMissingH1 > 0 ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Páginas sin H1</AlertTitle>
              <AlertDescription>
                {pagesWithMissingH1} páginas no tienen encabezado H1
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumen del análisis</CardTitle>
          <CardDescription>Fecha: {new Date(crawlResult.started_at).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">URL analizada</h3>
            <a 
              href={crawlResult.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              {crawlResult.url}
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <div>
            <h3 className="font-medium">Duración del análisis</h3>
            <p>{crawlResult.total_time_seconds || 0} segundos</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewTab;
