
/**
 * Formats time metrics for display
 */
export const formatTimeMetric = (time: number | undefined, unit: string = 's'): string => {
  if (time === undefined || time === null) return '—';
  
  if (unit === 's' && typeof time === 'number') {
    // Convert from ms to seconds if needed (PageSpeed API returns in ms)
    const seconds = time > 1000 ? time / 1000 : time;
    return `${seconds.toFixed(2)}${unit}`;
  }
  
  return `${Math.round(time)}${unit}`;
};

/**
 * Ensures numeric score values are properly formatted
 */
export const formatScoreValue = (score: number | undefined): number => {
  if (score === undefined || score === null) return 0;
  
  // Some scores come as decimals between 0-1, others as percentages
  if (score <= 1) {
    return Math.round(score * 100);
  }
  
  return Math.round(score);
};

/**
 * Gets CSS class for score color based on value
 */
export const getScoreColorClass = (score: number | undefined): string => {
  if (score === undefined || score === null) return 'text-gray-400';
  
  const normalizedScore = score <= 1 ? score * 100 : score;
  
  if (normalizedScore >= 90) return 'text-green-500';
  if (normalizedScore >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Gets CSS background class for score based on value
 */
export const getScoreBackgroundClass = (score: number | undefined): string => {
  if (score === undefined || score === null) return 'bg-gray-100';
  
  const normalizedScore = score <= 1 ? score * 100 : score;
  
  if (normalizedScore >= 90) return 'bg-green-100 text-green-800';
  if (normalizedScore >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};
