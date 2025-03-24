
// Constants for SEO Crawler
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const SEO_ISSUES = {
  MISSING_TITLE: {
    type: 'MISSING_TITLE',
    severity: 'high',
    description: 'La página no tiene un título definido',
    fix: 'Agregar una etiqueta title con un título descriptivo'
  },
  MISSING_META_DESCRIPTION: {
    type: 'MISSING_META_DESCRIPTION',
    severity: 'medium',
    description: 'La página no tiene una meta descripción',
    fix: 'Agregar una meta etiqueta description con una descripción concisa de la página'
  },
  MISSING_H1: {
    type: 'MISSING_H1',
    severity: 'medium',
    description: 'La página no tiene un encabezado H1',
    fix: 'Agregar un encabezado H1 que describa el contenido principal de la página'
  },
  TITLE_TOO_LONG: {
    type: 'TITLE_TOO_LONG',
    severity: 'low',
    description: 'El título de la página es demasiado largo (más de 60 caracteres)',
    fix: 'Acortar el título a 50-60 caracteres'
  },
  MULTIPLE_H1: {
    type: 'MULTIPLE_H1',
    severity: 'medium',
    description: 'La página tiene múltiples encabezados H1',
    fix: 'Usar solo un encabezado H1 por página'
  },
  META_DESCRIPTION_TOO_LONG: {
    type: 'META_DESCRIPTION_TOO_LONG',
    severity: 'low',
    description: 'La meta descripción es demasiado larga (más de 160 caracteres)',
    fix: 'Acortar la meta descripción a menos de 160 caracteres'
  },
  NO_ALT_TEXT: {
    type: 'NO_ALT_TEXT',
    severity: 'medium',
    description: 'Imágenes sin texto alternativo',
    fix: 'Agregar texto alt descriptivo a todas las imágenes'
  },
  NO_SCHEMA_MARKUP: {
    type: 'NO_SCHEMA_MARKUP',
    severity: 'low',
    description: 'La página no tiene marcado de esquema estructurado',
    fix: 'Implementar marcado de esquema JSON-LD para mejorar el entendimiento de la página por los motores de búsqueda'
  }
};

export const BRIGHT_DATA_CONFIG = {
  API_URL: 'https://api.brightdata.com/request',
  DEFAULT_ZONE: 'web_unlocker1',
  FORMAT: 'raw',
  TIMEOUT: 120000, // 120 segundos de timeout para las peticiones (aumentado)
  CUSTOMER_ID: 'customer', // Reemplazado con el valor correcto en tiempo de ejecución
  PROXY_HOST: 'brd.superproxy.io',
  PROXY_PORT: 22225 // Puerto estándar para WebUnlocker
};
