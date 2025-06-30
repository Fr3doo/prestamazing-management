
import { NavigationItem } from '@/hooks/useNavigation';

export const defaultAdminNavigation: NavigationItem[] = [
  { path: '/admin', label: 'Tableau de bord', exact: true },
  { path: '/admin/reviews', label: 'Avis clients' },
  { path: '/admin/partners', label: 'Partenaires' },
  { path: '/admin/content', label: 'Contenu' },
  { path: '/admin/contacts', label: 'Contacts' },
  { path: '/admin/advanced', label: 'Avancé' },
];
