
import React from 'react';
import { Link } from 'react-router-dom';
import BlurredCard from '@/components/ui/BlurredCard';
import { Calendar, User } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/services/api/blogService';

interface BlogPostProps {
  post: BlogPostType;
  index: number;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, index }) => {
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full no-underline">
      <BlurredCard className="h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="flex flex-col h-full">
          <div className="h-48 overflow-hidden">
            <img 
              src={post.image_url || 'https://via.placeholder.com/640x360?text=SoySeoLocal'} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/640x360?text=SoySeoLocal';
              }}
            />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="mb-2">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                {post.category}
              </span>
              {post.featured && (
                <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                  Destacado
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <div 
              className="text-muted-foreground mb-4 flex-1 prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{post.date}</span>
              </div>
            </div>
          </div>
        </div>
      </BlurredCard>
    </Link>
  );
};

export default BlogPost;
