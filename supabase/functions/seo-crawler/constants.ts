
// SEO Crawler constants

// CORS headers for Edge Function
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Bright Data API configuration
export const BRIGHT_DATA_CONFIG = {
  // Default credentials extracted from PHP example
  DEFAULT_USER: 'brd-customer-hl_cbc2d791-zone-web_unlocker1',
  DEFAULT_PASSWORD: '5d024usr515b',
  
  // Timeout config
  TIMEOUT: 120000, // 120 seconds
  
  // Bright Data API endpoints
  API_URL: 'https://api.brightdata.com',
  WEB_SCRAPER_API_URL: 'https://api.brightdata.com/scrape',
  
  // Error codes
  ERROR_CODES: {
    AUTHENTICATION_FAILED: 'authentication_failed',
    INVALID_URL: 'invalid_url',
    SERVER_ERROR: 'server_error'
  }
};

// SEO Issues definitions 
export const SEO_ISSUES = {
  MISSING_TITLE: {
    type: 'missing_title',
    severity: 'high',
    description: 'La página no tiene un título definido',
    fix: 'Añadir un título conciso que describa el contenido de la página'
  },
  TITLE_TOO_LONG: {
    type: 'title_too_long',
    severity: 'medium',
    description: 'El título de la página es demasiado largo (más de 60 caracteres)',
    fix: 'Acortar el título a menos de 60 caracteres para optimizar su visibilidad en los resultados de búsqueda'
  },
  MISSING_META_DESCRIPTION: {
    type: 'missing_meta_description',
    severity: 'high',
    description: 'La página no tiene meta descripción',
    fix: 'Añadir una meta descripción concisa y atractiva que describa el contenido de la página'
  },
  META_DESCRIPTION_TOO_LONG: {
    type: 'meta_description_too_long',
    severity: 'medium',
    description: 'La meta descripción es demasiado larga (más de 160 caracteres)',
    fix: 'Acortar la meta descripción a menos de 160 caracteres para optimizar su visibilidad en los resultados de búsqueda'
  },
  MISSING_H1: {
    type: 'missing_h1',
    severity: 'high',
    description: 'La página no tiene un encabezado H1',
    fix: 'Añadir un encabezado H1 que describa el contenido principal de la página'
  },
  MULTIPLE_H1: {
    type: 'multiple_h1',
    severity: 'medium',
    description: 'La página tiene múltiples encabezados H1',
    fix: 'Usar un solo encabezado H1 como título principal de la página'
  },
  NO_ALT_TEXT: {
    type: 'missing_alt_text',
    severity: 'medium',
    description: 'Hay imágenes sin texto alternativo (alt)',
    fix: 'Añadir texto alternativo descriptivo a todas las imágenes para mejorar la accesibilidad y SEO'
  },
  NO_SCHEMA_MARKUP: {
    type: 'no_schema_markup',
    severity: 'low',
    description: 'La página no tiene marcado de esquema (schema markup)',
    fix: 'Añadir marcado de esquema JSON-LD para proporcionar contexto adicional a los motores de búsqueda'
  }
};
