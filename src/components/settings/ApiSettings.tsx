
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BlurredCard from '@/components/ui/BlurredCard';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

const DEFAULT_PROMPT = `Eres un experto en SEO y marketing digital. A continuación, se te proporcionan datos extraídos de un análisis SEO del sitio web [DOMINIO] y de los documentos e imágenes proporcionados. Con base en esta información, elabora un informe SEO completo que incluya las siguientes secciones:

1. **Resumen Ejecutivo:**  
   Describe la situación actual del sitio en términos de SEO.

2. **Análisis Técnico:**  
   - Evaluación de velocidad de carga, mobile-friendliness y estructura del sitio.
   - Comentarios sobre el uso de etiquetas HTML, optimización de imágenes, etc.

3. **Análisis de Contenido:**  
   - Calidad del contenido, uso y densidad de palabras clave.
   - Recomendaciones para mejorar el contenido y la estrategia de palabras clave.

4. **Backlinks y Autoridad:**  
   - Resumen de la calidad y cantidad de backlinks (si la información está disponible).
   - Sugerencias para mejorar la autoridad del dominio.

5. **Recomendaciones y Acciones:**  
   - Pasos concretos para solucionar problemas detectados y mejorar el posicionamiento.


Elabora el informe de manera clara, estructurada y con recomendaciones prácticas.`;

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('openai_api_key') || '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';
  });
  
  const [defaultPrompt, setDefaultPrompt] = useState(() => {
    return localStorage.getItem('default_seo_prompt') || DEFAULT_PROMPT;
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('openai_api_key', apiKey);
      localStorage.setItem('default_seo_prompt', defaultPrompt);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDefaultPrompt(DEFAULT_PROMPT);
    toast.info('Prompt restaurado a su valor predeterminado');
  };

  return (
    <BlurredCard animation="scale" className="w-full max-w-3xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">
            Configuración de API
          </CardTitle>
          <CardDescription>
            Configura tu API de OpenAI y personaliza el prompt para la generación de informes SEO
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key de OpenAI</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="glass-input"
            />
            <p className="text-xs text-muted-foreground">
              Tu clave API de OpenAI para generar informes SEO
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="defaultPrompt">Prompt Predeterminado</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="h-8 text-xs"
              >
                Restaurar predeterminado
              </Button>
            </div>
            <Textarea
              id="defaultPrompt"
              value={defaultPrompt}
              onChange={(e) => setDefaultPrompt(e.target.value)}
              className="min-h-[300px] glass-input"
            />
            <p className="text-xs text-muted-foreground">
              Este prompt será utilizado como base para generar todos los informes SEO
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Configuración
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </BlurredCard>
  );
};

export default ApiSettings;
