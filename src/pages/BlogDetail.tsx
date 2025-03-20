
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogPostBySlug } from '@/services/api/blogService';
import Layout from '@/components/layout/Layout';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPostBySlug(slug || ''),
    enabled: !!slug
  });
  
  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20 min-h-screen">
          <div className="container px-4 sm:px-6 mx-auto py-16">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-2/3 mx-auto"></div>
              <div className="h-6 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !post) {
    return (
      <Layout>
        <div className="pt-20 min-h-screen">
          <div className="container px-4 sm:px-6 mx-auto py-16">
            <BlurredCard>
              <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">Artículo no encontrado</h1>
                <p className="text-muted-foreground mt-4">
                  Lo sentimos, el artículo que buscas no existe o ha sido eliminado.
                </p>
                <Button className="mt-6" onClick={() => navigate('/blog')}>
                  Volver al blog
                </Button>
              </div>
            </BlurredCard>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="pt-20 min-h-screen">
        <div className="container px-4 sm:px-6 mx-auto py-16">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0 flex items-center gap-2" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Button>
          
          <article className="max-w-4xl mx-auto">
            <header className="mb-8 text-center">
              <div className="flex justify-center items-center gap-2 mb-3">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                    Destacado
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
              </div>
            </header>
            
            {post.image_url && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-auto object-cover max-h-[400px]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/1200x600?text=SoySeoLocal';
                  }}
                />
              </div>
            )}
            
            <BlurredCard>
              <div className="p-6 sm:p-8">
                <div 
                  className="text-lg font-medium mb-6 prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
                
                <Separator className="mb-6" />
                
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </BlurredCard>
          </article>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;
