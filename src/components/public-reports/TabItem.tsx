
import React from 'react';

interface TabItemProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const TabItem: React.FC<TabItemProps> = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 ${
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
      }`}
    >
      {children}
    </button>
  );
};
