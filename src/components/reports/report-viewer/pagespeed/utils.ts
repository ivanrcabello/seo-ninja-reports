
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
