
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Menu, User } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

const Header = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/509b18fe-6ed5-47e8-9cde-5aa13a1de63e.png" alt="SEOLocal" className="h-10" />
            </Link>
          </div>

          <DesktopNavbar />
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  Área de admin
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth">
                  <User className="h-4 w-4 mr-2" />
                  Acceder
                </Link>
              </Button>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <MobileNavbar
        closeMenu={() => setIsMobileMenuOpen(false)}
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
      />
    </header>
  );
};

export default Header;
