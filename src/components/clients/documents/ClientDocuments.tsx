
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, File, Trash2, Search, Grid, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClientDocumentsProps {
  clientId: string;
}

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  description: string | null;
  category: string | null;
  created_at: string;
}

export const ClientDocuments: React.FC<ClientDocumentsProps> = ({ clientId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Document categories
  const categories = [
    { value: 'general', label: 'General' },
    { value: 'report', label: 'Informe' },
    { value: 'invoice', label: 'Factura' },
    { value: 'contract', label: 'Contrato' },
    { value: 'proposal', label: 'Propuesta' },
    { value: 'legal', label: 'Legal' },
    { value: 'other', label: 'Otro' }
  ];

  useEffect(() => {
    loadDocuments();
  }, [clientId]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Error al cargar documentos');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${clientId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase
        .from('client_documents')
        .insert({
          client_id: clientId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_path: filePath,
          description: description.trim() || null,
          category: category || 'general',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) throw dbError;

      toast.success('Documento subido correctamente');
      loadDocuments();
      setDescription('');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Error al subir el documento');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  const handleDelete = async (docId: string, filePath: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      return;
    }
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('client-documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', docId);

      if (dbError) throw dbError;

      toast.success('Documento eliminado correctamente');
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error al eliminar el documento');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <File className="h-10 w-10 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <File className="h-10 w-10 text-blue-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <File className="h-10 w-10 text-blue-700" />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <File className="h-10 w-10 text-green-700" />;
    } else {
      return <File className="h-10 w-10 text-muted-foreground" />;
    }
  };
  
  // Filter documents by search query and category
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documentos</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-muted' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex-1">
                <Textarea 
                  placeholder="Descripción del documento (opcional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Subiendo...' : 'Subir documento'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay documentos que coincidan con tu búsqueda
                    </div>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.file_type)}
                          <div>
                            <p className="font-medium">{doc.file_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                            {doc.description && (
                              <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(doc.file_path, doc.file_name)}
                          >
                            Descargar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(doc.id, doc.file_path)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredDocuments.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No hay documentos que coincidan con tu búsqueda
                    </div>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="overflow-hidden">
                        <div className="p-4 flex flex-col items-center justify-center bg-muted">
                          {getFileIcon(doc.file_type)}
                          <p className="mt-2 text-sm font-medium truncate w-full text-center">{doc.file_name}</p>
                        </div>
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                          </div>
                          {doc.description && (
                            <p className="text-sm mt-2 line-clamp-2">{doc.description}</p>
                          )}
                          <div className="flex justify-between items-center mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(doc.file_path, doc.file_name)}
                            >
                              Descargar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(doc.id, doc.file_path)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            
            {categories.map((cat) => (
              <TabsContent key={cat.value} value={cat.value} className="mt-4">
                {viewMode === 'list' ? (
                  <div className="space-y-4">
                    {filteredDocuments.filter(doc => doc.category === cat.value).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay documentos en esta categoría
                      </div>
                    ) : (
                      filteredDocuments
                        .filter(doc => doc.category === cat.value)
                        .map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.file_type)}
                              <div>
                                <p className="font-medium">{doc.file_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                                </p>
                                {doc.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownload(doc.file_path, doc.file_name)}
                              >
                                Descargar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(doc.id, doc.file_path)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredDocuments.filter(doc => doc.category === cat.value).length === 0 ? (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No hay documentos en esta categoría
                      </div>
                    ) : (
                      filteredDocuments
                        .filter(doc => doc.category === cat.value)
                        .map((doc) => (
                          <Card key={doc.id} className="overflow-hidden">
                            <div className="p-4 flex flex-col items-center justify-center bg-muted">
                              {getFileIcon(doc.file_type)}
                              <p className="mt-2 text-sm font-medium truncate w-full text-center">{doc.file_name}</p>
                            </div>
                            <CardContent className="p-4">
                              <div className="text-xs text-muted-foreground">
                                {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                              </div>
                              {doc.description && (
                                <p className="text-sm mt-2 line-clamp-2">{doc.description}</p>
                              )}
                              <div className="flex justify-between items-center mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDownload(doc.file_path, doc.file_name)}
                                >
                                  Descargar
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete(doc.id, doc.file_path)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDocuments;
