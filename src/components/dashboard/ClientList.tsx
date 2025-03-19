
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Loader2 } from 'lucide-react';
import ClientCard from './ClientCard';
import useClients, { Client } from '@/hooks/useClients';
import AnimatedContainer from '../ui/AnimatedContainer';

const ClientList: React.FC = () => {
  const { clients, isLoading, addClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    website: '',
    industry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter clients based on search
  const filteredClients = clients.filter(client => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.website.toLowerCase().includes(query) ||
      client.industry.toLowerCase().includes(query)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleIndustryChange = (value: string) => {
    setNewClient(prev => ({ ...prev, industry: value }));
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClient.name || !newClient.website || !newClient.industry) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addClient(newClient);
      setNewClient({ name: '', website: '', industry: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 glass-input w-full sm:w-[300px]"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Add Client</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass">
            <form onSubmit={handleAddClient}>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new client to your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    placeholder="Acme Corporation"
                    className="glass-input"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={newClient.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="glass-input"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={newClient.industry}
                    onValueChange={handleIndustryChange}
                    required
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Client'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredClients.length === 0 ? (
        <AnimatedContainer animation="fade" className="text-center py-12">
          <h3 className="text-xl font-medium text-muted-foreground">No clients found</h3>
          <p className="text-muted-foreground mt-2">Try a different search or add a new client.</p>
        </AnimatedContainer>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <ClientCard key={client.id} client={client} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;
