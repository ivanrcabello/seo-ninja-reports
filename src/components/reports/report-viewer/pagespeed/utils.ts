
/**
 * Format time metrics for display
 */
export const formatTimeMetric = (time: number | undefined, unit: string = 's') => {
  if (time === undefined || time === null) return '—';
  if (unit === 's' && time > 1000) {
    return `${(time / 1000).toFixed(2)}s`;
  }
  return `${time}${unit}`;
};

/**
 * Get color for a score
 */
export const getScoreColor = (score: number | undefined) => {
  if (score === undefined || score === null) return 'bg-gray-200 text-gray-700';
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

/**
 * Format score indicator text
 */
export const getScoreIndicator = (score: number | undefined) => {
  if (score === undefined || score === null) return '—';
  return `${Math.round(score)}%`;
};
