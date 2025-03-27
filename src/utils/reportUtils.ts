
/**
 * Extracts standardized sections from the OpenAI generated text
 */
export const extractSectionsFromText = (text: string): {
  summary: string;
  executiveSummary: string;
  technicalAnalysis: string;
  contentAnalysis: string;
  backlinksAnalysis: string;
  recommendations: string;
} => {
  // Create an object to store the sections
  const sections: any = {
    summary: '',
    executiveSummary: '',
    technicalAnalysis: '',
    contentAnalysis: '',
    backlinksAnalysis: '',
    recommendations: ''
  };
  
  // Extract summary - the first paragraph of the response
  const firstParagraph = text.split('\n\n')[0];
  if (firstParagraph) {
    sections.summary = firstParagraph.replace(/^#+ .*?\n/, '').trim();
  }
  
  // Regular expressions to match each section
  const sectionPatterns = [
    { name: 'executiveSummary', pattern: /##?\s*(?:Resumen|Resumen Ejecutivo|Executive Summary)([\s\S]*?)(?=##?\s|$)/i },
    { name: 'technicalAnalysis', pattern: /##?\s*(?:SEO Técnico|Análisis Técnico|Technical SEO|Technical Analysis)([\s\S]*?)(?=##?\s|$)/i },
    { name: 'contentAnalysis', pattern: /##?\s*(?:Contenido|Análisis de Contenido|Content|Content Analysis)([\s\S]*?)(?=##?\s|$)/i },
    { name: 'backlinksAnalysis', pattern: /##?\s*(?:Backlinks|Enlaces Entrantes|Link Building|Backlink Analysis)([\s\S]*?)(?=##?\s|$)/i },
    { name: 'recommendations', pattern: /##?\s*(?:Recomendaciones|Recommendations|Action Plan|Plan de Acción)([\s\S]*?)(?=##?\s|$)/i }
  ];
  
  // Extract each section
  sectionPatterns.forEach(({ name, pattern }) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      sections[name] = match[1].trim();
    }
  });
  
  // If we didn't find a section, try alternate patterns
  if (!sections.executiveSummary) {
    const introMatch = text.match(/##?\s*(?:Introducción|Introduction)([\s\S]*?)(?=##?\s|$)/i);
    if (introMatch) {
      sections.executiveSummary = introMatch[1].trim();
    }
  }
  
  if (!sections.technicalAnalysis) {
    const seoMatch = text.match(/##?\s*(?:SEO|Optimización para Buscadores)([\s\S]*?)(?=##?\s|$)/i);
    if (seoMatch) {
      sections.technicalAnalysis = seoMatch[1].trim();
    }
  }
  
  if (!sections.recommendations) {
    const conclusionMatch = text.match(/##?\s*(?:Conclusiones|Conclusions)([\s\S]*?)(?=##?\s|$)/i);
    if (conclusionMatch) {
      sections.recommendations = conclusionMatch[1].trim();
    }
  }
  
  return sections;
};
