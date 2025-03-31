
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto max-w-4xl">
          <AnimatedContainer animation="fade" className="mb-10">
            <h1 className="text-4xl font-bold mb-4">Política de Cookies</h1>
            <p className="text-muted-foreground mb-8">
              Última actualización: {new Date().toLocaleDateString('es-ES', {day: 'numeric', month: 'long', year: 'numeric'})}
            </p>
          </AnimatedContainer>

          <AnimatedContainer animation="slide-up" delay={100} className="prose prose-slate dark:prose-invert max-w-none">
            <h2>¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. 
              Las cookies tienen muchas funciones diferentes, como permitirle navegar entre páginas de manera eficiente, 
              recordar sus preferencias y, en general, mejorar la experiencia del usuario. También pueden ayudar a garantizar 
              que los anuncios que ve en línea sean más relevantes para usted y sus intereses.
            </p>

            <h2>Tipos de cookies que utilizamos</h2>
            
            <h3>Cookies estrictamente necesarias</h3>
            <p>
              Estas cookies son esenciales para el funcionamiento de nuestro sitio web y no se pueden desactivar 
              en nuestros sistemas. Normalmente solo se configuran en respuesta a acciones realizadas por usted que 
              equivalen a una solicitud de servicios, como establecer sus preferencias de privacidad, iniciar sesión 
              o completar formularios. Puede configurar su navegador para que bloquee o le alerte sobre estas cookies, 
              pero algunas partes del sitio no funcionarán correctamente.
            </p>
            
            <h3>Cookies de rendimiento</h3>
            <p>
              Estas cookies nos permiten contar las visitas y fuentes de tráfico para que podamos medir y mejorar el 
              rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares y a ver cómo 
              los visitantes se mueven por el sitio. Toda la información que recopilan estas cookies es agregada y, por 
              lo tanto, anónima. Si no permite estas cookies, no sabremos cuándo ha visitado nuestro sitio.
            </p>
            
            <h3>Cookies de funcionalidad</h3>
            <p>
              Estas cookies permiten que el sitio web proporcione una funcionalidad y personalización mejoradas. 
              Pueden ser establecidas por nosotros o por proveedores externos cuyos servicios hemos agregado a nuestras páginas. 
              Si no permite estas cookies, es posible que algunos o todos estos servicios no funcionen correctamente.
            </p>
            
            <h3>Cookies de publicidad dirigida</h3>
            <p>
              Estas cookies pueden estar configuradas a través de nuestro sitio por nuestros socios publicitarios. 
              Pueden ser utilizadas por esas empresas para crear un perfil de sus intereses y mostrarle anuncios relevantes 
              en otros sitios. No almacenan directamente información personal, sino que se basan en la identificación única 
              de su navegador y dispositivo de Internet. Si no permite estas cookies, experimentará publicidad menos dirigida.
            </p>

            <h2>Cómo gestionar las cookies</h2>
            <p>
              Puede configurar o cambiar las opciones de su navegador para aceptar o rechazar cookies. 
              Si desea eliminar las cookies establecidas por nuestro sitio, puede hacerlo usando las configuraciones 
              de su navegador. Por favor, consulte la función de ayuda en su navegador para obtener instrucciones.
            </p>
            
            <p>
              Tenga en cuenta que al eliminar nuestras cookies o deshabilitar futuras cookies, es posible que no pueda 
              acceder a ciertas áreas o funciones de nuestro sitio web.
            </p>

            <h2>Contacto</h2>
            <p>
              Si tiene preguntas sobre nuestra política de cookies, no dude en contactarnos en <a href="mailto:contacto@seolocal.es">contacto@seolocal.es</a>.
            </p>
          </AnimatedContainer>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
