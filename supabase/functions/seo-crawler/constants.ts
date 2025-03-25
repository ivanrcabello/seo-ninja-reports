
// Constants for SEO crawler

// CORS headers for HTTP responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bright Data configuration
export const BRIGHT_DATA_CONFIG = {
  DEFAULT_USER: 'defaultuser',
  DEFAULT_PASSWORD: '', // This should be empty, it will be filled from environment variables
  TIMEOUT: 60000, // 60 seconds timeout for API calls
  API_ENDPOINT: 'https://api.brightdata.com/request',
};

// SEO issues definitions with descriptions and severity
export const SEO_ISSUES = {
  MISSING_TITLE: {
    type: 'missing_title',
    severity: 'critical',
    description: 'La página no tiene título',
    fix: 'Añadir una etiqueta <title> con un título descriptivo y único para la página'
  },
  MISSING_META_DESCRIPTION: {
    type: 'missing_meta_description',
    severity: 'major',
    description: 'La página no tiene metadescripción',
    fix: 'Añadir una metadescripción descriptiva y relevante para la página'
  },
  MISSING_H1: {
    type: 'missing_h1',
    severity: 'major',
    description: 'La página no tiene una etiqueta H1',
    fix: 'Añadir una etiqueta H1 que describa el contenido principal de la página'
  },
  SHORT_CONTENT: {
    type: 'short_content',
    severity: 'minor',
    description: 'La página tiene poco contenido',
    fix: 'Añadir más contenido relevante y de calidad a la página'
  },
  IMAGES_WITHOUT_ALT: {
    type: 'images_without_alt',
    severity: 'major',
    description: 'Hay imágenes sin atributo alt',
    fix: 'Añadir atributos alt descriptivos a todas las imágenes'
  },
  SLOW_LOADING: {
    type: 'slow_loading',
    severity: 'major',
    description: 'La página carga lentamente',
    fix: 'Optimizar el rendimiento de la página reduciendo el tamaño de los recursos y minimizando el código'
  },
  DUPLICATE_TITLE: {
    type: 'duplicate_title',
    severity: 'major',
    description: 'El título de la página está duplicado en el sitio',
    fix: 'Crear un título único para esta página que la diferencie de las demás'
  },
  MISSING_CANONICAL: {
    type: 'missing_canonical',
    severity: 'minor',
    description: 'La página no tiene una URL canónica definida',
    fix: 'Añadir una etiqueta link rel="canonical" para indicar la URL preferida'
  }
};

// SEO scoring weights
export const SEO_SCORING = {
  TITLE_WEIGHT: 15,
  META_DESCRIPTION_WEIGHT: 10,
  H1_WEIGHT: 10,
  CONTENT_LENGTH_WEIGHT: 5,
  PERFORMANCE_WEIGHT: 15,
  MOBILE_FRIENDLY_WEIGHT: 15,
  INTERNAL_LINKS_WEIGHT: 5,
  IMAGES_ALT_WEIGHT: 5,
  SCHEMA_MARKUP_WEIGHT: 10,
  CANONICAL_WEIGHT: 5,
  SSL_WEIGHT: 5
};
