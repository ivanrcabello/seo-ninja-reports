
import React from 'react';
import { SeoCompetitor } from '@/types/seo-reporting.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface CompetitorsChartProps {
  competitors: SeoCompetitor[];
  domain: string;
}

const CompetitorsChart: React.FC<CompetitorsChartProps> = ({ competitors, domain }) => {
  // Prepare data for the chart
  const chartData = competitors.map(comp => ({
    name: comp.domain.replace(/^www\./, '').split('.')[0], // Simplify domain name for chart
    overlap: comp.keywordsOverlap || 0,
    competition: Math.round((comp.competitionLevel || 0) * 100),
    fullDomain: comp.domain // Keep full domain for tooltip
  }));

  const colorConfig = {
    overlap: { color: "#60a5fa" }, // blue-400
    competition: { color: "#f97316" } // orange-500
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Competidores</CardTitle>
        <CardDescription>
          Dominios que compiten por las mismas palabras clave que {domain}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {competitors.length > 0 ? (
          <>
            <div className="h-[300px] px-4">
              <ChartContainer 
                config={colorConfig}
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={10}
                  >
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" label={{ value: 'Keywords Overlap', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Competition Level (%)', angle: 90, position: 'insideRight' }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="font-medium">{payload[0]?.payload.fullDomain}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-blue-400 mr-1.5"></div>
                                  Keywords overlap: {payload[0]?.value}
                                </div>
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-orange-500 mr-1.5"></div>
                                  Competition level: {payload[1]?.value}%
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="overlap" fill="#60a5fa" yAxisId="left" name="Keywords Overlap" />
                    <Bar dataKey="competition" fill="#f97316" yAxisId="right" name="Competition Level (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dominio</TableHead>
                  <TableHead className="text-right">Keywords Overlap</TableHead>
                  <TableHead className="text-right">Nivel de Competencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors.map((competitor) => (
                  <TableRow key={competitor.id || competitor.domain}>
                    <TableCell className="font-medium">{competitor.domain}</TableCell>
                    <TableCell className="text-right">{competitor.keywordsOverlap || 'N/A'}</TableCell>
                    <TableCell className="text-right">{competitor.competitionLevel 
                      ? `${(competitor.competitionLevel * 100).toFixed(1)}%` 
                      : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay datos de competidores disponibles
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorsChart;
