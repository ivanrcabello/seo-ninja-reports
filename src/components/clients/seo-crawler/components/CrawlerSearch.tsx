
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CrawlerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CrawlerSearch: React.FC<CrawlerSearchProps> = ({ searchTerm, onSearchChange }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar por dominio..."
        className="pl-8"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default CrawlerSearch;
