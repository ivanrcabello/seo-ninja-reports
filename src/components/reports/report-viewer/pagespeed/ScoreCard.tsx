
import React from 'react';

interface ScoreCardProps {
  label: string;
  score?: number;
  icon: React.ReactNode;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ label, score, icon }) => {
  const getScoreColor = (score: number | undefined) => {
    if (score === undefined || score === null) return 'bg-gray-100 text-gray-500';
    if (score >= 90) return 'bg-green-100 text-green-700';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-card border">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getScoreColor(score)}`}>
        <span className="text-lg font-bold">{score === undefined || score === null ? '—' : Math.round(score)}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-center font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
};

export default ScoreCard;
