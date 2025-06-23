
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, ExternalLink } from 'lucide-react';

interface Partner {
  id: string;
  partner_name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface PartnerFormProps {
  partner?: Partner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PartnerForm = ({ partner, onSuccess, onCancel }: PartnerFormProps) => {
  const [formData, setFormData] = useState({
    partner_name: '',
    website_url: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (partner) {
      setFormData({
        partner_name: partner.partner_name,
        website_url: partner.website_url || '',
      });
      setLogoPreview(partner.logo_url);
    }
  }, [partner]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 2MB",
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    
    // Créer une preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `partners/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('partners-logos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('partners-logos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.partner_name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du partenaire est requis",
        variant: "destructive",
      });
      return;
    }

    if (!partner && !logoFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un logo",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let logoUrl = partner?.logo_url || '';

      // Upload du nouveau logo si nécessaire
      if (logoFile) {
        setUploading(true);
        logoUrl = await uploadLogo(logoFile);
        setUploading(false);
      }

      if (partner) {
        // Mise à jour
        const { error } = await supabase
          .from('partners_logos')
          .update({
            partner_name: formData.partner_name.trim(),
            website_url: formData.website_url.trim() || null,
            logo_url: logoUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', partner.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Partenaire mis à jour avec succès",
        });
      } else {
        // Création - récupérer le prochain display_order
        const { data: maxOrderData } = await supabase
          .from('partners_logos')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1);

        const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1;

        const { error } = await supabase
          .from('partners_logos')
          .insert({
            partner_name: formData.partner_name.trim(),
            website_url: formData.website_url.trim() || null,
            logo_url: logoUrl,
            display_order: nextOrder,
          });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Partenaire ajouté avec succès",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le partenaire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="partner_name">Nom du partenaire *</Label>
        <Input
          id="partner_name"
          value={formData.partner_name}
          onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
          required
          placeholder="Nom de l'entreprise partenaire"
        />
      </div>

      <div>
        <Label htmlFor="website_url">Site web</Label>
        <Input
          id="website_url"
          type="url"
          value={formData.website_url}
          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
          placeholder="https://www.exemple.com"
        />
        {formData.website_url && (
          <a
            href={formData.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
          >
            <ExternalLink className="h-3 w-3" />
            Tester le lien
          </a>
        )}
      </div>

      <div>
        <Label>Logo du partenaire *</Label>
        
        {logoPreview ? (
          <Card className="mt-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={logoPreview}
                  alt="Aperçu du logo"
                  className="h-16 w-16 object-contain bg-gray-100 rounded border"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {logoFile ? logoFile.name : 'Logo actuel'}
                  </p>
                  {logoFile && (
                    <p className="text-xs text-gray-500">
                      {(logoFile.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-2">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 2MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {uploading ? 'Upload en cours...' : loading ? 'Sauvegarde...' : (partner ? 'Mettre à jour' : 'Ajouter')}
        </Button>
      </div>
    </form>
  );
};

export default PartnerForm;
