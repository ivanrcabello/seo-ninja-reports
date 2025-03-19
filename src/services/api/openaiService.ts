
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
  sections: ReturnType<typeof extractSectionsFromText>,
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
    
    const sections = extractSectionsFromText(generatedText);
    
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
