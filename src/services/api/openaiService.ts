
import { toast } from 'sonner';
import { Report } from '@/types/report.types';
import { extractSectionsFromText } from '@/utils/reportUtils';

/**
 * Makes a request to OpenAI API to generate an SEO report
 */
export const generateOpenAIReport = async (
  url: string,
  prompt: string
): Promise<{ 
  sections: {
    summary: string;
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    recommendations: string;
    localSeo: string;
    serviceProposal: string;
    keywords: string;
  },
  rawResponse: string 
}> => {
  try {
    console.log('Iniciando solicitud a OpenAI para:', url);
    console.log('Utilizando prompt con longitud:', prompt.length);
    
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('No se ha configurado una API key de OpenAI válida');
    }
    
    // Enhanced prompt to emphasize technical metrics for better visualization
    const enhancedPrompt = `${prompt}\n\nIMPORTANTE: 
1. Incluye métricas numéricas específicas en la sección de Análisis Técnico (puntuaciones de 0-100) para todos los aspectos clave. 
2. Utiliza el formato "Aspecto: XX/100" para que sean más fáciles de visualizar. 
3. Asegúrate de incluir puntuaciones para:
   - Velocidad de carga: XX/100
   - SEO técnico general: XX/100
   - Optimización móvil: XX/100
   - Rendimiento: XX/100
   - Accesibilidad: XX/100
   - Mejores prácticas: XX/100
   - SEO on-page: XX/100

ES FUNDAMENTAL que el informe incluya TODAS las siguientes secciones con títulos claramente marcados:
- Resumen Ejecutivo
- Análisis Técnico
- Análisis de Contenido
- Recomendaciones

El informe no será válido si falta alguna de estas secciones principales.`;
    
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Enviando solicitud a OpenAI API...`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: enhancedPrompt
          },
          {
            role: "user",
            content: `Analiza el sitio web ${url}. Genera un informe SEO completo y detallado basado en el prompt proporcionado. Incluye métricas cuantitativas (puntuaciones de 0-100) para cada aspecto que analices, especialmente en la sección de análisis técnico.`
          }
        ],
        temperature: 0.7
      })
    });
    
    const endTime = Date.now();
    const requestTime = (endTime - startTime) / 1000;
    console.log(`[${new Date().toISOString()}] Respuesta recibida de OpenAI API después de ${requestTime} segundos`);
    
    if (!response.ok) {
      const errorStatus = response.status;
      let errorText = '';
      
      try {
        const errorData = await response.text();
        errorText = errorData;
        console.error('Error en respuesta de OpenAI:', errorData);
      } catch (textError) {
        console.error('No se pudo obtener el texto del error:', textError);
      }
      
      throw new Error(`Error en la API de OpenAI: ${errorStatus} - ${response.statusText}. ${errorText.slice(0, 200)}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Respuesta de OpenAI incompleta o con formato incorrecto:', JSON.stringify(data, null, 2));
      throw new Error('La respuesta de OpenAI no tiene el formato esperado');
    }
    
    const generatedText = data.choices[0].message.content;
    console.log('Respuesta de OpenAI recibida. Longitud del texto:', generatedText.length);
    
    // Extract the standard sections
    const standardSections = extractSectionsFromText(generatedText);
    console.log('Secciones estándar extraídas:', Object.keys(standardSections));
    
    // Extract additional sections that might not be in the standard extraction
    const seoLocalMatch = generatedText.match(/##?\s*SEO Local([\s\S]*?)(?=##?\s|$)/i);
    const propuestaMatch = generatedText.match(/##?\s*Propuesta([\s\S]*?)(?=##?\s|$)/i);
    const keywordsMatch = generatedText.match(/##?\s*Palabras Clave([\s\S]*?)(?=##?\s|$)/i);
    
    console.log('¿Se encontró sección SEO Local?', !!seoLocalMatch);
    console.log('¿Se encontró sección Propuesta?', !!propuestaMatch);
    console.log('¿Se encontró sección Palabras Clave?', !!keywordsMatch);
    
    // Set default values for required sections to avoid undefined
    standardSections.executiveSummary = standardSections.executiveSummary || 'No se generó contenido para la sección de Resumen Ejecutivo.';
    standardSections.technicalAnalysis = standardSections.technicalAnalysis || 'No se generó contenido para la sección de Análisis Técnico.';
    standardSections.contentAnalysis = standardSections.contentAnalysis || 'No se generó contenido para la sección de Análisis de Contenido.';
    standardSections.recommendations = standardSections.recommendations || 'No se generó contenido para la sección de Recomendaciones.';
    
    // Create fallback section content if necessary
    if (!standardSections.executiveSummary) {
      console.warn('No se encontró sección de Resumen Ejecutivo. Creando sección predeterminada.');
      standardSections.executiveSummary = 'Este informe analiza el sitio web ' + url + '. Por favor, revisa las secciones a continuación para obtener información detallada sobre el análisis SEO.';
    }
    
    if (!standardSections.technicalAnalysis) {
      console.warn('No se encontró sección de Análisis Técnico. Creando sección predeterminada.');
      standardSections.technicalAnalysis = 'Se necesita realizar un análisis técnico detallado del sitio web ' + url + '. Recomendamos revisar aspectos como velocidad de carga, estructura del sitio, optimización móvil y otros factores técnicos SEO.';
    }
    
    if (!standardSections.recommendations) {
      console.warn('No se encontró sección de Recomendaciones. Creando sección predeterminada.');
      standardSections.recommendations = 'Basado en el análisis del sitio ' + url + ', recomendamos realizar una revisión detallada de los aspectos técnicos y de contenido identificados en este informe.';
    }
    
    // Combine all sections
    const sections = {
      ...standardSections,
      localSeo: seoLocalMatch ? seoLocalMatch[1].trim() : '',
      serviceProposal: propuestaMatch ? propuestaMatch[1].trim() : '',
      keywords: keywordsMatch ? keywordsMatch[1].trim() : ''
    };
    
    // Verify that we have the minimum required sections
    if (!sections.executiveSummary || !sections.technicalAnalysis || !sections.recommendations) {
      console.error('Faltan secciones principales en la respuesta generada:', Object.keys(sections));
      console.error('Texto generado completo:', generatedText);
      
      // Instead of throwing, create default sections with an explanation
      const defaultMessage = 'Esta sección no pudo ser generada correctamente. El modelo de OpenAI no proporcionó contenido para esta parte del informe. Por favor, intente generar el informe nuevamente o edite esta sección manualmente.';
      
      sections.summary = sections.summary || 'Informe SEO generado para ' + url;
      sections.executiveSummary = sections.executiveSummary || defaultMessage;
      sections.technicalAnalysis = sections.technicalAnalysis || defaultMessage;
      sections.recommendations = sections.recommendations || defaultMessage;
      
      // Log the error but don't stop the process
      console.warn('Se están utilizando secciones predeterminadas debido a que faltan secciones en la respuesta de OpenAI');
    }
    
    return {
      sections,
      rawResponse: generatedText
    };
  } catch (error: any) {
    console.error('Error detallado al llamar a OpenAI API:', error);
    console.error('Stack trace:', error.stack);
    toast.error(`Error al generar el informe: ${error.message}`);
    throw error;
  }
};
