
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

// Format a number with commas for thousands
export const formatNumber = (num: number): string => {
  return num.toLocaleString('es-ES');
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

// Returns a CSS class based on the metric value
export const getMetricClass = (metricName: string, value: number): string => {
  // Different metrics have different thresholds
  if (metricName === "First Contentful Paint") {
    if (value <= 1800) return "text-green-500";
    if (value <= 3000) return "text-amber-500";
    return "text-red-500";
  } 
  else if (metricName === "Speed Index") {
    if (value <= 3400) return "text-green-500";
    if (value <= 5800) return "text-amber-500";
    return "text-red-500";
  }
  else if (metricName === "Largest Contentful Paint") {
    if (value <= 2500) return "text-green-500";
    if (value <= 4000) return "text-amber-500";
    return "text-red-500";
  }
  else if (metricName === "Time to Interactive") {
    if (value <= 3800) return "text-green-500";
    if (value <= 7300) return "text-amber-500";
    return "text-red-500";
  }
  else if (metricName === "Total Blocking Time") {
    if (value <= 200) return "text-green-500";
    if (value <= 600) return "text-amber-500";
    return "text-red-500";
  }
  else if (metricName === "Cumulative Layout Shift") {
    if (value <= 0.1) return "text-green-500";
    if (value <= 0.25) return "text-amber-500";
    return "text-red-500";
  }
  
  // Default
  return "text-gray-500";
};

// Returns a descriptive label based on metric value
export const getMetricLabel = (metricName: string, value: number): string => {
  // Different metrics have different thresholds
  if (metricName === "First Contentful Paint") {
    if (value <= 1800) return "Bueno";
    if (value <= 3000) return "Necesita mejora";
    return "Pobre";
  } 
  else if (metricName === "Speed Index") {
    if (value <= 3400) return "Bueno";
    if (value <= 5800) return "Necesita mejora";
    return "Pobre";
  }
  else if (metricName === "Largest Contentful Paint") {
    if (value <= 2500) return "Bueno";
    if (value <= 4000) return "Necesita mejora";
    return "Pobre";
  }
  else if (metricName === "Time to Interactive") {
    if (value <= 3800) return "Bueno";
    if (value <= 7300) return "Necesita mejora";
    return "Pobre";
  }
  else if (metricName === "Total Blocking Time") {
    if (value <= 200) return "Bueno";
    if (value <= 600) return "Necesita mejora";
    return "Pobre";
  }
  else if (metricName === "Cumulative Layout Shift") {
    if (value <= 0.1) return "Bueno";
    if (value <= 0.25) return "Necesita mejora";
    return "Pobre";
  }
  
  // Default
  return "";
};
