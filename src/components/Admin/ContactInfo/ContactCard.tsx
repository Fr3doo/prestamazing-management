
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

interface ContactCardProps {
  contact: ContactInfo;
  onEdit: (contact: ContactInfo) => void;
  onDelete: (id: string) => void;
}

const ContactCard = ({ contact, onEdit, onDelete }: ContactCardProps) => {
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'phone': 'bg-blue-100 text-blue-800',
      'email': 'bg-green-100 text-green-800',
      'address': 'bg-purple-100 text-purple-800',
      'hours': 'bg-orange-100 text-orange-800',
      'social': 'bg-pink-100 text-pink-800',
      'zone': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">
                {contact.label || contact.type}
              </CardTitle>
              <Badge className={getTypeColor(contact.type)}>
                {contact.type}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(contact)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(contact.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-1">Valeur:</p>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">
            {contact.value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
