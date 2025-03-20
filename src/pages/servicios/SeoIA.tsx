
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, BarChart, BrainCircuit, SearchCheck, Lightbulb, MagnetIcon, Bot } from 'lucide-react';

const SeoIA: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SEO con Inteligencia Artificial</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Potencia tu estrategia SEO con el poder de la IA para obtener mejores resultados en menos tiempo
            </p>
            <Link to="/contacto">
              <Button size="lg" className="font-medium">Solicitar estrategia IA</Button>
            </Link>
          </div>
          
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">SEO revolucionado por la Inteligencia Artificial</h2>
              <p className="text-lg mb-4">
                La inteligencia artificial está transformando el mundo del SEO, permitiendo análisis más precisos, optimizaciones más efectivas y resultados más rápidos. En SoySeoLocal utilizamos tecnología de IA avanzada para desarrollar estrategias SEO más inteligentes y eficaces.
              </p>
              <p className="text-lg mb-6">
                Nuestro enfoque basado en IA no solo se adapta a los constantes cambios en los algoritmos de búsqueda, sino que también permite predecir tendencias y optimizar contenidos de forma más efectiva que los métodos tradicionales.
              </p>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Ventajas del SEO con IA:</h3>
                <ul className="space-y-2">
                  {[
                    "Análisis predictivo de palabras clave y tendencias",
                    "Optimización de contenido basada en la intención de búsqueda",
                    "Identificación automática de oportunidades de posicionamiento",
                    "Personalización de estrategias según el comportamiento del usuario",
                    "Procesamiento y análisis de grandes volúmenes de datos",
                    "Adaptación continua a los cambios de algoritmos"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Análisis avanzado</h3>
                <p className="text-sm text-muted-foreground">
                  Algoritmos de IA que analizan patrones de búsqueda y comportamiento del usuario.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <SearchCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">SEO semántico</h3>
                <p className="text-sm text-muted-foreground">
                  Optimización semántica que comprende la intención detrás de las búsquedas.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Predicción de tendencias</h3>
                <p className="text-sm text-muted-foreground">
                  Anticipación a cambios en el mercado y comportamientos de búsqueda.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Automatización</h3>
                <p className="text-sm text-muted-foreground">
                  Procesos automatizados que mejoran la eficiencia y reducen el tiempo de implementación.
                </p>
              </div>
            </div>
          </div>
          
          {/* Services Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Nuestros servicios de SEO con IA</h2>
            
            <div className="space-y-8">
              <div className="bg-card border rounded-xl p-8 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div className="bg-primary/10 p-4 rounded-full h-fit">
                    <Lightbulb className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-3">Investigación de palabras clave con IA</h3>
                  <p className="text-muted-foreground mb-4">
                    Nuestros algoritmos de IA analizan millones de búsquedas para identificar las palabras clave más relevantes y con mayor potencial para tu negocio, incluyendo la identificación de nichos y oportunidades que los métodos tradicionales suelen pasar por alto.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Análisis semántico avanzado</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Identificación de intención de búsqueda</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Descubrimiento de nichos de mercado</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Predicción de tendencias de búsqueda</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-8 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div className="bg-primary/10 p-4 rounded-full h-fit">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-3">Optimización de contenido basada en IA</h3>
                  <p className="text-muted-foreground mb-4">
                    Utilizamos herramientas de IA para analizar y optimizar el contenido existente, así como para crear nuevos contenidos que se alineen perfectamente con lo que buscan tus usuarios potenciales y los algoritmos de Google.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Análisis de contenido competitivo</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Optimización semántica</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Generación de contenido asistida</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Análisis de legibilidad avanzado</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-8 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div className="bg-primary/10 p-4 rounded-full h-fit">
                    <MagnetIcon className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-3">Estrategia SEO predictiva</h3>
                  <p className="text-muted-foreground mb-4">
                    Nuestros modelos de IA analizan continuamente los cambios en los algoritmos y el comportamiento de los usuarios para predecir tendencias y ajustar tu estrategia SEO antes que tus competidores.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Análisis de cambios en algoritmos</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Predicción de comportamiento de usuarios</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Ajustes proactivos de estrategia</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Detección temprana de oportunidades</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Potencia tu SEO con inteligencia artificial</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Descubre cómo nuestra tecnología de IA puede transformar tu estrategia SEO y llevar tu visibilidad online al siguiente nivel.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="font-medium">Solicitar demostración</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SeoIA;
