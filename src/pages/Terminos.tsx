
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const Terminos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto max-w-4xl">
          <AnimatedContainer animation="fade" className="mb-10">
            <h1 className="text-4xl font-bold mb-4">Términos de Uso</h1>
            <p className="text-muted-foreground mb-8">
              Última actualización: {new Date().toLocaleDateString('es-ES', {day: 'numeric', month: 'long', year: 'numeric'})}
            </p>
          </AnimatedContainer>

          <AnimatedContainer animation="slide-up" delay={100} className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar este sitio web (en adelante, "el Sitio"), usted acepta estar vinculado por estos Términos de Uso. 
              Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al Sitio.
            </p>

            <h2>2. Servicios</h2>
            <p>
              SEOLocal ofrece servicios de posicionamiento SEO local para empresas y profesionales. 
              Nos reservamos el derecho de modificar, suspender o interrumpir cualquier aspecto del Sitio en cualquier momento, 
              incluidos los horarios de disponibilidad y el acceso a cualquiera de nuestros servicios.
            </p>

            <h2>3. Propiedad Intelectual</h2>
            <p>
              Todo el contenido incluido en este Sitio, como texto, gráficos, logotipos, imágenes, clips de audio, 
              descargas digitales, compilaciones de datos y software, es propiedad de SEOLocal o de sus proveedores de contenido 
              y está protegido por las leyes españolas e internacionales de propiedad intelectual e industrial.
            </p>

            <h2>4. Restricciones de Uso</h2>
            <p>
              No está permitido:
            </p>
            <ul>
              <li>Utilizar este Sitio o su contenido para cualquier fin ilegal.</li>
              <li>Reproducir, duplicar, copiar, vender, revender o explotar cualquier parte del Sitio sin el permiso expreso por escrito de SEOLocal.</li>
              <li>Utilizar el Sitio de cualquier manera que pueda dañar, deshabilitar, sobrecargar o deteriorar el Sitio.</li>
              <li>Acceder o intentar acceder a cualquier información no destinada a usted o a cuentas para las que no tiene autorización.</li>
            </ul>

            <h2>5. Responsabilidad del Usuario</h2>
            <p>
              Al utilizar este Sitio, usted garantiza que:
            </p>
            <ul>
              <li>Es mayor de edad y tiene capacidad legal para celebrar contratos vinculantes.</li>
              <li>Toda la información que proporcione en el Sitio es verdadera, precisa, actual y completa.</li>
              <li>Mantendrá la precisión de dicha información.</li>
            </ul>

            <h2>6. Limitación de Responsabilidad</h2>
            <p>
              SEOLocal no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso 
              o la incapacidad de usar nuestros servicios o cualquier contenido proporcionado por SEOLocal, o de la conducta de 
              cualquier usuario, ya sea en línea o fuera de línea.
            </p>

            <h2>7. Enlaces a Terceros</h2>
            <p>
              Nuestro Sitio puede contener enlaces a sitios web de terceros. Estos enlaces son proporcionados únicamente para su 
              conveniencia. SEOLocal no tiene control sobre el contenido de esos sitios y no asume ninguna responsabilidad por 
              ellos o por cualquier pérdida o daño que pueda surgir de su uso.
            </p>

            <h2>8. Cambios en los Términos</h2>
            <p>
              Nos reservamos el derecho, a nuestra sola discreción, de actualizar, cambiar o reemplazar cualquier parte de estos 
              Términos de Uso publicando actualizaciones y cambios en nuestro Sitio. Es su responsabilidad revisar nuestro Sitio 
              periódicamente para ver los cambios.
            </p>

            <h2>9. Ley Aplicable</h2>
            <p>
              Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes de España, 
              y cualquier disputa relacionada con estos términos y condiciones estará sujeta a la jurisdicción 
              exclusiva de los tribunales de Madrid, España.
            </p>

            <h2>10. Contacto</h2>
            <p>
              Si tiene preguntas sobre estos Términos de Uso, puede contactarnos en <a href="mailto:contacto@seolocal.es">contacto@seolocal.es</a>.
            </p>
          </AnimatedContainer>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terminos;
