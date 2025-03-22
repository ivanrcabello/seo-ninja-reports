
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SeoCompetitor } from '@/types/seo-reporting.types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CompetitorsChartProps {
  competitors: SeoCompetitor[];
  domain: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-primary">{`Palabras clave comunes: ${payload[0].value}`}</p>
        {payload[1] && (
          <p className="text-orange-500">{`Nivel de competencia: ${(payload[1].value * 100).toFixed(0)}%`}</p>
        )}
      </div>
    );
  }
  return null;
};

const CompetitorsChart: React.FC<CompetitorsChartProps> = ({ competitors, domain }) => {
  if (!competitors || competitors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Principales Competidores</CardTitle>
          <CardDescription>No hay datos de competidores disponibles</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60 text-muted-foreground">
          No se encontraron datos de competidores para {domain}
        </CardContent>
      </Card>
    );
  }

  // Sort competitors by keywords overlap and take top 5
  const sortedCompetitors = [...competitors]
    .sort((a, b) => (b.keywordsOverlap || 0) - (a.keywordsOverlap || 0))
    .slice(0, 5);

  // Prepare data for chart
  const data = sortedCompetitors.map(comp => ({
    name: comp.domain.replace(/^www\./, '').replace(/\.(com|es|net|org)$/, ''),
    keywordsOverlap: comp.keywordsOverlap || 0,
    competitionLevel: comp.competitionLevel || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Principales Competidores</CardTitle>
        <CardDescription>
          Competidores más relevantes para {domain}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 11 }}
                label={{ 
                  value: 'Palabras clave comunes', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '12px', fill: '#3b82f6' }
                }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                domain={[0, 1]}
                label={{ 
                  value: 'Nivel de competencia', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { fontSize: '12px', fill: '#f59e0b' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="keywordsOverlap" 
                name="Palabras clave comunes" 
                fill="#3b82f6" 
              />
              <Bar 
                yAxisId="right"
                dataKey="competitionLevel" 
                name="Nivel de competencia" 
                fill="#f59e0b" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorsChart;
