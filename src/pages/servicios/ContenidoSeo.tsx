
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, FileText, Pencil, Search, Target, Users, BookText } from 'lucide-react';

const ContenidoSeo: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contenido SEO</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Creamos contenido estratégico que atrae a tu audiencia y posiciona tu web en los motores de búsqueda
            </p>
            <Link to="/contacto">
              <Button size="lg" className="font-medium">Solicitar estrategia de contenidos</Button>
            </Link>
          </div>
          
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">El contenido como pilar fundamental del SEO</h2>
              <p className="text-lg mb-4">
                En la era digital actual, el contenido de calidad se ha convertido en el activo más valioso para mejorar la visibilidad online. Los motores de búsqueda premian a los sitios web que ofrecen contenido relevante, útil y actualizado para sus usuarios.
              </p>
              <p className="text-lg mb-6">
                Nuestro servicio de creación de Contenido SEO combina técnicas avanzadas de posicionamiento con redacción persuasiva para crear contenidos que no solo atraen tráfico, sino que también convierten visitantes en clientes.
              </p>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Beneficios del Contenido SEO:</h3>
                <ul className="space-y-2">
                  {[
                    "Mejora del posicionamiento en buscadores",
                    "Atracción de tráfico cualificado",
                    "Aumento de la autoridad de tu sitio web",
                    "Generación de enlaces naturales",
                    "Incremento de las conversiones",
                    "Mayor engagement con tu audiencia"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Investigación de palabras clave</h3>
                    <p className="text-muted-foreground">
                      Identificamos los términos y frases que tu audiencia utiliza para encontrar servicios o productos como los tuyos.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Análisis de audiencia</h3>
                    <p className="text-muted-foreground">
                      Estudiamos a tu público objetivo para crear contenidos que respondan a sus necesidades específicas.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Pencil className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Redacción optimizada</h3>
                    <p className="text-muted-foreground">
                      Creamos contenidos de alta calidad optimizados para buscadores sin sacrificar la naturalidad y el valor para el lector.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Estrategia editorial</h3>
                    <p className="text-muted-foreground">
                      Desarrollamos un plan de contenidos coherente y orientado a tus objetivos comerciales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Services Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Nuestros servicios de Contenido SEO</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card border rounded-xl overflow-hidden flex flex-col">
                <div className="bg-primary/10 p-6">
                  <div className="bg-primary/20 p-3 rounded-full w-fit">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3">Artículos para blog</h3>
                  <p className="text-muted-foreground mb-4 flex-1">
                    Creamos artículos informativos y educativos optimizados para SEO que aportan valor a tu audiencia y posicionan tu marca como referente en tu sector.
                  </p>
                  <div className="mt-auto">
                    <h4 className="font-medium mb-2">Incluye:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Investigación de palabras clave</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Optimización on-page</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Imágenes optimizadas</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Estructura óptima para SEO</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl overflow-hidden flex flex-col">
                <div className="bg-primary/10 p-6">
                  <div className="bg-primary/20 p-3 rounded-full w-fit">
                    <BookText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3">Páginas de servicios y landing pages</h3>
                  <p className="text-muted-foreground mb-4 flex-1">
                    Desarrollamos contenido persuasivo y orientado a la conversión para tus páginas de servicios y landing pages, optimizado para palabras clave comerciales.
                  </p>
                  <div className="mt-auto">
                    <h4 className="font-medium mb-2">Incluye:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Copywriting persuasivo</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Optimización para conversión</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Llamadas a la acción efectivas</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Estructura optimizada para SEO</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl overflow-hidden flex flex-col">
                <div className="bg-primary/10 p-6">
                  <div className="bg-primary/20 p-3 rounded-full w-fit">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3">Estrategia de contenidos</h3>
                  <p className="text-muted-foreground mb-4 flex-1">
                    Diseñamos una estrategia integral de contenidos alineada con tus objetivos de negocio, incluyendo un calendario editorial y un plan de distribución.
                  </p>
                  <div className="mt-auto">
                    <h4 className="font-medium mb-2">Incluye:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Análisis de competencia</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Definición de buyer personas</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Calendario editorial</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Plan de distribución</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Process Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Nuestro proceso de creación de Contenido SEO</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-card border rounded-xl p-6 text-center">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4">1</div>
                <h3 className="text-lg font-bold mb-2">Investigación</h3>
                <p className="text-sm text-muted-foreground">
                  Analizamos tu mercado, competencia y palabras clave para identificar oportunidades.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6 text-center">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4">2</div>
                <h3 className="text-lg font-bold mb-2">Planificación</h3>
                <p className="text-sm text-muted-foreground">
                  Desarrollamos una estrategia y un calendario de contenidos adaptado a tus objetivos.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6 text-center">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4">3</div>
                <h3 className="text-lg font-bold mb-2">Creación</h3>
                <p className="text-sm text-muted-foreground">
                  Redactamos contenido optimizado que conecta con tu audiencia y cumple objetivos SEO.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6 text-center">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4">4</div>
                <h3 className="text-lg font-bold mb-2">Medición</h3>
                <p className="text-sm text-muted-foreground">
                  Analizamos el rendimiento del contenido y realizamos ajustes para mejorar resultados.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Listo para impulsar tu SEO con contenido de calidad?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Nuestro equipo de redactores especializados en SEO está preparado para crear el contenido que tu negocio necesita para destacar en los motores de búsqueda.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="font-medium">Solicitar presupuesto</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContenidoSeo;
