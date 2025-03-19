
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import useAuth from '@/hooks/useAuth';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import CTASection from '@/components/homepage/CTASection';

const Index = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Preload dashboard route for logged in users
  useEffect(() => {
    if (user) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/dashboard';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        <CTASection isLoggedIn={isLoggedIn} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
