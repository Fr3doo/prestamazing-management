
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Eye, EyeOff, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ContentForm from './ContentForm';

interface ContentSection {
  id: string;
  section_key: string;
  section_name: string;
  content_type: string;
  content_value: string | null;
  page_name: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const ContentManagement = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('page_name', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des sections:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sections de contenu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (section: ContentSection) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .update({ 
          is_active: !section.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id);

      if (error) throw error;

      setSections(sections.map(s => 
        s.id === section.id ? { ...s, is_active: !s.is_active } : s
      ));

      toast({
        title: "Succès",
        description: `Section ${!section.is_active ? 'activée' : 'désactivée'} avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de la section",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setEditingSection(null);
    setShowForm(false);
    fetchSections();
  };

  const handleFormCancel = () => {
    setEditingSection(null);
    setShowForm(false);
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.section_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (section.description && section.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPage = !selectedPage || section.page_name === selectedPage;
    return matchesSearch && matchesPage;
  });

  const uniquePages = [...new Set(sections.map(s => s.page_name))].sort();

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'textarea': return 'bg-green-100 text-green-800';
      case 'rich_text': return 'bg-purple-100 text-purple-800';
      case 'image': return 'bg-orange-100 text-orange-800';
      case 'url': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement des sections...</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingSection ? 'Modifier la section' : 'Ajouter une section'}
          </h1>
        </div>
        <ContentForm
          section={editingSection}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du contenu</h1>
            <p className="text-gray-600">Gérez le contenu de toutes les pages du site</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une section
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les pages</SelectItem>
              {uniquePages.map(page => (
                <SelectItem key={page} value={page}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSections.map((section) => (
          <Card key={section.id} className={`${!section.is_active ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{section.section_name}</CardTitle>
                    <Badge variant="outline" className={getContentTypeColor(section.content_type)}>
                      {section.content_type}
                    </Badge>
                    <Badge variant="outline">
                      {section.page_name}
                    </Badge>
                    {!section.is_active && (
                      <Badge variant="destructive">Désactivé</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Clé:</span> {section.section_key}
                  </p>
                  {section.description && (
                    <p className="text-sm text-gray-500">{section.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActiveStatus(section)}
                  >
                    {section.is_active ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Activer
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSection(section);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-1">Contenu actuel:</p>
                <p className="text-sm text-gray-600">
                  {truncateText(section.content_value)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune section trouvée</p>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
