
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Image, Code, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SEOConfig {
  page: string;
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  robots: string;
}

const SEOConfiguration = () => {
  const [configs, setConfigs] = useState<SEOConfig[]>([]);
  const [selectedPage, setSelectedPage] = useState('home');
  const [currentConfig, setCurrentConfig] = useState<SEOConfig>({
    page: 'home',
    title: '',
    description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    robots: 'index, follow'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const pages = [
    { key: 'home', label: 'Accueil', path: '/' },
    { key: 'about', label: 'À propos', path: '/about' },
    { key: 'services', label: 'Services', path: '/services' },
    { key: 'contact', label: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    fetchSEOConfigs();
  }, []);

  useEffect(() => {
    const config = configs.find(c => c.page === selectedPage);
    if (config) {
      setCurrentConfig(config);
    } else {
      setCurrentConfig({
        page: selectedPage,
        title: '',
        description: '',
        keywords: '',
        og_title: '',
        og_description: '',
        og_image: '',
        canonical_url: '',
        robots: 'index, follow'
      });
    }
  }, [selectedPage, configs]);

  const fetchSEOConfigs = async () => {
    try {
      // Pour cet exemple, nous utilisons la table content_sections pour stocker les configs SEO
      // En production, vous pourriez créer une table dédiée
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', 'seo_config');

      if (error) throw error;

      // Simule des configurations SEO par défaut
      const defaultConfigs: SEOConfig[] = [
        {
          page: 'home',
          title: 'Prestamazing Management - Excellence en Management de Restauration',
          description: 'Expert en management de restauration. Services de formation d\'équipe, supervision opérationnelle et optimisation de l\'expérience client.',
          keywords: 'management restauration, formation équipe restaurant, supervision restaurant, consultant restaurant',
          og_title: 'Prestamazing Management - Excellence en Management',
          og_description: 'Expert en management de restauration avec services complets.',
          og_image: 'https://prestamazing-management.lovable.app/og-image.jpg',
          canonical_url: 'https://prestamazing-management.lovable.app/',
          robots: 'index, follow'
        },
        {
          page: 'about',
          title: 'À propos - Prestamazing Management',
          description: 'Découvrez notre expertise en management de restauration et notre approche personnalisée.',
          keywords: 'à propos, expertise restaurant, consultant expérimenté',
          og_title: 'À propos - Prestamazing Management',
          og_description: 'Notre expertise en management de restauration.',
          og_image: 'https://prestamazing-management.lovable.app/og-about.jpg',
          canonical_url: 'https://prestamazing-management.lovable.app/about',
          robots: 'index, follow'
        }
      ];

      setConfigs(defaultConfigs);
    } catch (error) {
      console.error('Erreur lors du chargement des configs SEO:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      // Mise à jour de la configuration
      const updatedConfigs = configs.map(c => 
        c.page === currentConfig.page ? currentConfig : c
      );
      
      if (!configs.find(c => c.page === currentConfig.page)) {
        updatedConfigs.push(currentConfig);
      }
      
      setConfigs(updatedConfigs);
      
      toast({
        title: "Succès",
        description: "Configuration SEO sauvegardée"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive"
      });
    }
  };

  const analyzeCurrentPage = () => {
    const issues = [];
    
    if (!currentConfig.title || currentConfig.title.length < 30) {
      issues.push('Titre trop court (recommandé: 30-60 caractères)');
    }
    if (currentConfig.title && currentConfig.title.length > 60) {
      issues.push('Titre trop long (recommandé: 30-60 caractères)');
    }
    if (!currentConfig.description || currentConfig.description.length < 120) {
      issues.push('Description trop courte (recommandé: 120-160 caractères)');
    }
    if (currentConfig.description && currentConfig.description.length > 160) {
      issues.push('Description trop longue (recommandé: 120-160 caractères)');
    }
    if (!currentConfig.keywords) {
      issues.push('Mots-clés manquants');
    }
    if (!currentConfig.og_image) {
      issues.push('Image Open Graph manquante');
    }
    
    return issues;
  };

  const issues = analyzeCurrentPage();

  if (loading) {
    return <div className="p-6">Chargement de la configuration SEO...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Search className="h-6 w-6" />
          Configuration SEO
        </h1>
        <p className="text-gray-600">Optimisez le référencement de votre site</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sélection de page */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.key}
                  onClick={() => setSelectedPage(page.key)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPage === page.key
                      ? 'bg-primary text-white border-primary'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{page.label}</div>
                  <div className="text-sm opacity-70">{page.path}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">Configuration de base</TabsTrigger>
              <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
              <TabsTrigger value="analysis">Analyse</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO de base - {pages.find(p => p.key === selectedPage)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre de la page *</Label>
                    <Input
                      id="title"
                      value={currentConfig.title}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, title: e.target.value })}
                      placeholder="Titre optimisé pour le SEO (30-60 caractères)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {currentConfig.title.length}/60 caractères
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Meta description *</Label>
                    <Textarea
                      id="description"
                      value={currentConfig.description}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, description: e.target.value })}
                      placeholder="Description concise et attractive (120-160 caractères)"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {currentConfig.description.length}/160 caractères
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Mots-clés</Label>
                    <Input
                      id="keywords"
                      value={currentConfig.keywords}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, keywords: e.target.value })}
                      placeholder="mots-clés, séparés, par, des, virgules"
                    />
                  </div>

                  <div>
                    <Label htmlFor="canonical">URL canonique</Label>
                    <Input
                      id="canonical"
                      value={currentConfig.canonical_url}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, canonical_url: e.target.value })}
                      placeholder="https://votre-site.com/page"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Open Graph (Facebook, LinkedIn)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="og_title">Titre Open Graph</Label>
                    <Input
                      id="og_title"
                      value={currentConfig.og_title}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, og_title: e.target.value })}
                      placeholder="Titre pour les partages sociaux"
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_description">Description Open Graph</Label>
                    <Textarea
                      id="og_description"
                      value={currentConfig.og_description}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, og_description: e.target.value })}
                      placeholder="Description pour les partages sociaux"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_image">Image Open Graph</Label>
                    <Input
                      id="og_image"
                      value={currentConfig.og_image}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, og_image: e.target.value })}
                      placeholder="URL de l'image (1200x630px recommandé)"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Configuration avancée
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="robots">Directives robots</Label>
                    <Input
                      id="robots"
                      value={currentConfig.robots}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, robots: e.target.value })}
                      placeholder="index, follow"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Options: index/noindex, follow/nofollow, archive, snippet
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Configuration technique</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Sitemap: /sitemap.xml</li>
                      <li>• Robots.txt: /robots.txt</li>
                      <li>• Schema.org: Activé automatiquement</li>
                      <li>• Google Search Console: Configuration requise</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse SEO - {pages.find(p => p.key === selectedPage)?.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      {issues.length === 0 ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-600 font-medium">Configuration SEO optimale</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          <span className="text-orange-600 font-medium">{issues.length} point(s) à améliorer</span>
                        </>
                      )}
                    </div>

                    {issues.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Recommandations:</h4>
                        {issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-orange-800">{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Score SEO</h4>
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.max(0, 100 - (issues.length * 15))}%
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Optimisations</h4>
                        <div className="text-2xl font-bold text-green-600">
                          {Math.max(0, 7 - issues.length)}/7
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={saveConfig}>
              Sauvegarder la configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOConfiguration;
