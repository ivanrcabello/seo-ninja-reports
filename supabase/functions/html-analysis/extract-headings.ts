
/**
 * Extract all headings from HTML content
 */
export function extractHeadings(html: string) {
  if (!html) return [];
  
  console.log("Extracting headings from HTML");
  
  const headings = [];
  
  // Match all H1-H6 tags
  const h1Regex = /<h1[^>]*>(.*?)<\/h1>/gis;
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gis;
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gis;
  const h4Regex = /<h4[^>]*>(.*?)<\/h4>/gis;
  const h5Regex = /<h5[^>]*>(.*?)<\/h5>/gis;
  const h6Regex = /<h6[^>]*>(.*?)<\/h6>/gis;
  
  // Extract H1 headings
  let match;
  while ((match = h1Regex.exec(html)) !== null) {
    const content = cleanHtmlContent(match[1]);
    if (content) {
      headings.push({ type: 'h1', content });
    }
  }
  
  // Extract H2 headings
  while ((match = h2Regex.exec(html)) !== null) {
    const content = cleanHtmlContent(match[1]);
    if (content) {
      headings.push({ type: 'h2', content });
    }
  }
  
  // Extract H3 headings
  while ((match = h3Regex.exec(html)) !== null) {
    const content = cleanHtmlContent(match[1]);
    if (content) {
      headings.push({ type: 'h3', content });
    }
  }
  
  // Extract H4 headings
  while ((match = h4Regex.exec(html)) !== null) {
    const content = cleanHtmlContent(match[1]);
    if (content) {
      headings.push({ type: 'h4', content });
    }
  }
  
  // Extract H5 headings
  while ((match = h5Regex.exec(html)) !== null) {
    const content = cleanHtmlContent(match[1]);
    if (content) {
      headings.push({ type: 'h5', content });
    }
  }
  
  // Extract H6 headings
  while ((match = h6Regex.exec(html)) !== null) {
    const content = cleanHtmlContent(match[1]);
    if (content) {
      headings.push({ type: 'h6', content });
    }
  }
  
  console.log(`Found ${headings.length} headings (H1: ${headings.filter(h => h.type === 'h1').length}, H2: ${headings.filter(h => h.type === 'h2').length}, H3+: ${headings.filter(h => !['h1', 'h2'].includes(h.type)).length})`);
  
  return headings;
}

/**
 * Clean HTML content by removing HTML tags and trimming
 */
function cleanHtmlContent(content: string): string {
  if (!content) return '';
  
  // Remove HTML tags
  let cleanContent = content.replace(/<\/?[^>]+(>|$)/g, " ");
  
  // Replace multiple spaces with a single space
  cleanContent = cleanContent.replace(/\s+/g, " ");
  
  // Trim whitespace
  cleanContent = cleanContent.trim();
  
  return cleanContent;
}
