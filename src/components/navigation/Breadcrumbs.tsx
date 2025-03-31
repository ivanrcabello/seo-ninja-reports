
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

interface BreadcrumbsProps {
  items?: {
    label: string;
    href?: string;
  }[];
  className?: string;
}

const Breadcrumbs = ({ items = [], className = '' }: BreadcrumbsProps) => {
  const location = useLocation();
  
  // Generate breadcrumbs from path if no items provided
  const getDefaultBreadcrumbs = () => {
    if (items.length > 0) return items;
    
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ label: 'Inicio', href: '/' }];
    
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      
      // Handle special cases
      const label = getBreadcrumbLabel(segment, currentPath);
      
      // Only add if it's a valid segment
      if (label) {
        breadcrumbs.push({
          label,
          href: currentPath === location.pathname ? undefined : currentPath
        });
      }
    });
    
    return breadcrumbs;
  };
  
  // Get a user-friendly name for breadcrumb segments
  const getBreadcrumbLabel = (segment: string, fullPath: string) => {
    // Skip certain segments that aren't meaningful as breadcrumbs
    if (['auth', 'index'].includes(segment)) return null;
    
    // Map paths to user-friendly names
    const labelMap: Record<string, string> = {
      'dashboard': 'Panel de Control',
      'clients': 'Clientes',
      'reports': 'Informes',
      'settings': 'Configuración',
      'activity': 'Actividad',
      'invoices': 'Facturas',
      'proposals': 'Propuestas',
      'contracts': 'Contratos',
      'crawl': 'Análisis SEO',
      'portal': 'Portal de Cliente',
      'shared': 'Compartido',
    };
    
    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };
  
  const breadcrumbs = getDefaultBreadcrumbs();
  
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <Breadcrumb className={`mb-4 ${className}`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        {breadcrumbs.slice(1).map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {breadcrumb.href ? (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            
            {index < breadcrumbs.length - 2 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
