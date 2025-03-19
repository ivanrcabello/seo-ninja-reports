import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BlurredCard from '@/components/ui/BlurredCard';
import { toast } from 'sonner';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DEFAULT_PROMPT = `Genera un informe profesional de SEO para clientes de una empresa de marketing digital, claramente estructurado y formateado en secciones específicas con títulos fáciles de entender para clientes sin conocimientos técnicos profundos. Usa lenguaje sencillo, directo y con un tono profesional, asegurando claridad y precisión.

Cada sección debe tener un título claro, y resaltar palabras clave importantes en negrita. Desarrolla cada una de las siguientes secciones detalladamente:

Resumen Ejecutivo:

Proporciona un resumen breve pero completo del estado actual del sitio web del cliente.

Indica claramente fortalezas, debilidades y áreas de mejora del sitio.

Incluye recomendaciones breves sobre los próximos pasos.

SEO Técnico:

Analiza aspectos técnicos clave: velocidad de carga, optimización móvil, estructura web, URLs amigables, errores y problemas encontrados.

Presenta claramente las acciones correctivas recomendadas para mejorar la experiencia del usuario y la indexación en Google.

Contenido:

Evalúa la calidad y relevancia del contenido actual del sitio web.

Identifica oportunidades para contenido nuevo, destacando claramente palabras clave estratégicas para mejorar el posicionamiento.

Sugiere mejoras concretas en la estructura del contenido, uso de encabezados (H1, H2, H3), imágenes optimizadas y enlaces internos.

Backlinks:

Proporciona un análisis claro del perfil actual de enlaces entrantes.

Identifica calidad, cantidad y relevancia de los backlinks.

Recomienda estrategias específicas para la adquisición de enlaces de calidad, indicando claramente tipos de sitios ideales para conseguir enlaces.

SEO Local:

Evalúa el posicionamiento actual en búsquedas locales.

Sugiere claramente mejoras en la optimización de Google My Business (GMB).

Recomienda acciones concretas para aumentar la visibilidad en búsquedas geolocalizadas, incluyendo palabras clave locales específicas.

Recomendaciones:

Proporciona un listado organizado y fácil de seguir con acciones prioritarias a corto, medio y largo plazo.

Asegura que cada recomendación sea clara, accionable y orientada a resultados.

Propuesta:

Presenta claramente los paquetes de servicios SEO recomendados, alineados con las necesidades específicas identificadas del cliente.

Incluye una breve explicación sobre beneficios y resultados esperados para cada paquete.

Mantén un estilo profesional, asegurando que todo el informe sea fácil de entender, bien formateado y visualmente atractivo, con palabras clave importantes claramente destacadas en negrita.`;

const ApiSettings = () => {
  const [activeTab, setActiveTab] = useState('openai');
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('openai_api_key') || '';
  });
  
  const [googleApiKey, setGoogleApiKey] = useState(() => {
    return localStorage.getItem('google_pagespeed_api_key') || '';
  });
  
  const [defaultPrompt, setDefaultPrompt] = useState(() => {
    return localStorage.getItem('default_seo_prompt') || DEFAULT_PROMPT;
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasConfiguredKey, setHasConfiguredKey] = useState(false);
  const [hasConfiguredGoogleKey, setHasConfiguredGoogleKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    const storedGoogleKey = localStorage.getItem('google_pagespeed_api_key');
    
    setHasConfiguredKey(!!storedKey && storedKey.trim() !== '');
    setHasConfiguredGoogleKey(!!storedGoogleKey && storedGoogleKey.trim() !== '');
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      if (activeTab === 'openai') {
        if (!apiKey.trim()) {
          toast.error('Debes proporcionar una API key de OpenAI válida');
          setIsSaving(false);
          return;
        }
        
        localStorage.setItem('openai_api_key', apiKey);
        localStorage.setItem('default_seo_prompt', defaultPrompt);
        setHasConfiguredKey(true);
        toast.success('Configuración de OpenAI guardada correctamente');
      } else if (activeTab === 'google') {
        if (!googleApiKey.trim()) {
          toast.error('Debes proporcionar una API key de Google válida');
          setIsSaving(false);
          return;
        }
        
        localStorage.setItem('google_pagespeed_api_key', googleApiKey);
        setHasConfiguredGoogleKey(true);
        toast.success('Configuración de Google PageSpeed API guardada correctamente');
      }
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
            Configura las APIs necesarias para la generación de informes SEO
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="openai">OpenAI</TabsTrigger>
              <TabsTrigger value="google">Google PageSpeed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="openai" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="google" className="space-y-6">
              {!hasConfiguredGoogleKey && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No has configurado una API key de Google. Debes configurar una API key válida para utilizar la funcionalidad de análisis con PageSpeed Insights.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="googleApiKey">API Key de Google</Label>
                <Input
                  id="googleApiKey"
                  type="password"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  className="glass-input"
                  placeholder="AIza..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Tu clave API de Google para analizar sitios web con PageSpeed Insights. Obtén una clave en <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
                </p>
              </div>
            </TabsContent>
          </Tabs>
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
