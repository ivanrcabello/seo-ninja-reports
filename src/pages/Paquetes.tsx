
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaquetesHero from '@/components/packs/PaquetesHero';
import PaquetesPricing from '@/components/packs/PaquetesPricing';
import PaquetesFaq from '@/components/packs/PaquetesFaq';

const Paquetes = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <PaquetesHero />
        <PaquetesPricing />
        <PaquetesFaq />
      </main>
      
      <Footer />
    </div>
  );
};

export default Paquetes;
