
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRepositories } from '@/hooks/useRepositories';
import { Download, Upload, Database, Calendar, FileText, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackupRecord {
  id: string;
  name: string;
  size: string;
  date: Date;
  type: 'auto' | 'manual';
  status: 'completed' | 'in_progress' | 'failed';
}

const DataBackup = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([
    {
      id: '1',
      name: 'Sauvegarde complète - 2024-06-23',
      size: '2.5 MB',
      date: new Date(),
      type: 'manual',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Sauvegarde automatique - 2024-06-22',
      size: '2.3 MB',
      date: new Date(Date.now() - 86400000),
      type: 'auto',
      status: 'completed'
    }
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const { toast } = useToast();
  const {
    reviewRepository,
    contactRepository,
    contentRepository,
    partnerRepository
  } = useRepositories();

  const createBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);
    
    try {
      // Fetch data from each table with proper type safety
      const data: any = {};
      
      // Reviews
      setBackupProgress(25);
      const reviewsData = await reviewRepository.getAllReviews();
      data.reviews = reviewsData;
      
      // Contact info
      setBackupProgress(50);
      const contactData = await contactRepository.getAllContactInfo();
      data.contact_info = contactData;
      
      // Content sections
      setBackupProgress(75);
      const contentData = await contentRepository.getAllContentSections();
      data.content_sections = contentData;
      
      // Partners logos
      setBackupProgress(100);
      const partnersData = await partnerRepository.getAllPartners();
      data.partners_logos = partnersData;
      
      // Création du fichier de sauvegarde
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: data
      };
      
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Ajouter à la liste des sauvegardes
      const newBackup: BackupRecord = {
        id: Date.now().toString(),
        name: `Sauvegarde complète - ${new Date().toLocaleDateString('fr-FR')}`,
        size: `${(blob.size / 1024 / 1024).toFixed(1)} MB`,
        date: new Date(),
        type: 'manual',
        status: 'completed'
      };
      
      setBackups([newBackup, ...backups]);
      
      toast({
        title: "Succès",
        description: "Sauvegarde créée et téléchargée avec succès"
      });
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBackup(false);
      setBackupProgress(0);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);
        
        // Validation basique du format
        if (!backupData.data || !backupData.timestamp) {
          throw new Error('Format de sauvegarde invalide');
        }
        
        toast({
          title: "Fichier chargé",
          description: `Sauvegarde du ${new Date(backupData.timestamp).toLocaleDateString('fr-FR')} prête pour la restauration`
        });
        
        // Ici vous pourriez implémenter la logique de restauration
        console.log('Données de sauvegarde:', backupData);
        
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de lire le fichier de sauvegarde",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };

  const exportTable = async (tableName: 'reviews' | 'contact_info' | 'content_sections' | 'partners_logos') => {
    try {
      let data: any[] = [];

      switch (tableName) {
        case 'reviews':
          data = await reviewRepository.getAllReviews();
          break;

        case 'contact_info':
          data = await contactRepository.getAllContactInfo();
          break;

        case 'content_sections':
          data = await contentRepository.getAllContentSections();
          break;

        case 'partners_logos':
          data = await partnerRepository.getAllPartners();
          break;
      }
      
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tableName}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Succès",
        description: `Table ${tableName} exportée en CSV`
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Impossible d'exporter la table ${tableName}`,
        variant: "destructive"
      });
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" />
          Sauvegarde & Export de données
        </h1>
        <p className="text-gray-600">Gérez vos sauvegardes et exports de données</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions de sauvegarde */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Actions de sauvegarde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Button 
                onClick={createBackup} 
                disabled={isCreatingBackup}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isCreatingBackup ? 'Création en cours...' : 'Créer une sauvegarde complète'}
              </Button>
              
              {isCreatingBackup && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{backupProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={backupProgress} />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Restaurer une sauvegarde</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="backup-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('backup-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choisir un fichier de sauvegarde
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export par table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export par table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'reviews' as const, label: 'Avis clients' },
                { name: 'contact_info' as const, label: 'Informations de contact' },
                { name: 'content_sections' as const, label: 'Sections de contenu' },
                { name: 'partners_logos' as const, label: 'Logos partenaires' }
              ].map((table) => (
                <div key={table.name} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">{table.label}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportTable(table.name)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des sauvegardes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des sauvegardes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{backup.name}</h4>
                    <Badge variant={backup.type === 'auto' ? 'secondary' : 'default'}>
                      {backup.type === 'auto' ? 'Auto' : 'Manuel'}
                    </Badge>
                    <Badge variant={
                      backup.status === 'completed' ? 'default' :
                      backup.status === 'in_progress' ? 'secondary' : 'destructive'
                    }>
                      {backup.status === 'completed' ? 'Terminé' :
                       backup.status === 'in_progress' ? 'En cours' : 'Échec'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {backup.size} • {backup.date.toLocaleString('fr-FR')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataBackup;
