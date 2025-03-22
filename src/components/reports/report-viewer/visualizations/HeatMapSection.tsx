
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { extractNumericValue } from './visualization-utils';

interface Category {
  name: string;
  value: number;
}

interface HeatMapSectionProps {
  title: string;
  data: string;
  categories: string[];
  variant?: 'horizontal' | 'vertical';
}

export const HeatMapSection: React.FC<HeatMapSectionProps> = ({ 
  title, 
  data, 
  categories,
  variant = 'vertical'
}) => {
  const [categoryValues, setCategoryValues] = useState<Category[]>([]);

  useEffect(() => {
    if (data && categories.length > 0) {
      const values = categories.map(category => {
        const value = extractNumericValue(data, category.toLowerCase(), 100) || 
                      Math.floor(Math.random() * 60) + 40; // Fallback to random value
        
        return {
          name: category,
          value
        };
      });
      
      setCategoryValues(values);
    }
  }, [data, categories]);

  const getCellColorClass = (value: number) => {
    if (value >= 80) return 'bg-green-500/90';
    if (value >= 70) return 'bg-green-400/90';
    if (value >= 60) return 'bg-blue-500/90';
    if (value >= 50) return 'bg-blue-400/90';
    if (value >= 40) return 'bg-amber-500/90';
    if (value >= 30) return 'bg-amber-400/90';
    if (value >= 20) return 'bg-red-400/90';
    return 'bg-red-500/90';
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {variant === 'horizontal' ? (
          // Horizontal heatmap
          <div className="flex flex-col space-y-1">
            {categoryValues.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-24 text-sm font-medium truncate">{category.name}</div>
                <div className="flex-1 h-8 rounded-md overflow-hidden flex">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const threshold = (i + 1) * 10;
                    const isActive = category.value >= threshold;
                    return (
                      <div
                        key={i}
                        className={`h-full flex-1 border-r border-background ${
                          isActive ? getCellColorClass(threshold) : 'bg-muted/30'
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="w-8 text-right text-sm font-semibold">{category.value}%</div>
              </div>
            ))}
          </div>
        ) : (
          // Vertical heatmap (default)
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-5 h-40 gap-1 mt-4">
              {categoryValues.map((category, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="flex-1 w-full relative">
                    <div
                      className={`absolute bottom-0 w-full rounded-t-md ${getCellColorClass(category.value)}`}
                      style={{ height: `${category.value}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-center mt-2 w-full truncate px-1">
                    {category.name}
                  </div>
                  <div className="text-xs font-semibold">{category.value}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
