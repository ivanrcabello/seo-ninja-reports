
// Constants for SEO Crawler
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified SEO issues for basic analysis
export const SEO_ISSUES = {
  MISSING_TITLE: {
    type: 'missing_title',
    severity: 'high',
    description: 'La página no tiene título',
    fix: 'Añadir un título descriptivo y relevante a la página'
  },
  MISSING_META_DESCRIPTION: {
    type: 'missing_meta_description',
    severity: 'medium',
    description: 'La página no tiene meta descripción',
    fix: 'Añadir una meta descripción concisa y relevante'
  },
  MISSING_H1: {
    type: 'missing_h1',
    severity: 'high',
    description: 'La página no tiene un encabezado H1',
    fix: 'Añadir un encabezado H1 que refleje el contenido principal de la página'
  },
  CRAWLER_ERROR: {
    type: 'crawler_error',
    severity: 'high',
    description: 'Error al analizar la página',
    fix: 'Verificar que la URL es accesible y no está bloqueada'
  }
};
