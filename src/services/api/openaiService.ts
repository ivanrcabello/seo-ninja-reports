
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
            content: prompt
          },
          {
            role: "user",
            content: `Analiza el sitio web ${url}. Genera un informe SEO completo y detallado basado en el prompt proporcionado.`
          }
        ],
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error en respuesta de OpenAI:', errorData);
      throw new Error(`Error en la API de OpenAI: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
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
    
    return {
      sections,
      rawResponse: generatedText
    };
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    toast.error(`Error al generar el informe: ${error.message}`);
    throw error;
  }
};
