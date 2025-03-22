
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
    
    // Enhance prompt to include metrics for visualizations
    const enhancedPrompt = `${prompt}\n\nIMPORTANTE: Incluye métricas numéricas específicas en cada sección (puntuaciones de 0-100) para los aspectos clave. Por ejemplo, "Velocidad de carga: 75/100", "Calidad de backlinks: 85/100". Estas métricas serán cruciales para la visualización gráfica del informe.`;
    
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
            content: `Analiza el sitio web ${url}. Genera un informe SEO completo y detallado basado en el prompt proporcionado. Incluye métricas cuantitativas (puntuaciones de 0-100) para cada aspecto que analices.`
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
      throw new Error('La respuesta no contiene todas las secciones requeridas del informe');
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
