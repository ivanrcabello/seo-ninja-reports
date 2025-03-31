
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface MobileNavLinkProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  icon: Icon,
  children,
  onClick,
  variant = 'ghost',
  className = ''
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <Button
      variant={isActive(to) ? 'default' : variant}
      className={`justify-start ${className}`}
      asChild={to !== '#'}
      onClick={onClick}
    >
      {to === '#' ? (
        <div className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          {children}
        </div>
      ) : (
        <Link to={to} className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          {children}
        </Link>
      )}
    </Button>
  );
};

export default MobileNavLink;
