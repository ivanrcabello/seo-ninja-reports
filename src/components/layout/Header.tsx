
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, User, LogOut } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Navbar from './Navbar';
import { supabase } from '@/integrations/supabase/client';
import { fetchLogoFromSettings } from '@/components/settings/logo/logoService';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      setLogoLoading(true);
      const logoUrl = await fetchLogoFromSettings();
      
      console.log('Fetched logo URL:', logoUrl);
      
      if (logoUrl) {
        setLogoUrl(logoUrl);
      } else {
        // Fallback to static logo if no custom logo is set
        setLogoUrl('/lovable-uploads/5bbceab4-84b0-4d87-8031-b66720c03d8f.png');
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      // Fallback to static logo
      setLogoUrl('/lovable-uploads/5bbceab4-84b0-4d87-8031-b66720c03d8f.png');
    } finally {
      setLogoLoading(false);
    }
  };

  // Check if we're on the auth page to avoid showing the header
  const isAuthPage = location.pathname === '/auth';
  if (isAuthPage) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass backdrop-blur-md bg-emerald-50/10 dark:bg-emerald-900/10 border-b border-emerald-600/10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {logoLoading ? (
              <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
            ) : logoUrl ? (
              <img 
                src={logoUrl} 
                alt="SoyLocal SEO" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  console.error('Error loading logo image');
                  setLogoUrl('/lovable-uploads/5bbceab4-84b0-4d87-8031-b66720c03d8f.png');
                }}
              />
            ) : (
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800">
                SoySeoLocal.com
              </span>
            )}
          </Link>

          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="rounded-full"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          ) : (
            <div className="flex items-center space-x-8">
              <Navbar isMobile={false} />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    <User className="inline-block mr-1 h-4 w-4" />
                    {user.email?.split('@')[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 w-full glass backdrop-blur-lg p-4 border-b border-emerald-600/10 animate-slide-down">
            <Navbar isMobile={true} closeMenu={closeMenu} />
            
            {user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-emerald-600/10 mt-4">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  <User className="inline-block mr-1 h-4 w-4" />
                  {user.email?.split('@')[0]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="justify-start text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t border-emerald-600/10 mt-4">
                <Link
                  to="/auth"
                  className="w-full"
                  onClick={closeMenu}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
