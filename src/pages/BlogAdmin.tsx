
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';

const BlogAdmin = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState(initialBlogPosts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    imageUrl: ''
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
        imageUrl: post.imageUrl
      });
    } else {
      setCurrentPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        imageUrl: ''
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentPost(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPost) {
      // Update existing post
      const updatedPosts = posts.map(post => 
        post.id === currentPost.id 
          ? { ...post, ...formData, updatedAt: new Date().toISOString() } 
          : post
      );
      setPosts(updatedPosts);
      toast({
        title: "Post actualizado",
        description: "El artículo del blog ha sido actualizado correctamente.",
      });
    } else {
      // Add new post
      const newPost: BlogPost = {
        id: Date.now(),
        ...formData,
        date: new Date().toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPosts([newPost, ...posts]);
      toast({
        title: "Post creado",
        description: "El nuevo artículo del blog ha sido creado correctamente.",
      });
    }
    
    handleCloseForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: "Post eliminado",
        description: "El artículo del blog ha sido eliminado correctamente.",
        variant: "destructive"
      });
    }
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {/* View action */}}>
                                <span className="sr-only">Ver</span>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenForm(post)}>
                                <span className="sr-only">Editar</span>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => handleDelete(post.id)}>
                                <span className="sr-only">Eliminar</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                      
                      <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">URL de la imagen *</label>
                        <input
                          type="url"
                          id="imageUrl"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Extracto *</label>
                        <textarea
                          id="excerpt"
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1">Contenido *</label>
                        <textarea
                          id="content"
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          rows={8}
                          className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Cómo optimizar Google Business Profile para SEO local",
    excerpt: "Aprende las mejores prácticas para optimizar tu ficha de Google Business Profile y mejorar tu visibilidad en búsquedas locales.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet.",
    author: "Iván Rodríguez",
    date: "15 mayo, 2023",
    category: "SEO Local",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    createdAt: "2023-05-15T10:00:00Z",
    updatedAt: "2023-05-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Las 10 claves del SEO local para pequeños negocios",
    excerpt: "Descubre las estrategias fundamentales que todo pequeño negocio debe implementar para destacar en su área local.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet.",
    author: "María López",
    date: "3 junio, 2023",
    category: "Estrategia SEO",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80",
    createdAt: "2023-06-03T10:00:00Z",
    updatedAt: "2023-06-03T10:00:00Z"
  },
  {
    id: 3,
    title: "SEO técnico: factores que afectan a tu posicionamiento local",
    excerpt: "Análisis de los aspectos técnicos que impactan directamente en el posicionamiento de tu negocio en búsquedas locales.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet.",
    author: "Carlos Sánchez",
    date: "22 julio, 2023",
    category: "SEO Técnico",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
    createdAt: "2023-07-22T10:00:00Z",
    updatedAt: "2023-07-22T10:00:00Z"
  }
];

export default BlogAdmin;
