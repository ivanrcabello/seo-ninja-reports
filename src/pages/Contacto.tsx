
import React from 'react';
import Layout from '@/components/layout/Layout';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

const Contacto = () => {
  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <ContactHero />
        
        {/* Contact Form & Info */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ContactForm />
              </div>
              
              <div>
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contacto;
