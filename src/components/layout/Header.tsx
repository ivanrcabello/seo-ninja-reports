
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import { fetchLogoFromSettings } from '@/components/settings/logo/logoService';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const cachedLogo = localStorage.getItem('app_logo_url');
    if (cachedLogo) {
      setLogoUrl(cachedLogo);
      setLogoLoading(false);
    }
    
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      setLogoLoading(true);
      const logoUrl = await fetchLogoFromSettings();
      
      if (logoUrl) {
        setLogoUrl(logoUrl);
        localStorage.setItem('app_logo_url', logoUrl);
      } else {
        setLogoUrl('/lovable-uploads/5bbceab4-84b0-4d87-8031-b66720c03d8f.png');
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      setLogoUrl('/lovable-uploads/5bbceab4-84b0-4d87-8031-b66720c03d8f.png');
    } finally {
      setLogoLoading(false);
    }
  };

  const isAuthPage = location.pathname === '/auth';
  if (isAuthPage) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {logoLoading ? (
              <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
            ) : logoUrl ? (
              <img 
                src={logoUrl} 
                alt="SoySeoLocal" 
                className="h-10 w-auto object-contain"
                onError={() => {
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
            <Navbar isMobile={false} />
          )}
        </div>

        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-background p-4 border-b animate-slide-down">
            <Navbar isMobile={true} closeMenu={closeMenu} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
