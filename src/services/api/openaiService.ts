
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
  sections: ReturnType<typeof extractSectionsFromText> & {
    seoLocal?: string;
    propuesta?: string;
  },
  rawResponse: string 
}> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('openai_api_key') || ''}`
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
            content: `Analiza el sitio web ${url}. Genera un informe SEO basado en el prompt proporcionado.`
          }
        ],
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error en la API de OpenAI: ${response.statusText}`);
    }
    
    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Extract the standard sections
    const standardSections = extractSectionsFromText(generatedText);
    
    // Extract additional sections that might not be in the standard extraction
    const seoLocalMatch = generatedText.match(/##?\s*SEO Local([\s\S]*?)(?=##?\s|$)/i);
    const propuestaMatch = generatedText.match(/##?\s*Propuesta([\s\S]*?)(?=##?\s|$)/i);
    
    // Combine all sections
    const sections = {
      ...standardSections,
      seoLocal: seoLocalMatch ? seoLocalMatch[1].trim() : '',
      propuesta: propuestaMatch ? propuestaMatch[1].trim() : ''
    };
    
    return {
      sections,
      rawResponse: generatedText
    };
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    toast.error('Error al generar el informe con la API de OpenAI');
    throw error;
  }
};
