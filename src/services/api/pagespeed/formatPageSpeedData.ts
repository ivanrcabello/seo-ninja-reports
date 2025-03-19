
import { PageSpeedResult } from '@/types/report.types';

/**
 * Formats PageSpeed data as string for use in prompts
 */
export const formatPageSpeedData = (pageSpeedData: {
  desktop: PageSpeedResult;
  mobile: PageSpeedResult;
}) => {
  return `
Datos de PageSpeed Insights:

MÓVIL:
- Rendimiento: ${pageSpeedData.mobile.performance?.toFixed(0)}%
- Accesibilidad: ${pageSpeedData.mobile.accessibility?.toFixed(0)}%
- Mejores Prácticas: ${pageSpeedData.mobile.bestPractices?.toFixed(0)}%
- SEO: ${pageSpeedData.mobile.seo?.toFixed(0)}%
- Métricas Clave: 
  * First Contentful Paint: ${(pageSpeedData.mobile.firstContentfulPaint ? (pageSpeedData.mobile.firstContentfulPaint / 1000).toFixed(2) : 'N/A')}s
  * Largest Contentful Paint: ${(pageSpeedData.mobile.largestContentfulPaint ? (pageSpeedData.mobile.largestContentfulPaint / 1000).toFixed(2) : 'N/A')}s
  * Time to Interactive: ${(pageSpeedData.mobile.timeToInteractive ? (pageSpeedData.mobile.timeToInteractive / 1000).toFixed(2) : 'N/A')}s
  * Total Blocking Time: ${(pageSpeedData.mobile.totalBlockingTime ? pageSpeedData.mobile.totalBlockingTime.toFixed(0) : 'N/A')}ms
  * Cumulative Layout Shift: ${pageSpeedData.mobile.cumulativeLayoutShift?.toFixed(2) || 'N/A'}

ESCRITORIO:
- Rendimiento: ${pageSpeedData.desktop.performance?.toFixed(0)}%
- Accesibilidad: ${pageSpeedData.desktop.accessibility?.toFixed(0)}%
- Mejores Prácticas: ${pageSpeedData.desktop.bestPractices?.toFixed(0)}%
- SEO: ${pageSpeedData.desktop.seo?.toFixed(0)}%
- Métricas Clave: 
  * First Contentful Paint: ${(pageSpeedData.desktop.firstContentfulPaint ? (pageSpeedData.desktop.firstContentfulPaint / 1000).toFixed(2) : 'N/A')}s
  * Largest Contentful Paint: ${(pageSpeedData.desktop.largestContentfulPaint ? (pageSpeedData.desktop.largestContentfulPaint / 1000).toFixed(2) : 'N/A')}s
  * Time to Interactive: ${(pageSpeedData.desktop.timeToInteractive ? (pageSpeedData.desktop.timeToInteractive / 1000).toFixed(2) : 'N/A')}s
  * Total Blocking Time: ${(pageSpeedData.desktop.totalBlockingTime ? pageSpeedData.desktop.totalBlockingTime.toFixed(0) : 'N/A')}ms
  * Cumulative Layout Shift: ${pageSpeedData.desktop.cumulativeLayoutShift?.toFixed(2) || 'N/A'}
`;
};
