
import React from 'react';
import { LogOut, LayoutDashboard, Newspaper, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MobileNavLink from './MobileNavLink';

// Define the User interface that matches what's used in AuthContext
interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface MobileUserNavProps {
  user: User;
  closeMenu: () => void;
  handleSignOut: () => Promise<void>;
}

const MobileUserNav: React.FC<MobileUserNavProps> = ({ 
  user, 
  closeMenu, 
  handleSignOut 
}) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-3 pb-6 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar_url || undefined} alt={user.name || 'User'} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{user.name || 'Usuario'}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      </div>
      
      <nav className="flex flex-col space-y-1">
        <MobileNavLink 
          to="/dashboard" 
          icon={LayoutDashboard}
          onClick={closeMenu}
          variant="default"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Dashboard
        </MobileNavLink>
        
        <MobileNavLink 
          to="/blog-admin" 
          icon={Newspaper}
          onClick={closeMenu}
          variant="outline"
        >
          Blog Admin
        </MobileNavLink>
        
        <MobileNavLink 
          to="/settings" 
          icon={Settings}
          onClick={closeMenu}
          variant="outline"
        >
          Configuración
        </MobileNavLink>
        
        <Button
          variant="ghost"
          className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={async () => {
            await handleSignOut();
            closeMenu();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </nav>
    </div>
  );
};

export default MobileUserNav;
