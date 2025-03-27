
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

/**
 * Formats the markdown or plain text content to HTML
 */
export const formatReportContent = (content: string): string => {
  if (!content) return '';
  
  // Check if content is already HTML
  if (content.includes('<h1>') || content.includes('<p>') || content.includes('<li>')) {
    return content;
  }
  
  // Convert markdown headings to HTML
  let html = content
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  
  // Convert markdown lists to HTML
  html = html.replace(/^\s*[-*+]\s+(.*$)/gm, '<li>$1</li>');
  
  // Add <ul> tags around consecutive <li> elements
  const lines = html.split('\n');
  let inList = false;
  let result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('<li>')) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push(line);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(line);
    }
  }
  
  if (inList) {
    result.push('</ul>');
  }
  
  html = result.join('\n');
  
  // Convert markdown emphasis
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert line breaks to <br> and double line breaks to paragraphs
  const paragraphs = html.split('\n\n');
  html = paragraphs.map(p => {
    if (p.trim() === '') return '';
    if (p.startsWith('<h') || p.startsWith('<ul>') || p.startsWith('<li>') || p.includes('</li>')) return p;
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');
  
  return html;
};

/**
 * Determines the priority level for a recommendation
 */
export const getRecommendationPriority = (text: string): { 
  level: 'high' | 'medium' | 'low', 
  label: string, 
  color: string,
  background: string,
  border: string
} => {
  const lowerText = text.toLowerCase();
  
  // Check for explicit priority markers
  if (lowerText.includes('prioridad: alta') || lowerText.includes('alta prioridad') || 
      lowerText.includes('urgente') || lowerText.includes('inmediata') || 
      lowerText.includes('priority: high') || lowerText.includes('high priority') ||
      lowerText.includes('critical') || lowerText.includes('crítica')) {
    return {
      level: 'high',
      label: 'Alta',
      color: 'text-red-600',
      background: 'bg-red-50',
      border: 'border-red-100'
    };
  }
  
  if (lowerText.includes('prioridad: baja') || lowerText.includes('baja prioridad') || 
      lowerText.includes('opcional') || lowerText.includes('priority: low') || 
      lowerText.includes('low priority') || lowerText.includes('can be postponed')) {
    return {
      level: 'low',
      label: 'Baja',
      color: 'text-green-600',
      background: 'bg-green-50',
      border: 'border-green-100'
    };
  }
  
  // Check for keywords that might indicate high priority
  const highPriorityKeywords = [
    'crucial', 'esencial', 'indispensable', 'vital', 'importante', 'necesario',
    'imprescindible', 'error', 'crítico', 'grave', 'mayor', 'significativo',
    'substantial', 'severe', 'major', 'critical', 'essential', 'vital', 'urgent'
  ];
  
  for (const keyword of highPriorityKeywords) {
    if (lowerText.includes(keyword)) {
      return {
        level: 'high',
        label: 'Alta',
        color: 'text-red-600',
        background: 'bg-red-50',
        border: 'border-red-100'
      };
    }
  }
  
  // Check for keywords that might indicate low priority
  const lowPriorityKeywords = [
    'minor', 'pequeño', 'adicional', 'opcional', 'complementario', 'podría',
    'sugerencia', 'recomendable', 'menor', 'insignificante', 'suggestion',
    'could', 'might', 'optional', 'nice to have', 'additional', 'plus'
  ];
  
  for (const keyword of lowPriorityKeywords) {
    if (lowerText.includes(keyword)) {
      return {
        level: 'low',
        label: 'Baja',
        color: 'text-green-600',
        background: 'bg-green-50',
        border: 'border-green-100'
      };
    }
  }
  
  // Default to medium priority
  return {
    level: 'medium',
    label: 'Media',
    color: 'text-yellow-600',
    background: 'bg-yellow-50',
    border: 'border-yellow-100'
  };
};
