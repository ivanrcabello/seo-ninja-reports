
/**
 * Utility functions for working with SEO reports
 */

/**
 * Extracts different sections from AI-generated SEO report text
 */
export const extractSectionsFromText = (text: string) => {
  const sections = {
    summary: '',
    executiveSummary: '',
    technicalAnalysis: '',
    contentAnalysis: '',
    backlinksAnalysis: '',
    recommendations: ''
  };

  const execSummaryMatch = text.match(/(?:Resumen Ejecutivo|Executive Summary)(?:[\s\S]*?)(?=(?:Análisis Técnico|Technical Analysis|2\.|$))/i);
  if (execSummaryMatch) {
    sections.executiveSummary = execSummaryMatch[0].replace(/(?:Resumen Ejecutivo|Executive Summary)(?:\s*):?/i, '').trim();
    const summaryParagraph = sections.executiveSummary.split('\n\n')[0];
    if (summaryParagraph) {
      sections.summary = summaryParagraph;
    }
  }

  const techAnalysisMatch = text.match(/(?:Análisis Técnico|Technical Analysis)(?:[\s\S]*?)(?=(?:Análisis de Contenido|Content Analysis|3\.|$))/i);
  if (techAnalysisMatch) {
    sections.technicalAnalysis = techAnalysisMatch[0].replace(/(?:Análisis Técnico|Technical Analysis)(?:\s*):?/i, '').trim();
  }

  const contentAnalysisMatch = text.match(/(?:Análisis de Contenido|Content Analysis)(?:[\s\S]*?)(?=(?:Backlinks y Autoridad|Backlinks and Authority|4\.|$))/i);
  if (contentAnalysisMatch) {
    sections.contentAnalysis = contentAnalysisMatch[0].replace(/(?:Análisis de Contenido|Content Analysis)(?:\s*):?/i, '').trim();
  }

  const backlinksMatch = text.match(/(?:Backlinks y Autoridad|Backlinks and Authority)(?:[\s\S]*?)(?=(?:Recomendaciones|Recommendations|5\.|$))/i);
  if (backlinksMatch) {
    sections.backlinksAnalysis = backlinksMatch[0].replace(/(?:Backlinks y Autoridad|Backlinks and Authority)(?:\s*):?/i, '').trim();
  }

  const recommendationsMatch = text.match(/(?:Recomendaciones|Recommendations)(?:[\s\S]*?)(?=$)/i);
  if (recommendationsMatch) {
    sections.recommendations = recommendationsMatch[0].replace(/(?:Recomendaciones|Recommendations)(?:\s*):?/i, '').trim();
  }

  return sections;
};
