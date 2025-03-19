
export const formatTimeMetric = (time: number | undefined, unit: string = 's'): string => {
  if (time === undefined) return '—';
  
  if (unit === 's') {
    const seconds = time / 1000;
    return `${seconds.toFixed(2)} s`;
  } else if (unit === 'ms') {
    return `${Math.round(time)} ms`;
  }
  
  return `${time} ${unit}`;
};

export const formatScoreValue = (score: number | undefined): string => {
  if (score === undefined) return '—';
  return Math.round(score * 100).toString();
};

// Devuelve una clase de color basada en el score (valor de 0 a 1)
export const getScoreColorClass = (score: number): string => {
  if (score >= 0.9) return 'text-green-500';
  if (score >= 0.5) return 'text-amber-500';
  return 'text-red-500';
};

// Devuelve una clase de fondo basada en el score (valor de 0 a 1)
export const getScoreBackgroundClass = (score: number): string => {
  if (score >= 0.9) return 'bg-green-500';
  if (score >= 0.5) return 'bg-amber-500';
  return 'bg-red-500';
};
