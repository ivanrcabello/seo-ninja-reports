
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, User, LogOut } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Check if we're on the auth page to avoid showing the header
  const isAuthPage = location.pathname === '/auth';
  if (isAuthPage) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              SEO Ninja
            </span>
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
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-primary">
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
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 w-full glass backdrop-blur-lg p-4 border-b border-white/10 animate-slide-down">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary p-2 rounded',
                    location.pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground'
                  )}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/10">
                  <span className="text-sm font-medium text-primary">
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
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="w-full"
                  onClick={closeMenu}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
