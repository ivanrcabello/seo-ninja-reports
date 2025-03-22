
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface RankingDistributionChartProps {
  data: { range: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-sm">{`Posiciones: ${label}`}</p>
        <p className="text-primary font-bold">{`Palabras clave: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const RankingDistributionChart: React.FC<RankingDistributionChartProps> = ({ data }) => {
  // Define colors for different position ranges
  const getBarColor = (range: string) => {
    if (range === "1-3") return "#16a34a"; // Green for top positions
    if (range === "4-10") return "#22c55e";
    if (range.startsWith("11-")) return "#3b82f6"; // Blue
    if (range.startsWith("21-")) return "#60a5fa";
    if (range.startsWith("31-")) return "#f59e0b"; // Yellow
    if (range.startsWith("41-")) return "#fbbf24";
    if (range.startsWith("51-")) return "#ef4444"; // Red
    return "#8b5cf6"; // Purple for SERP Features or other
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barSize={35}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Palabras clave">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankingDistributionChart;
