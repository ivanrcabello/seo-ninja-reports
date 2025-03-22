
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface BacklinkChartProps {
  data: { type: string; count: number }[];
  domain: string;
  type: 'types' | 'follow';
}

const TYPE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
const FOLLOW_COLORS = ['#3b82f6', '#f59e0b'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const percentage = ((payload[0].value / payload[0].payload.total) * 100).toFixed(1);
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-sm">{`${payload[0].name}`}</p>
        <p className="text-primary font-bold">{`${payload[0].value} (${percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

const BacklinkChart: React.FC<BacklinkChartProps> = ({ data, domain, type }) => {
  // Calculate the total count for percentage calculation
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  // Format data for pie chart
  const chartData = data.map(item => ({
    name: item.type,
    value: item.count,
    total
  }));

  // Choose colors based on chart type
  const colors = type === 'types' ? TYPE_COLORS : FOLLOW_COLORS;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={type === 'follow' ? 60 : 0}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={true}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            formatter={(value, entry: any) => {
              const percentage = ((entry.payload.value / entry.payload.total) * 100).toFixed(1);
              return (
                <span style={{ color: entry.color, fontWeight: 500 }}>
                  {value} ({percentage}%)
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BacklinkChart;
