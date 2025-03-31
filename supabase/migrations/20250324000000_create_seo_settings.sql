
-- Create a page SEO settings table
CREATE TABLE IF NOT EXISTS public.page_seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL,
  title TEXT,
  description TEXT,
  keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.page_seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow full access to authenticated users" ON public.page_seo_settings
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create default records for main pages
INSERT INTO public.page_seo_settings (page_name, slug, title, description, keywords)
VALUES 
  ('inicio', 'inicio', 'SEOLocal - Expertos en Posicionamiento SEO para Negocios Locales', 'Aumenta los clientes de tu negocio local con nuestros servicios de SEO especializado. Mejoramos tu visibilidad en Google Maps y búsquedas locales.', 'seo local, posicionamiento local, seo google maps, seo para pymes'),
  ('servicios', 'servicios', 'Servicios SEO Local para Negocios - SEOLocal', 'Nuestros servicios de SEO local ayudan a tu negocio a aparecer en las primeras posiciones de Google en tu zona geográfica. Consultoría SEO especializada.', 'servicios seo, posicionamiento web, seo técnico, contenidos seo'),
  ('paquetes', 'paquetes', 'Paquetes de SEO Local - Precios y Servicios Incluidos', 'Elige el paquete SEO que mejor se adapte a tu negocio local. Tenemos planes para todos los presupuestos con resultados garantizados.', 'paquetes seo, precios seo local, planes seo, contratación seo'),
  ('contacto', 'contacto', 'Contacta con nuestros expertos en SEO Local - SEOLocal', 'Ponte en contacto con nuestro equipo de expertos en SEO local. Solicita información sin compromiso sobre cómo podemos ayudar a tu negocio.', 'contacto seo, asesoramiento seo, consultoría gratuita'),
  ('privacidad', 'privacidad', 'Política de Privacidad - SEOLocal', 'Política de privacidad y protección de datos de SEOLocal. Conoce cómo tratamos tus datos personales según el RGPD.', 'política privacidad, protección datos, rgpd, legal'),
  ('cookies', 'cookies', 'Política de Cookies - SEOLocal', 'Información sobre el uso de cookies en el sitio web de SEOLocal según la normativa vigente.', 'cookies, política cookies, navegación web'),
  ('terminos', 'terminos', 'Términos y Condiciones - SEOLocal', 'Términos y condiciones de uso del sitio web y los servicios ofrecidos por SEOLocal.', 'términos uso, condiciones servicio, legal');

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_seo_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_page_seo_settings_timestamp
BEFORE UPDATE ON public.page_seo_settings
FOR EACH ROW
EXECUTE FUNCTION update_seo_settings_updated_at();
