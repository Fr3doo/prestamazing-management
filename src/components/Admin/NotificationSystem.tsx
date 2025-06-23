
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, Settings, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationRule {
  id: string;
  name: string;
  type: 'email' | 'internal' | 'sms';
  trigger: 'new_review' | 'contact_form' | 'low_rating' | 'system';
  condition?: string;
  recipients: string[];
  enabled: boolean;
  template: string;
}

const NotificationSystem = () => {
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'Nouvel avis client',
      type: 'email',
      trigger: 'new_review',
      recipients: ['admin@example.com'],
      enabled: true,
      template: 'Un nouvel avis a été ajouté: {{review_content}}'
    },
    {
      id: '2',
      name: 'Avis négatif',
      type: 'email',
      trigger: 'low_rating',
      condition: 'rating <= 2',
      recipients: ['admin@example.com'],
      enabled: true,
      template: 'Attention: avis négatif reçu ({{rating}}/5)'
    }
  ]);
  
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nouvel avis client',
      message: 'Jean D. a laissé un avis 5 étoiles',
      timestamp: new Date(),
      read: false,
      type: 'review'
    },
    {
      id: '2',
      title: 'Nouveau contact',
      message: 'Formulaire de contact rempli par Marie L.',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      type: 'contact'
    }
  ]);

  const [showCreateRule, setShowCreateRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<NotificationRule>>({
    type: 'email',
    trigger: 'new_review',
    enabled: true,
    recipients: [],
    template: ''
  });

  const { toast } = useToast();

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.template) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const rule: NotificationRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      type: newRule.type!,
      trigger: newRule.trigger!,
      recipients: newRule.recipients!,
      enabled: newRule.enabled!,
      template: newRule.template!,
      condition: newRule.condition
    };

    setRules([...rules, rule]);
    setNewRule({
      type: 'email',
      trigger: 'new_review',
      enabled: true,
      recipients: [],
      template: ''
    });
    setShowCreateRule(false);

    toast({
      title: "Succès",
      description: "Règle de notification créée"
    });
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast({
      title: "Succès",
      description: "Règle supprimée"
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Système de notifications
          </h1>
          <p className="text-gray-600">Gérez vos notifications et alertes</p>
        </div>
        <Badge variant={unreadCount > 0 ? "destructive" : "secondary"}>
          {unreadCount} non lues
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notifications récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.timestamp.toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Règles de notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Règles de notification
              </div>
              <Button onClick={() => setShowCreateRule(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex gap-2">
                      <Badge variant="outline">{rule.type}</Badge>
                      <Badge variant="outline">{rule.trigger}</Badge>
                    </div>
                    <p>Destinataires: {rule.recipients.join(', ')}</p>
                    <p className="italic">{rule.template}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de création de règle */}
      {showCreateRule && (
        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle règle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-name">Nom de la règle *</Label>
                <Input
                  id="rule-name"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Nom descriptif"
                />
              </div>
              <div>
                <Label htmlFor="rule-type">Type de notification</Label>
                <Select
                  value={newRule.type}
                  onValueChange={(value: 'email' | 'internal' | 'sms') =>
                    setNewRule({ ...newRule, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="internal">Interne</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-trigger">Déclencheur</Label>
                <Select
                  value={newRule.trigger}
                  onValueChange={(value: any) => setNewRule({ ...newRule, trigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_review">Nouvel avis</SelectItem>
                    <SelectItem value="contact_form">Formulaire de contact</SelectItem>
                    <SelectItem value="low_rating">Note faible</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rule-recipients">Destinataires (emails séparés par ,)</Label>
                <Input
                  id="rule-recipients"
                  value={newRule.recipients?.join(', ') || ''}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      recipients: e.target.value.split(',').map(email => email.trim())
                    })
                  }
                  placeholder="admin@example.com, user@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rule-template">Template du message *</Label>
              <Textarea
                id="rule-template"
                value={newRule.template || ''}
                onChange={(e) => setNewRule({ ...newRule, template: e.target.value })}
                placeholder="Message de notification. Utilisez {{variable}} pour les données dynamiques."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateRule(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateRule}>
                Créer la règle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationSystem;
