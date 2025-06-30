
import React from 'react';
import ContactCard from './ContactCard';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

interface ContactListProps {
  contacts: ContactInfo[];
  onEdit: (contact: ContactInfo) => void;
  onDelete: (id: string) => void;
}

const ContactList = ({ contacts, onEdit, onDelete }: ContactListProps) => {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune information de contact trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ContactList;
