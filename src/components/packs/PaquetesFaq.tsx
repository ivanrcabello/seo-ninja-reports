
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import FaqItem from './FaqItem';

const PaquetesFaq = () => {
  const faqItems = [
    {
      question: "¿Cuánto tiempo tardaré en ver resultados?",
      answer: "El SEO es una estrategia a medio-largo plazo. Normalmente, los primeros resultados comienzan a verse entre 3 y 6 meses, aunque esto puede variar según la competitividad de tu sector y el estado actual de tu web."
    },
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer: "Sí, puedes escalar o reducir tu plan en cualquier momento. Nos adaptamos a tus necesidades y al crecimiento de tu negocio."
    },
    {
      question: "¿Qué incluye exactamente la optimización de Google Business Profile?",
      answer: "Incluye la optimización completa de tu ficha, gestión de reseñas, publicaciones regulares, configuración de servicios/productos, respuesta a preguntas, y monitorización de estadísticas."
    },
    {
      question: "¿Trabajáis con cualquier tipo de negocio local?",
      answer: "Sí, tenemos experiencia en una amplia variedad de sectores. Nuestro enfoque se adapta a las particularidades de cada industria y zona geográfica."
    }
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container px-4 sm:px-6 mx-auto">
        <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg text-muted-foreground">
            Respuestas a las preguntas más comunes sobre nuestros servicios y paquetes.
          </p>
        </AnimatedContainer>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <FaqItem 
              key={index}
              question={item.question} 
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaquetesFaq;
