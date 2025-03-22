
import React, { useState, useEffect } from 'react';
import { getRecommendationPriority, formatReportContent } from '@/utils/reportUtils';
import PriorityBadge from './PriorityBadge';
import { ChevronDown, ChevronUp, AlertTriangle, Check, Clock, Info, Edit, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface RecommendationsListProps {
  content: string;
  isPublic?: boolean;
  isEditing?: boolean;
  onEdit?: (newContent: string) => void;
}

// Define categories for recommendations
const CATEGORIES = {
  TECHNICAL: 'Técnico',
  CONTENT: 'Contenido',
  KEYWORDS: 'Palabras Clave',
  SPEED: 'Velocidad',
  LOCAL: 'SEO Local',
  BACKLINKS: 'Backlinks',
  OTHER: 'Otros'
};

const RecommendationsList: React.FC<RecommendationsListProps> = ({ 
  content, 
  isPublic = false,
  isEditing = false,
  onEdit = () => {}
}) => {
  // State for expanded items
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [categorizedRecommendations, setCategorizedRecommendations] = useState<Record<string, any[]>>({});
  
  // Categorize recommendations based on their content
  useEffect(() => {
    if (!content) return;
    
    const recommendations = content.split('\n').filter(item => item.trim() !== '');
    const categorized: Record<string, any[]> = {};
    
    recommendations.forEach((item, index) => {
      const cleanItem = item.replace(/^\d+\.\s*/, '');
      const priority = getRecommendationPriority(cleanItem);
      const category = getCategoryForRecommendation(cleanItem);
      
      if (!categorized[category]) {
        categorized[category] = [];
      }
      
      categorized[category].push({
        content: cleanItem,
        priority,
        index,
        originalIndex: index + 1
      });
    });
    
    setCategorizedRecommendations(categorized);
  }, [content]);
  
  // Determine category based on content
  const getCategoryForRecommendation = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('velocidad') || lowerText.includes('pagespeed') || 
        lowerText.includes('carga') || lowerText.includes('speed')) {
      return CATEGORIES.SPEED;
    }
    
    if (lowerText.includes('local') || lowerText.includes('gmb') || 
        lowerText.includes('google my business') || lowerText.includes('google business profile')) {
      return CATEGORIES.LOCAL;
    }
    
    if (lowerText.includes('keyword') || lowerText.includes('palabra clave') || 
        lowerText.includes('palabras clave') || lowerText.includes('search intent')) {
      return CATEGORIES.KEYWORDS;
    }
    
    if (lowerText.includes('contenido') || lowerText.includes('content') || 
        lowerText.includes('texto') || lowerText.includes('artículo') || lowerText.includes('blog')) {
      return CATEGORIES.CONTENT;
    }
    
    if (lowerText.includes('enlace') || lowerText.includes('backlink') || 
        lowerText.includes('link') || lowerText.includes('autoridad')) {
      return CATEGORIES.BACKLINKS;
    }
    
    if (lowerText.includes('técnico') || lowerText.includes('technical') || 
        lowerText.includes('indexa') || lowerText.includes('crawl') || 
        lowerText.includes('url') || lowerText.includes('sitemap') || 
        lowerText.includes('robot') || lowerText.includes('schema') || 
        lowerText.includes('estructura')) {
      return CATEGORIES.TECHNICAL;
    }
    
    return CATEGORIES.OTHER;
  };
  
  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Get active categories
  const getActiveCategories = () => {
    return Object.keys(categorizedRecommendations);
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case CATEGORIES.TECHNICAL:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case CATEGORIES.CONTENT:
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case CATEGORIES.KEYWORDS:
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case CATEGORIES.SPEED:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case CATEGORIES.LOCAL:
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case CATEGORIES.BACKLINKS:
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  // Get the appropriate icon based on priority
  const getPriorityIcon = (priority: any) => {
    if (priority.color.includes("red")) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (priority.color.includes("amber")) return <Clock className="h-5 w-5 text-amber-600" />;
    if (priority.color.includes("green")) return <Check className="h-5 w-5 text-green-600" />;
    return <Info className="h-5 w-5 text-blue-600" />;
  };
  
  // If content is already HTML formatted
  if (content.includes('<li') || content.includes('<p') || content.includes('<h')) {
    return (
      <div className="relative">
        {isEditing && !isPublic && onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute right-0 top-0"
            onClick={() => onEdit(content)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
        <div 
          dangerouslySetInnerHTML={{ __html: formatReportContent(content) }} 
          className="prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold" 
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 relative">
      {isEditing && !isPublic && onEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute right-0 top-0"
          onClick={() => onEdit(content)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      )}
      
      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm font-medium">Filtrar por:</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {activeFilter || 'Todas las categorías'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setActiveFilter(null)}>
              Todas las categorías
            </DropdownMenuItem>
            {getActiveCategories().map(category => (
              <DropdownMenuItem 
                key={category} 
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {activeFilter && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveFilter(null)}
            className="h-8 px-2"
          >
            Limpiar filtro
          </Button>
        )}
      </div>
      
      {/* Category sections */}
      {getActiveCategories()
        .filter(category => !activeFilter || category === activeFilter)
        .map(category => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline" className={cn("font-normal", getCategoryColor(category))}>
                {category}
              </Badge>
              <span>Recomendaciones</span>
            </h3>
            
            <div className="space-y-3">
              {categorizedRecommendations[category].map((item, i) => {
                const isExpanded = expandedItems[item.index] ?? false;
                
                // Split the content if it's longer than 100 characters
                const hasLongContent = item.content.length > 120;
                const shortContent = hasLongContent ? `${item.content.substring(0, 120)}...` : item.content;
                
                return (
                  <div 
                    key={item.index} 
                    className={`flex flex-col rounded-lg backdrop-blur-sm shadow-sm border hover:shadow-md transition-all overflow-hidden ${item.priority.background} ${item.priority.border}`}
                  >
                    <div className="flex items-start gap-3 p-4">
                      <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {item.originalIndex}
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-2">
                        <div className="flex-grow">
                          {hasLongContent && !isExpanded ? shortContent : item.content}
                        </div>
                        <div className="flex items-center gap-2 self-start mt-1 sm:mt-0">
                          <PriorityBadge priority={item.priority} />
                          {hasLongContent && (
                            <button 
                              onClick={() => toggleItem(item.index)}
                              className="p-1 rounded-full hover:bg-white/30 transition-colors"
                              aria-label={isExpanded ? "Colapsar" : "Expandir"}
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {hasLongContent && (
                      <div 
                        className={cn(
                          "border-t transition-all duration-300 overflow-hidden", 
                          item.priority.border,
                          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 hidden"
                        )}
                      >
                        <div className="p-4 pt-3">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
      {getActiveCategories().length === 0 && (
        <div className="p-8 text-center border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No hay recomendaciones disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsList;
