
import { cn } from '@/lib/utils';

// Utility functions for score and rating calculations
export const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-green-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
};

export const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-500";
  if (rating >= 3.5) return "text-amber-500";
  return "text-red-500";
};

export const getScoreTextColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
};

export const getScoreBadgeClasses = (score: number | null) => {
  if (score === null) return "bg-gray-100 text-gray-800 border-gray-200";
  
  return cn(
    "border",
    score >= 90 ? "bg-green-100 text-green-800 border-green-200" :
    score >= 50 ? "bg-amber-100 text-amber-800 border-amber-200" :
    "bg-red-100 text-red-800 border-red-200"
  );
};

export const getScoreLabel = (score: number | null) => {
  if (score === null) return "No analizado";
  return score >= 90 ? "Rápido" : score >= 50 ? "Medio" : "Lento";
};
