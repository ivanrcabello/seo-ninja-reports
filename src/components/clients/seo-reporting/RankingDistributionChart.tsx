
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface RankingDistributionChartProps {
  data: { range: string; count: number }[];
  showLegend?: boolean;
  height?: number;
}

const RankingDistributionChart: React.FC<RankingDistributionChartProps> = ({ 
  data,
  showLegend = false,
  height = 250
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No hay datos de distribución de rankings disponibles
      </div>
    );
  }

  // Define colors for each position range
  const getBarColor = (range: string) => {
    switch (range) {
      case '1-3':
        return '#22c55e'; // Green
      case '4-10':
        return '#10b981'; // Emerald
      case '11-20':
        return '#3b82f6'; // Blue
      case '21-30':
        return '#6366f1'; // Indigo
      case '31-40':
        return '#a855f7'; // Purple
      case '41-50':
        return '#ec4899'; // Pink
      case '51-100':
        return '#f43f5e'; // Rose
      case 'SERP Features':
        return '#f59e0b'; // Amber
      default:
        return '#64748b'; // Slate
    }
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} palabras clave`, 'Cantidad']}
            labelFormatter={(label) => `Posición ${label}`}
          />
          {showLegend && (
            <Legend 
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span style={{ fontSize: 12 }}>Posición {value}</span>}
            />
          )}
          <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.range)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankingDistributionChart;
