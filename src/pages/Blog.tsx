
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogPosts, BlogPost as BlogPostType } from '@/services/api/blogService';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import NewsletterSignup from '@/components/blog/NewsletterSignup';

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [page, setPage] = useState(1);
  
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts
  });

  // Filter for published posts only
  const publishedPosts = posts.filter(post => post.published);
  
  // Pagination logic
  const paginatedPosts = publishedPosts.slice(0, page * POSTS_PER_PAGE);
  const hasMore = paginatedPosts.length < publishedPosts.length;
  
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <BlogHero />
        
        {/* Blog Posts */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <BlogList 
              posts={paginatedPosts} 
              isLoading={isLoading} 
              error={error as Error | null}
              loadMore={loadMore}
              hasMore={hasMore}
            />
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <NewsletterSignup />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blog;
