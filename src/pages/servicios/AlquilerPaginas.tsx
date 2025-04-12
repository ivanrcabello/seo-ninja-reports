
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const AlquilerPaginas = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Alquiler de Páginas de Servicios Posicionadas</h1>
          
          <div className="prose max-w-none mb-12">
            <p className="text-xl text-muted-foreground mb-6">
              Accede de inmediato a los primeros resultados de Google sin esperar meses al posicionamiento orgánico tradicional.
            </p>
            
            <div className="bg-primary/5 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4">¿Qué ofrecemos?</h2>
              <p>
                Ponemos a su disposición páginas web ya posicionadas en Google para servicios específicos y ubicaciones 
                geográficas concretas. Estas páginas han sido optimizadas durante años y ocupan posiciones privilegiadas 
                en los resultados de búsqueda, generando visitantes cualificados de forma inmediata.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Ventajas del alquiler de páginas posicionadas</h2>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-1" />
                <span><strong>Resultados inmediatos:</strong> Olvídese de esperar meses para conseguir visibilidad en Google. Desde el primer día, su negocio aparecerá en las primeras posiciones.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-1" />
                <span><strong>Menor inversión:</strong> El coste de alquiler es significativamente menor que el desarrollo y posicionamiento de una página web desde cero.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-1" />
                <span><strong>Tráfico cualificado:</strong> Reciba visitas de usuarios que están buscando exactamente los servicios que ofrece en su área geográfica.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-1" />
                <span><strong>Sin contratos a largo plazo:</strong> Flexibilidad para alquilar durante el tiempo que necesite, adaptándose a las temporadas de su negocio.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-1" />
                <span><strong>Personalización:</strong> Adaptamos el contenido y diseño para que refleje la identidad de su empresa.</span>
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">¿Cómo funciona?</h2>
            
            <ol className="list-decimal space-y-4 ml-5 mb-8">
              <li>
                <strong>Selección:</strong> Escoja entre nuestro catálogo de páginas disponibles según su sector y ubicación geográfica.
              </li>
              <li>
                <strong>Personalización:</strong> Adaptamos la página con su información de contacto, logotipo y servicios específicos.
              </li>
              <li>
                <strong>Publicación:</strong> En 24-48 horas, su página estará activa y recibiendo tráfico cualificado.
              </li>
              <li>
                <strong>Seguimiento:</strong> Reciba informes mensuales detallados sobre el rendimiento y las consultas generadas.
              </li>
            </ol>
            
            <h2 className="text-2xl font-semibold mb-4">Sectores disponibles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Servicios profesionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-5">
                    <li>Abogados</li>
                    <li>Asesorías</li>
                    <li>Consultoría</li>
                    <li>Dentistas</li>
                    <li>Fisioterapeutas</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Servicios para el hogar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-5">
                    <li>Fontanería</li>
                    <li>Electricidad</li>
                    <li>Reforma integral</li>
                    <li>Cerrajería</li>
                    <li>Limpieza</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Otros sectores disponibles</CardTitle>
                  <CardDescription>Consulte disponibilidad para su sector específico</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Disponemos de páginas posicionadas en más de 30 sectores diferentes y en las principales 
                    ciudades españolas. Contacte con nosotros para consultar disponibilidad en su área de negocio.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="bg-muted p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Precio a consultar según sector y ubicación</h2>
            <p className="text-muted-foreground mb-6">
              Cada propuesta se personaliza según sus necesidades específicas y la competitividad del sector.
              Contáctenos para recibir una propuesta sin compromiso.
            </p>
            <Button size="lg" asChild>
              <a href="/contacto">Solicitar información</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AlquilerPaginas;
