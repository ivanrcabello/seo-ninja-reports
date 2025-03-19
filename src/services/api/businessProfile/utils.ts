
/**
 * Valida si una URL es una URL válida de Google Maps o Google Business
 */
export function isValidGoogleBusinessUrl(url: string): boolean {
  try {
    // Verificar si es una URL válida
    const urlObj = new URL(url);
    
    // Verificar si es una URL de Google Maps o Business (incluidas versiones acortadas)
    return (
      urlObj.hostname.includes('google') ||
      urlObj.hostname.includes('maps') || 
      urlObj.hostname.includes('g.page') ||
      urlObj.hostname.includes('goo.gl') ||
      urlObj.hostname.includes('maps.app.goo.gl')
    );
  } catch (e) {
    return false;
  }
}
