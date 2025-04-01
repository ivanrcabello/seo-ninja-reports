
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, Settings, Newspaper, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface UserDropdownProps {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
  };
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.avatar_url || undefined} alt={user.name || 'Usuario'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{user.name || user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard">
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/blog">
              <Newspaper className="mr-2 h-4 w-4" />
              <span>Blog Admin</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
