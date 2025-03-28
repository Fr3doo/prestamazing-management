
import { Users, Calendar, BarChart3, Heart } from 'lucide-react';
import { ServiceDetailProps } from '@/components/ServiceDetail';

const servicesData: ServiceDetailProps[] = [
  {
    id: "team-management",
    title: "Management d'équipe",
    description: "Un service de gestion d'équipe sur mesure qui transforme vos collaborateurs en véritables ambassadeurs de votre établissement. Je forme, supervise et motive vos équipes pour créer une culture d'excellence et de service client irréprochable.",
    benefits: [
      "Formation approfondie et développement des compétences de service",
      "Techniques de motivation et d'engagement des équipes",
      "Systèmes d'évaluation et de feedback constructif",
      "Gestion des conflits et amélioration de la communication interne",
      "Création d'une culture d'entreprise forte et cohérente"
    ],
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    icon: <Users size={32} />
  },
  {
    id: "event-organization",
    title: "Organisation événementielle",
    description: "Transformez vos événements en expériences mémorables grâce à mon expertise en organisation et gestion événementielle. De la conception à l'exécution, je prends en charge chaque détail pour garantir le succès de vos réceptions, lancements et célébrations spéciales.",
    benefits: [
      "Planification stratégique et gestion de projet événementiel",
      "Coordination des prestataires et des équipes",
      "Organisation logistique impeccable",
      "Animation professionnelle et gestion de l'expérience client",
      "Analyse post-événement et recommandations d'amélioration"
    ],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
    icon: <Calendar size={32} />,
    reverse: true
  },
  {
    id: "operational-supervision",
    title: "Supervision opérationnelle",
    description: "Optimisez chaque aspect de votre établissement grâce à mes services de supervision opérationnelle. J'implémente des processus efficaces, des standards de qualité et des indicateurs de performance pour maximiser votre rentabilité tout en améliorant l'expérience client.",
    benefits: [
      "Audit complet et analyse des opérations existantes",
      "Mise en place de processus optimisés et standards de service",
      "Développement et suivi d'indicateurs de performance (KPIs)",
      "Optimisation des coûts et amélioration de la rentabilité",
      "Formation des équipes aux nouvelles procédures"
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    icon: <BarChart3 size={32} />
  },
  {
    id: "customer-experience",
    title: "Expérience client & fidélisation",
    description: "Transformez vos clients en ambassadeurs grâce à une stratégie d'expérience client exceptionnelle. Je développe et implémente des approches innovantes pour améliorer chaque point de contact avec votre clientèle, augmenter la satisfaction et garantir leur fidélité.",
    benefits: [
      "Audit et cartographie du parcours client",
      "Définition d'une signature de service distinctive",
      "Formation aux techniques d'accueil et de fidélisation",
      "Mise en place de programmes de fidélité efficaces",
      "Gestion proactive des avis clients et de la réputation"
    ],
    image: "https://images.unsplash.com/photo-1607117121584-0e34475b7604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    icon: <Heart size={32} />,
    reverse: true
  }
];

export default servicesData;
