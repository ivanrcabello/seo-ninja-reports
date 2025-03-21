
import React from 'react';
import { getScoreColorClass, getScoreBackgroundClass } from './utils';

export interface ScoreCardProps {
  title: string;
  score?: number;
  value?: number; // Adding for backward compatibility
  type?: string;
  description?: string;
  primary?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score, 
  value, 
  description, 
  type, 
  primary = false 
}) => {
  // Use value if score is not provided (for backward compatibility)
  const scoreValue = score !== undefined ? score : value;
  
  // Ensure score is a number between 0 and 100
  const displayScore = scoreValue !== undefined ? Math.round(scoreValue * 100) : 0;
  const colorClass = getScoreColorClass(scoreValue || 0);
  const bgClass = getScoreBackgroundClass(scoreValue || 0);
  
  return (
    <div className={`flex flex-col gap-1 p-3 rounded-lg ${primary ? 'bg-muted/50' : 'bg-muted/30'} border border-border/50`}>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className={`text-xl font-bold ${colorClass}`}>{displayScore}</div>
      </div>
      <p className="text-xs text-muted-foreground">{description || `Score for ${title.toLowerCase()}`}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
        <div 
          className={`h-1.5 rounded-full ${bgClass}`} 
          style={{ width: `${displayScore}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScoreCard;
