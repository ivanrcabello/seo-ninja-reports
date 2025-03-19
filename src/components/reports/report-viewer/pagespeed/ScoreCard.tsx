
import React from 'react';
import { getScoreColorClass, getScoreBackgroundClass } from './utils';

interface ScoreCardProps {
  title: string;
  score: number | undefined;
  description: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description }) => {
  // Ensure score is a number between 0 and 100
  const displayScore = score !== undefined ? Math.round(score * 100) : 0;
  const colorClass = getScoreColorClass(score || 0);
  const bgClass = getScoreBackgroundClass(score || 0);
  
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/50">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className={`text-xl font-bold ${colorClass}`}>{displayScore}</div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
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
