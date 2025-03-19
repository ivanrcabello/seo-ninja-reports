
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

/**
 * Formats report content by parsing markdown-like syntax
 * @param text The raw report text
 * @returns Formatted text with proper HTML styling
 */
export const formatReportContent = (text: string) => {
  // Replace headers
  let formattedText = text
    .replace(/# (.*?)(\n|$)/g, '<h3 class="text-xl font-semibold mb-3 text-primary">$1</h3>')
    .replace(/## (.*?)(\n|$)/g, '<h4 class="text-lg font-medium mb-2 text-primary/90">$1</h4>');
  
  // Replace bullet points
  formattedText = formattedText.replace(/- (.*?)(\n|$)/g, '<li class="mb-1 flex items-center gap-2 before:content-[\'•\'] before:text-primary before:inline-block before:mr-2">$1</li>');
  
  // Split into paragraphs
  const paragraphs = formattedText.split('\n\n');
  
  return paragraphs
    .map(p => {
      if (p.trim() === '') return '';
      
      if (p.startsWith('<h3') || p.startsWith('<h4')) {
        return p;
      }
      if (p.includes('<li>')) {
        return `<ul class="list-none pl-0 mb-4 space-y-1">${p}</ul>`;
      }
      return `<p class="mb-4 leading-relaxed">${p}</p>`;
    })
    .join('');
};

/**
 * Detects priority level from recommendation text
 * @param text The recommendation text
 * @returns CSS classes for styling based on priority
 */
export const getRecommendationPriority = (text: string) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("alta") || lowerText.includes("crítica") || lowerText.includes("urgente") || 
      lowerText.includes("high") || lowerText.includes("critical") || lowerText.includes("urgent")) {
    return {
      color: "text-red-600",
      background: "bg-red-50",
      border: "border-red-200",
      icon: "🔴"
    };
  } 
  else if (lowerText.includes("media") || lowerText.includes("medium")) {
    return {
      color: "text-amber-600",
      background: "bg-amber-50",
      border: "border-amber-200",
      icon: "🟠"
    };
  }
  else if (lowerText.includes("baja") || lowerText.includes("low")) {
    return {
      color: "text-green-600",
      background: "bg-green-50",
      border: "border-green-200",
      icon: "🟢"
    };
  }
  
  return {
    color: "text-blue-600",
    background: "bg-blue-50",
    border: "border-blue-200",
    icon: "🔵"
  };
};
