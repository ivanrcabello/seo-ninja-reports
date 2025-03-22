
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SeoTrafficChartProps {
  data: { date: string; value: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-sm">{`${label}`}</p>
        <p className="text-primary font-bold">{`Tráfico: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const SeoTrafficChart: React.FC<SeoTrafficChartProps> = ({ data }) => {
  // Format dates for display
  const formattedData = data.map(item => {
    const [year, month] = item.date.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      name: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
      value: item.value
    };
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="value" 
            name="Tráfico Orgánico" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorTraffic)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeoTrafficChart;
