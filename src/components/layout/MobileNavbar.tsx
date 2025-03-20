
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { renderServiceItems, renderProductItems, renderResourceItems } from './NavDropdown';
import { useAuth } from '@/hooks/useAuth';

const MobileNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const serviceItems = renderServiceItems();
  const productItems = renderProductItems();
  const resourceItems = renderResourceItems();

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedSection(null);
  };

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <Link to="/" onClick={closeMenu}>
              <span className="font-bold text-xl">SoySeoLocal</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={closeMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <div className="px-4 space-y-2">
              {/* Services Dropdown */}
              <div className="border-b pb-2">
                <button 
                  className="flex justify-between items-center w-full py-2 font-medium"
                  onClick={() => toggleSection('services')}
                >
                  Servicios
                  {expandedSection === 'services' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSection === 'services' && (
                  <div className="pl-4 py-2 space-y-3">
                    {serviceItems.map((item, index) => (
                      <Link 
                        key={index} 
                        to={item.href} 
                        className="block py-1"
                        onClick={closeMenu}
                      >
                        <div className="font-medium">{item.label}</div>
                        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Dropdown */}
              <div className="border-b pb-2">
                <button 
                  className="flex justify-between items-center w-full py-2 font-medium"
                  onClick={() => toggleSection('products')}
                >
                  Productos
                  {expandedSection === 'products' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSection === 'products' && (
                  <div className="pl-4 py-2 space-y-3">
                    {productItems.map((item, index) => (
                      <Link 
                        key={index} 
                        to={item.href} 
                        className="block py-1"
                        onClick={closeMenu}
                      >
                        <div className="font-medium">{item.label}</div>
                        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div className="border-b pb-2">
                <button 
                  className="flex justify-between items-center w-full py-2 font-medium"
                  onClick={() => toggleSection('resources')}
                >
                  Recursos
                  {expandedSection === 'resources' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSection === 'resources' && (
                  <div className="pl-4 py-2 space-y-3">
                    {resourceItems.map((item, index) => (
                      <Link 
                        key={index} 
                        to={item.href} 
                        className="block py-1"
                        onClick={closeMenu}
                      >
                        <div className="font-medium">{item.label}</div>
                        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="py-2">
                <Link to="/contacto" className="block py-2 font-medium" onClick={closeMenu}>
                  Contacto
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link to="/dashboard" onClick={closeMenu}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
                {user.email?.includes('@soyseolocal.com') && (
                  <Link to="/blog-admin" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">Blog Admin</Button>
                  </Link>
                )}
              </div>
            ) : (
              <Link to="/auth" onClick={closeMenu}>
                <Button className="w-full">Iniciar sesión</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
