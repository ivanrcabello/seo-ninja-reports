
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Eye, CheckCircle, XCircle, Info } from 'lucide-react';
import { BlogPost, fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, generateSlugFromTitle } from '@/services/api/blogService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageUpload from '@/components/blog/ImageUpload';

const BlogAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    imageUrl: '',
    published: false,
    featured: false,
    slug: ''
  });

  // Fetch blog posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts
  });

  const createMutation = useMutation({
    mutationFn: (data: { post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>, image: File | null }) => 
      createBlogPost(data.post, data.image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Post creado",
        description: "El nuevo artículo del blog ha sido creado correctamente.",
      });
      handleCloseForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo crear el artículo: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, post, image }: { id: string; post: Partial<BlogPost>; image: File | null }) => 
      updateBlogPost(id, post, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Post actualizado",
        description: "El artículo del blog ha sido actualizado correctamente.",
      });
      handleCloseForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar el artículo: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Post eliminado",
        description: "El artículo del blog ha sido eliminado correctamente.",
        variant: "destructive"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el artículo: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleOpenForm = (post?: BlogPost) => {
    if (post) {
      setCurrentPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content || '',
        author: post.author,
        category: post.category,
        imageUrl: post.image_url || '',
        published: post.published,
        featured: post.featured,
        slug: post.slug
      });
      setSelectedImage(null);
    } else {
      setCurrentPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        imageUrl: '',
        published: false,
        featured: false,
        slug: ''
      });
      setSelectedImage(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentPost(null);
    setSelectedImage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Generate slug from title
      if (name === 'title' && (!currentPost || (currentPost && currentPost.slug === formData.slug))) {
        setFormData(prev => ({ ...prev, slug: generateSlugFromTitle(value) }));
      }
    }
  };

  const handleImageSelected = (file: File | null) => {
    setSelectedImage(file);
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      category: formData.category,
      image_url: formData.imageUrl,
      published: formData.published,
      featured: formData.featured,
      slug: formData.slug
    };
    
    if (currentPost) {
      // Update existing post
      updateMutation.mutate({ 
        id: currentPost.id, 
        post: postData,
        image: selectedImage
      });
    } else {
      // Add new post
      createMutation.mutate({
        post: postData,
        image: selectedImage
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      deleteMutation.mutate(id);
    }
  };

  const togglePublished = (post: BlogPost) => {
    updateMutation.mutate({
      id: post.id,
      post: { published: !post.published },
      image: null
    });
  };

  const toggleFeatured = (post: BlogPost) => {
    updateMutation.mutate({
      id: post.id,
      post: { featured: !post.featured },
      image: null
    });
  };

  if (error) {
    return (
      <Layout>
        <div className="pt-20 container px-4 sm:px-6 mx-auto">
          <BlurredCard>
            <div className="p-6">
              <h2 className="text-xl font-bold text-destructive">Error al cargar los artículos</h2>
              <p className="text-muted-foreground mt-2">No se pudieron cargar los artículos del blog. Por favor, inténtelo de nuevo más tarde.</p>
            </div>
          </BlurredCard>
        </div>
      </Layout>
    );
  }

  const insertHtmlTag = (fieldName: 'content' | 'excerpt', tag: string) => {
    const textarea = document.getElementById(fieldName) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData[fieldName].substring(start, end);
    let newText = '';

    switch (tag) {
      case 'b':
        newText = `<strong>${selectedText}</strong>`;
        break;
      case 'i':
        newText = `<em>${selectedText}</em>`;
        break;
      case 'h2':
        newText = `<h2>${selectedText}</h2>`;
        break;
      case 'h3':
        newText = `<h3>${selectedText}</h3>`;
        break;
      case 'p':
        newText = `<p>${selectedText}</p>`;
        break;
      case 'ul':
        newText = `<ul>\n  <li>${selectedText}</li>\n</ul>`;
        break;
      case 'ol':
        newText = `<ol>\n  <li>${selectedText}</li>\n</ol>`;
        break;
      case 'li':
        newText = `<li>${selectedText}</li>`;
        break;
      case 'a':
        newText = `<a href="URL" target="_blank">${selectedText}</a>`;
        break;
      default:
        newText = selectedText;
    }

    const newContent = formData[fieldName].substring(0, start) + newText + formData[fieldName].substring(end);
    setFormData(prev => ({ ...prev, [fieldName]: newContent }));

    // Set the cursor position after the operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  return (
    <Layout>
      <div className="pt-20">
        {/* Header */}
        <section className="py-8 sm:py-12">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Administración del Blog</h1>
                <p className="text-muted-foreground mt-1">Gestiona los artículos del blog de SoySeoLocal</p>
              </div>
              <Button onClick={() => handleOpenForm()} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nuevo artículo
              </Button>
            </div>
          </div>
        </section>
        
        {/* Blog Posts List */}
        <section className="py-8">
          <div className="container px-4 sm:px-6 mx-auto">
            <BlurredCard>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando artículos...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay artículos publicados aún.</p>
                    <Button onClick={() => handleOpenForm()} className="mt-4">Crear primer artículo</Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Título
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                            Autor
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                            Categoría
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                            Fecha
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                            Estado
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {posts.map((post) => (
                          <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium truncate max-w-xs">{post.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-muted-foreground">{post.author}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                                {post.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden lg:table-cell">
                              {post.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center hidden sm:table-cell">
                              <div className="flex justify-center space-x-2">
                                <span 
                                  className={`cursor-pointer inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    post.published 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                  }`}
                                  onClick={() => togglePublished(post)}
                                  title={post.published ? "Publicado" : "Borrador"}
                                >
                                  {post.published ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                  {post.published ? "Publicado" : "Borrador"}
                                </span>
                                
                                <span 
                                  className={`cursor-pointer inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    post.featured 
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                  }`}
                                  onClick={() => toggleFeatured(post)}
                                  title={post.featured ? "Destacado" : "No destacado"}
                                >
                                  {post.featured ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                  {post.featured ? "Destacado" : "Normal"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0" 
                                        onClick={() => navigate(`/blog/${post.slug}`)}
                                      >
                                        <span className="sr-only">Ver</span>
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Ver artículo</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0" 
                                        onClick={() => handleOpenForm(post)}
                                      >
                                        <span className="sr-only">Editar</span>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Editar artículo</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10" 
                                        onClick={() => handleDelete(post.id)}
                                      >
                                        <span className="sr-only">Eliminar</span>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Eliminar artículo</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </BlurredCard>
          </div>
        </section>
        
        {/* Blog Post Form Dialog */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <BlurredCard className="w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {currentPost ? 'Editar artículo' : 'Nuevo artículo'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">Título *</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug *</label>
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="author" className="block text-sm font-medium mb-1">Autor *</label>
                        <input
                          type="text"
                          id="author"
                          name="author"
                          value={formData.author}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1">Categoría *</label>
                        <input
                          type="text"
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <ImageUpload
                        currentImageUrl={formData.imageUrl}
                        onImageSelected={handleImageSelected}
                        onImageUrlChange={handleImageUrlChange}
                      />
                      
                      <div className="flex space-x-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="published"
                            name="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4"
                          />
                          <label htmlFor="published" className="text-sm font-medium">Publicado</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4"
                          />
                          <label htmlFor="featured" className="text-sm font-medium">Destacado</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label htmlFor="excerpt" className="block text-sm font-medium">Extracto *</label>
                          <div className="flex space-x-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('excerpt', 'b')}
                                  >
                                    <span className="font-bold">B</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Negrita</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('excerpt', 'i')}
                                  >
                                    <span className="italic">I</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Cursiva</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('excerpt', 'p')}
                                  >
                                    <span>P</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Párrafo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('excerpt', 'a')}
                                  >
                                    <span className="underline">A</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Enlace</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 px-2 py-0"
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>Este campo admite HTML para formatear el texto. Selecciona el texto y usa los botones para aplicar formato.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <textarea
                          id="excerpt"
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                          required
                        ></textarea>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label htmlFor="content" className="block text-sm font-medium">Contenido *</label>
                          <div className="flex space-x-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'h2')}
                                  >
                                    <span className="font-bold">H2</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Título H2</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'h3')}
                                  >
                                    <span className="font-bold">H3</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Título H3</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'b')}
                                  >
                                    <span className="font-bold">B</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Negrita</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'i')}
                                  >
                                    <span className="italic">I</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Cursiva</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'p')}
                                  >
                                    <span>P</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Párrafo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'ul')}
                                  >
                                    <span>UL</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Lista no ordenada</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'ol')}
                                  >
                                    <span>OL</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Lista ordenada</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'li')}
                                  >
                                    <span>LI</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Elemento de lista</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 w-7 p-0"
                                    onClick={() => insertHtmlTag('content', 'a')}
                                  >
                                    <span className="underline">A</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Enlace</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 px-2 py-0"
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>Este campo admite HTML para formatear el texto. Selecciona el texto y usa los botones para aplicar formato.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <textarea
                          id="content"
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          rows={10}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={handleCloseForm}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {currentPost ? 'Actualizar artículo' : 'Publicar artículo'}
                    </Button>
                  </div>
                </form>
              </div>
            </BlurredCard>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogAdmin;
