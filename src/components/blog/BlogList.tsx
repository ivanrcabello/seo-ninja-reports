
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/services/api/blogService';
import BlogPost from './BlogPost';

interface BlogListProps {
  posts: BlogPostType[];
  isLoading: boolean;
  error: Error | null;
  loadMore?: () => void;
  hasMore?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({ posts, isLoading, error, loadMore, hasMore = false }) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-destructive">Error al cargar los artículos</h3>
        <p className="text-muted-foreground mt-2">No se pudieron cargar los artículos del blog. Por favor, inténtelo de nuevo más tarde.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Cargando artículos...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay artículos publicados aún.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <AnimatedContainer key={post.id} animation="slide-up" delay={index * 100}>
            <BlogPost post={post} index={index} />
          </AnimatedContainer>
        ))}
      </div>
      
      {hasMore && loadMore && (
        <div className="mt-16 text-center">
          <Button size="lg" variant="outline" onClick={loadMore}>
            Cargar más artículos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default BlogList;
