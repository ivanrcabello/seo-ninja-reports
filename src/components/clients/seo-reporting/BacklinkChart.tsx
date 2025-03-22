
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface BacklinkChartProps {
  types?: { type: string; count: number }[];
  followData?: { type: string; count: number; percentage: number }[];
}

const BacklinkChart: React.FC<BacklinkChartProps> = ({ 
  types = [], 
  followData = [] 
}) => {
  // Colors for the pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Format data for the pie charts
  const typesData = types.map(item => ({
    name: item.type,
    value: item.count
  }));
  
  const followNofollow = followData.map(item => ({
    name: item.type,
    value: item.count,
    percentage: item.percentage
  }));
  
  if (types.length === 0 && followData.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-4 text-center">Tipos de Backlinks</h4>
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No hay datos disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-4 text-center">Follow vs Nofollow</h4>
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No hay datos disponibles</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-4 text-center">Tipos de Backlinks</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={typesData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {typesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} enlaces`, 'Cantidad']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-4 text-center">Follow vs Nofollow</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={followNofollow}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage?.toFixed(0) || 0}%`}
                >
                  {followNofollow.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} enlaces (${props.payload.percentage?.toFixed(1) || 0}%)`, 
                    'Cantidad'
                  ]} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BacklinkChart;
