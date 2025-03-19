
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_PROMPT = `Genera un informe profesional de SEO para clientes de una empresa de marketing digital, claramente estructurado y formateado en secciones específicas con títulos fáciles de entender para clientes sin conocimientos técnicos profundos. Usa lenguaje sencillo, directo y con un tono profesional, asegurando claridad y precisión.

Cada sección debe tener un título claro, y resaltar palabras clave importantes en negrita. Desarrolla cada una de las siguientes secciones detalladamente:

Resumen Ejecutivo:
- Proporciona un resumen breve pero completo del estado actual del sitio web del cliente.
- Indica claramente fortalezas, debilidades y áreas de mejora del sitio.
- Incluye recomendaciones breves sobre los próximos pasos.

SEO Técnico:
- Analiza aspectos técnicos clave: velocidad de carga, optimización móvil, estructura web, URLs amigables, errores y problemas encontrados.
- Presenta claramente las acciones correctivas recomendadas para mejorar la experiencia del usuario y la indexación en Google.
- Incluye problemas de rendimiento, accesibilidad y mejores prácticas basadas en los datos de PageSpeed.

Contenido:
- Evalúa la calidad y relevancia del contenido actual del sitio web.
- Identifica oportunidades para contenido nuevo, destacando claramente palabras clave estratégicas para mejorar el posicionamiento.
- Sugiere mejoras concretas en la estructura del contenido, uso de encabezados (H1, H2, H3), imágenes optimizadas y enlaces internos.

Palabras Clave:
- Identifica y lista las palabras clave principales que el sitio debería estar targetizando.
- Analiza la competencia para esas palabras clave y la dificultad para rankear.
- Sugiere nuevas oportunidades de palabras clave con menor competencia pero buen volumen de búsqueda.
- Detalla cómo implementar estas palabras clave en el contenido y metadatos del sitio.

Backlinks:
- Proporciona un análisis claro del perfil actual de enlaces entrantes.
- Identifica calidad, cantidad y relevancia de los backlinks.
- Recomienda estrategias específicas para la adquisición de enlaces de calidad, indicando claramente tipos de sitios ideales para conseguir enlaces.

SEO Local:
- Evalúa el posicionamiento actual en búsquedas locales.
- Sugiere claramente mejoras en la optimización de Google My Business (GMB).
- Recomienda acciones concretas para aumentar la visibilidad en búsquedas geolocalizadas, incluyendo palabras clave locales específicas.

Recomendaciones:
- Proporciona un listado organizado y fácil de seguir con acciones prioritarias a corto, medio y largo plazo.
- Asegura que cada recomendación sea clara, accionable y orientada a resultados.
- Categoriza las recomendaciones por impacto (alto, medio, bajo) y dificultad de implementación.

Propuesta:
- Presenta claramente los paquetes de servicios SEO recomendados, alineados con las necesidades específicas identificadas del cliente.
- Incluye una breve explicación sobre beneficios y resultados esperados para cada paquete.
- Ofrece opciones con diferentes niveles de inversión y retorno esperado.

Mantén un estilo profesional, asegurando que todo el informe sea fácil de entender, bien formateado y visualmente atractivo, con palabras clave importantes claramente destacadas en negrita.

Si se han proporcionado archivos de apoyo como exportaciones de Google Analytics, capturas de pantalla, o cualquier otro material, analiza esta información e inclúyela en tu análisis, referenciándola específicamente en las secciones correspondientes del informe.`;

interface OpenAISettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  defaultPrompt: string;
  setDefaultPrompt: (prompt: string) => void;
  hasConfiguredKey: boolean;
  onSave: () => void;
}

const OpenAISettings: React.FC<OpenAISettingsProps> = ({
  apiKey,
  setApiKey,
  defaultPrompt,
  setDefaultPrompt,
  hasConfiguredKey,
  onSave,
}) => {
  const handleReset = () => {
    setDefaultPrompt(DEFAULT_PROMPT);
    toast.info('Prompt restaurado a su valor predeterminado');
  };

  return (
    <div className="space-y-6">
      {!hasConfiguredKey && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No has configurado una API key de OpenAI. Debes configurar una API key válida para utilizar la funcionalidad de generación de informes SEO.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key de OpenAI</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="glass-input"
          placeholder="sk-..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Tu clave API de OpenAI para generar informes SEO. Obtén una clave en <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com/api-keys</a>
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
    </div>
  );
};

export { OpenAISettings, DEFAULT_PROMPT };
