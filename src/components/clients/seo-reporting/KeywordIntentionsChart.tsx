
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface KeywordIntentionsChartProps {
  data: { intention: string; count: number; traffic: number; percentage: number }[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-sm">{`${payload[0].name}`}</p>
        <p className="text-sm">{`Palabras clave: ${payload[0].payload.count}`}</p>
        <p className="text-sm">{`Tráfico: ${payload[0].payload.traffic}`}</p>
        <p className="font-bold">{`${payload[0].payload.percentage}%`}</p>
      </div>
    );
  }
  return null;
};

const KeywordIntentionsChart: React.FC<KeywordIntentionsChartProps> = ({ data }) => {
  // Format data for pie chart
  const chartData = data.map(item => ({
    name: item.intention,
    value: item.percentage,
    count: item.count,
    traffic: item.traffic,
    percentage: item.percentage
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percentage }) => `${name} (${percentage}%)`}
            labelLine={true}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            formatter={(value, entry: any) => {
              return (
                <span style={{ color: entry.color, fontWeight: 500 }}>
                  {value} ({entry.payload.percentage}%)
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeywordIntentionsChart;
