
interface PageData {
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  wordCount: number;
  images: Array<{ src: string; alt: string | null }>;
}

interface Issue {
  issue_type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  recommended_fix?: string;
}

/**
 * Detect all SEO issues for a page
 */
export function detectAllIssues(
  pageId: string,
  pageData: PageData
): { issues: Array<Issue & { page_id: string }>, count: number } {
  const issues: Array<Issue & { page_id: string }> = [];

  // Title issues
  if (!pageData.title) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_title',
      description: 'La página no tiene título',
      severity: 'critical',
      recommended_fix: 'Añadir un título descriptivo a la página'
    });
  } else if (pageData.title.length < 10) {
    issues.push({
      page_id: pageId,
      issue_type: 'short_title',
      description: 'El título es demasiado corto',
      severity: 'high',
      recommended_fix: 'Aumentar la longitud del título a al menos 30-60 caracteres'
    });
  } else if (pageData.title.length > 70) {
    issues.push({
      page_id: pageId,
      issue_type: 'long_title',
      description: 'El título es demasiado largo',
      severity: 'medium',
      recommended_fix: 'Reducir la longitud del título a menos de 60 caracteres'
    });
  }

  // Meta description issues
  if (!pageData.metaDescription) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_meta_description',
      description: 'La página no tiene meta descripción',
      severity: 'high',
      recommended_fix: 'Añadir una meta descripción descriptiva'
    });
  } else if (pageData.metaDescription.length < 50) {
    issues.push({
      page_id: pageId,
      issue_type: 'short_meta_description',
      description: 'La meta descripción es demasiado corta',
      severity: 'medium',
      recommended_fix: 'Aumentar la longitud de la meta descripción a 120-160 caracteres'
    });
  } else if (pageData.metaDescription.length > 160) {
    issues.push({
      page_id: pageId,
      issue_type: 'long_meta_description',
      description: 'La meta descripción es demasiado larga',
      severity: 'low',
      recommended_fix: 'Reducir la longitud de la meta descripción a menos de 160 caracteres'
    });
  }

  // H1 issues
  if (!pageData.h1) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_h1',
      description: 'La página no tiene encabezado H1',
      severity: 'high',
      recommended_fix: 'Añadir un encabezado H1 principal que describa el contenido de la página'
    });
  }

  // Content issues
  if (pageData.wordCount < 300) {
    issues.push({
      page_id: pageId,
      issue_type: 'low_word_count',
      description: 'La página tiene poco contenido',
      severity: 'medium',
      recommended_fix: 'Añadir más contenido relevante para mejorar el valor de la página'
    });
  }

  // Image issues
  const imagesWithoutAlt = pageData.images.filter(img => !img.alt);
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      page_id: pageId,
      issue_type: 'images_missing_alt',
      description: `${imagesWithoutAlt.length} imágenes sin texto alternativo`,
      severity: 'medium',
      recommended_fix: 'Añadir texto alternativo descriptivo a todas las imágenes'
    });
  }

  return { issues, count: issues.length };
}
