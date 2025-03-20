
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Code, Cpu, Gauge, Globe, Lock } from 'lucide-react';

const SeoTecnico: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SEO Técnico</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Optimizamos la estructura técnica de tu sitio web para mejorar su visibilidad en buscadores
            </p>
            <Link to="/contacto">
              <Button size="lg" className="font-medium">Solicitar auditoría técnica</Button>
            </Link>
          </div>
          
          {/* Main Content */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Nuestros servicios de SEO Técnico</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Gauge className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Velocidad de carga</h3>
                <p className="text-muted-foreground mb-4">
                  Optimizamos el tiempo de carga de tu sitio web para mejorar la experiencia de usuario y el posicionamiento.
                </p>
                <ul className="space-y-1">
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Compresión de imágenes</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Minificación de CSS/JS</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Optimización de caché</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Estructura de datos</h3>
                <p className="text-muted-foreground mb-4">
                  Implementamos Schema Markup para ayudar a los buscadores a entender mejor el contenido de tu web.
                </p>
                <ul className="space-y-1">
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Rich Snippets</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Knowledge Graph</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Marcado LocalBusiness</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Indexabilidad</h3>
                <p className="text-muted-foreground mb-4">
                  Aseguramos que tu sitio web sea correctamente indexado por los motores de búsqueda.
                </p>
                <ul className="space-y-1">
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Optimización de robots.txt</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Sitemap XML</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Corrección de enlaces rotos</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Seguridad HTTPS</h3>
                <p className="text-muted-foreground mb-4">
                  Verificamos y reforzamos la seguridad de tu sitio web para mejorar su posicionamiento.
                </p>
                <ul className="space-y-1">
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Certificados SSL</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Redirecciones 301</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Seguridad en formularios</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Optimización de código</h3>
                <p className="text-muted-foreground mb-4">
                  Limpiamos y mejoramos el código de tu sitio web para facilitar su rastreo.
                </p>
                <ul className="space-y-1">
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Estructura HTML semántica</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Limpieza de código</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Optimización de JavaScript</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Rendimiento móvil</h3>
                <p className="text-muted-foreground mb-4">
                  Adaptamos tu sitio para ofrecer una experiencia óptima en dispositivos móviles.
                </p>
                <ul className="space-y-1">
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Diseño responsive</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Mobile-first indexing</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Pruebas en múltiples dispositivos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Process Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Nuestro proceso de SEO Técnico</h2>
            
            <div className="relative">
              {/* Connector Line (hidden on mobile) */}
              <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-border hidden md:block"></div>
              
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/2 md:text-right order-2 md:order-1">
                    <h3 className="text-xl font-bold mb-2">Auditoría técnica completa</h3>
                    <p className="text-muted-foreground">
                      Analizamos a fondo tu sitio web para identificar problemas técnicos que puedan estar afectando su posicionamiento.
                    </p>
                  </div>
                  <div className="relative z-10 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center order-1 md:order-2">
                    1
                  </div>
                  <div className="md:w-1/2 order-3"></div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/2 order-2"></div>
                  <div className="relative z-10 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center order-1">
                    2
                  </div>
                  <div className="md:w-1/2 order-3">
                    <h3 className="text-xl font-bold mb-2">Plan de acción personalizado</h3>
                    <p className="text-muted-foreground">
                      Desarrollamos una estrategia a medida para corregir los problemas identificados y mejorar los aspectos técnicos de tu web.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/2 md:text-right order-2 md:order-1">
                    <h3 className="text-xl font-bold mb-2">Implementación de mejoras</h3>
                    <p className="text-muted-foreground">
                      Aplicamos las correcciones y optimizaciones necesarias para mejorar el rendimiento técnico de tu sitio.
                    </p>
                  </div>
                  <div className="relative z-10 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center order-1 md:order-2">
                    3
                  </div>
                  <div className="md:w-1/2 order-3"></div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/2 order-2"></div>
                  <div className="relative z-10 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center order-1">
                    4
                  </div>
                  <div className="md:w-1/2 order-3">
                    <h3 className="text-xl font-bold mb-2">Monitorización y seguimiento</h3>
                    <p className="text-muted-foreground">
                      Realizamos un seguimiento continuo del rendimiento de tu sitio para detectar y resolver nuevos problemas técnicos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Necesitas mejorar el rendimiento técnico de tu web?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Nuestro equipo de especialistas en SEO técnico puede ayudarte a optimizar tu sitio para los motores de búsqueda.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="font-medium">Solicitar consulta gratuita</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SeoTecnico;
