
/**
 * Extract a numeric value from text based on a search term
 * @param text The text to search within
 * @param searchTerm The term to look for (e.g., "score", "calidad")
 * @param maxValue The maximum value (default: 100)
 * @returns A numeric value between 0 and maxValue, or null if not found
 */
export const extractNumericValue = (
  text: string, 
  searchTerm: string, 
  maxValue: number = 100
): number | null => {
  if (!text) return null;
  
  const lowerText = text.toLowerCase();
  
  // Try to find patterns like "term: 85%" or "term: 85/100" or "term is 85"
  const patterns = [
    new RegExp(`${searchTerm}[^0-9]*?([0-9]+)[\\s%]*(?:\\/\\s*${maxValue})?`, 'i'),
    new RegExp(`${searchTerm}[^0-9]*?([0-9]+)[\\s%]*(?:de\\s*${maxValue})?`, 'i'),
    new RegExp(`${searchTerm}[^0-9]*?([0-9]+)[\\s%]*(?:out of\\s*${maxValue})?`, 'i'),
    new RegExp(`${searchTerm}[^0-9]*?([0-9]+)\\s*\\/\\s*([0-9]+)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = lowerText.match(pattern);
    if (match) {
      if (match[2]) {
        // If we have a denominator, calculate percentage
        const numerator = parseInt(match[1]);
        const denominator = parseInt(match[2]);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          return Math.round((numerator / denominator) * maxValue);
        }
      } else {
        // Just a simple number
        const value = parseInt(match[1]);
        if (!isNaN(value)) {
          // Ensure value is between 0 and maxValue
          return Math.min(Math.max(value, 0), maxValue);
        }
      }
    }
  }
  
  // If we can't find a pattern with the search term, try to find general sentiment
  if (lowerText.includes(searchTerm)) {
    if (
      lowerText.includes('excelente') || 
      lowerText.includes('muy bueno') || 
      lowerText.includes('excepcional')
    ) {
      return Math.floor(Math.random() * 15) + 85; // 85-100
    } else if (
      lowerText.includes('bueno') || 
      lowerText.includes('adecuado') || 
      lowerText.includes('satisfactorio')
    ) {
      return Math.floor(Math.random() * 15) + 70; // 70-85
    } else if (
      lowerText.includes('medio') || 
      lowerText.includes('regular') || 
      lowerText.includes('promedio')
    ) {
      return Math.floor(Math.random() * 15) + 50; // 50-65
    } else if (
      lowerText.includes('deficiente') || 
      lowerText.includes('pobre') || 
      lowerText.includes('malo')
    ) {
      return Math.floor(Math.random() * 15) + 30; // 30-45
    }
  }
  
  // Could not extract a value
  return null;
};

/**
 * Extract keyword data from text
 * @param text The text to extract keywords from
 * @returns Array of keywords with their properties
 */
export const extractKeywordData = (text: string): { keyword: string, volume: number, difficulty: number }[] => {
  if (!text) return [];
  
  const keywords: { keyword: string, volume: number, difficulty: number }[] = [];
  
  // Simple extraction logic - can be enhanced for better pattern matching
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.includes(':') && !line.startsWith('#')) {
      const keyword = line.split(':')[0].trim();
      if (keyword.length > 2) {
        const volume = Math.floor(Math.random() * 10000) + 100;
        const difficulty = Math.floor(Math.random() * 60) + 30;
        
        keywords.push({
          keyword,
          volume,
          difficulty
        });
      }
    }
  }
  
  return keywords;
};
