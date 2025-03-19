
/**
 * Valida si una URL es una URL válida de Google Maps o Google Business
 */
export function isValidGoogleBusinessUrl(url: string): boolean {
  try {
    // Verificar si es una URL válida
    const urlObj = new URL(url);
    
    // Verificar si es una URL de Google Maps o Business
    return (
      (urlObj.hostname.includes('google') && urlObj.hostname.includes('maps')) || 
      urlObj.hostname.includes('business.google.com') ||
      urlObj.hostname.includes('g.page')
    );
  } catch (e) {
    return false;
  }
}
