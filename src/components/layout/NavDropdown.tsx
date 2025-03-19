
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface DropdownItem {
  title: string;
  description: string;
  href?: string;
}

interface NavDropdownProps {
  items: DropdownItem[];
  columns?: number;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ items, columns = 2 }) => {
  return (
    <NavigationMenuContent>
      <ul className={`grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-${columns}`}>
        {items.map((item) => (
          <li key={item.title} className={columns === 2 ? "row-span-3" : ""}>
            <NavigationMenuLink asChild>
              <Link
                to={item.href || "/"}
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-sm font-medium leading-none">{item.title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </NavigationMenuContent>
  );
};

export default NavDropdown;
