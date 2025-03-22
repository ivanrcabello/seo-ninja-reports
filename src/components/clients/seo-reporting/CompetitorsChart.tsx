
import React from 'react';
import { SeoCompetitor } from '@/types/seo-reporting.types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface CompetitorsChartProps {
  competitors: SeoCompetitor[];
  domain: string;
}

const CompetitorsChart: React.FC<CompetitorsChartProps> = ({ competitors, domain }) => {
  if (!competitors || competitors.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No hay datos de competidores disponibles
      </div>
    );
  }

  // Sort by keywords overlap in descending order
  const sortedCompetitors = [...competitors]
    .filter(c => c.keywordsOverlap)
    .sort((a, b) => (b.keywordsOverlap || 0) - (a.keywordsOverlap || 0))
    .slice(0, 8);  // Limit to top 8 competitors for better visualization

  // Format domain names (remove https://, www. and trailing slashes)
  const formatDomain = (domainStr: string) => {
    return domainStr
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .split('.')[0];  // Get only the first part of the domain
  };

  // Prepare data for chart
  const chartData = sortedCompetitors.map(competitor => ({
    name: formatDomain(competitor.domain),
    keywords: competitor.keywordsOverlap || 0,
    competitionLevel: competitor.competitionLevel || 0,
    fullDomain: competitor.domain
  }));

  // Generate colors based on competition level
  const getBarColor = (level: number) => {
    if (level > 0.8) return '#ef4444';  // High competition (red)
    if (level > 0.5) return '#f97316';  // Medium competition (orange)
    if (level > 0.3) return '#facc15';  // Low-medium competition (yellow)
    return '#84cc16';                   // Low competition (green)
  };

  return (
    <div className="space-y-6">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              tick={{ fontSize: 12 }}
              height={60}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, 'Palabras clave comunes']}
              labelFormatter={(label) => {
                const item = chartData.find(c => c.name === label);
                return item ? `Competidor: ${item.fullDomain}` : label;
              }}
            />
            <Bar dataKey="keywords" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.competitionLevel)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="font-medium mb-2">Información sobre competidores</h4>
        <p className="text-sm text-muted-foreground">
          El gráfico muestra los principales competidores de <strong>{domain}</strong> en base al 
          número de palabras clave en común. El color de cada barra indica el nivel de competencia, 
          desde verde (baja) hasta rojo (alta).
        </p>
      </div>
    </div>
  );
};

export default CompetitorsChart;
