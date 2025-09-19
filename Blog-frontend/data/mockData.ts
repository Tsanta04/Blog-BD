import { Post, Comment, User } from '@/types__';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    username: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    email: 'marie.martin@example.com',
    username: 'Marie Martin',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    createdAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    email: 'alex.dubois@example.com',
    username: 'Alex Dubois',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    createdAt: '2024-01-05T09:15:00Z',
  },
];

// Mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Les tendances du développement web en 2024',
    content: 'Le développement web continue d\'évoluer rapidement. Cette année, nous voyons l\'émergence de nouvelles technologies et frameworks qui révolutionnent la façon dont nous créons des applications web. React Server Components, les Web Components natifs, et l\'amélioration des performances avec les nouveaux bundlers comme Vite et Turbopack sont au cœur des discussions.\n\nL\'intelligence artificielle s\'intègre également de plus en plus dans nos workflows de développement, avec des outils comme GitHub Copilot qui transforment notre façon de coder. Les développeurs doivent s\'adapter à ces changements pour rester compétitifs sur le marché.',
    excerpt: 'Découvrez les principales tendances qui façonnent le développement web cette année, de React Server Components à l\'IA dans le développement.',
    author: mockUsers[0],
    createdAt: '2024-01-20T15:30:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    likesCount: 42,
    viewsCount: 1250,
    commentsCount: 8,
    tags: ['web', 'react', 'javascript', 'tendances'],
    isLiked: true,
  },
  {
    id: '2',
    title: 'Guide complet de React Native pour débutants',
    content: 'React Native est devenu l\'un des frameworks les plus populaires pour le développement d\'applications mobiles cross-platform. Dans ce guide, nous allons explorer les concepts fondamentaux qui vous permettront de créer votre première application mobile.\n\nNous couvrirons l\'installation de l\'environnement de développement, la création de composants, la navigation entre écrans, et la gestion de l\'état. Vous apprendrez également les meilleures pratiques pour optimiser les performances de vos applications.\n\nQue vous veniez du développement web ou que vous soyez complètement nouveau dans le développement mobile, ce guide vous donnera les bases solides pour commencer votre parcours avec React Native.',
    excerpt: 'Un guide complet pour apprendre React Native depuis les bases jusqu\'aux concepts avancés, parfait pour les développeurs débutants.',
    author: mockUsers[1],
    createdAt: '2024-01-18T10:15:00Z',
    updatedAt: '2024-01-18T10:15:00Z',
    likesCount: 67,
    viewsCount: 2100,
    commentsCount: 15,
    tags: ['react-native', 'mobile', 'tutorial', 'debutant'],
    isLiked: false,
  },
  {
    id: '3',
    title: 'Optimisation des performances en JavaScript',
    content: 'Les performances sont cruciales pour l\'expérience utilisateur. Dans cet article, nous explorerons les techniques avancées d\'optimisation JavaScript qui peuvent transformer vos applications lentes en expériences ultra-rapides.\n\nNous aborderons la gestion de la mémoire, l\'optimisation des boucles, l\'utilisation efficace des API du navigateur, et les techniques de lazy loading. Vous découvrirez également comment utiliser les outils de développement pour identifier les goulots d\'étranglement.\n\nCes techniques sont essentielles pour tout développeur qui souhaite créer des applications web performantes et offrir une expérience utilisateur exceptionnelle.',
    excerpt: 'Techniques avancées pour optimiser les performances JavaScript et créer des applications web ultra-rapides.',
    author: mockUsers[2],
    createdAt: '2024-01-16T14:45:00Z',
    updatedAt: '2024-01-16T14:45:00Z',
    likesCount: 89,
    viewsCount: 3200,
    commentsCount: 22,
    tags: ['javascript', 'performance', 'optimisation', 'web'],
    isLiked: true,
  },
  {
    id: '4',
    title: 'Introduction à TypeScript pour les développeurs JavaScript',
    content: 'TypeScript gagne en popularité chaque jour, et pour de bonnes raisons. Ce superset de JavaScript apporte la sécurité des types statiques tout en conservant la flexibilité que nous aimons dans JavaScript.\n\nDans cet article, nous explorerons pourquoi TypeScript est devenu incontournable dans le développement moderne. Nous verrons comment migrer progressivement un projet JavaScript existant vers TypeScript, et comment tirer parti des fonctionnalités avancées comme les génériques et les types conditionnels.\n\nQue vous soyez sceptique ou curieux, cet article vous donnera une perspective claire sur les avantages de TypeScript et comment l\'adopter dans vos projets.',
    excerpt: 'Découvrez pourquoi TypeScript révolutionne le développement JavaScript et comment l\'adopter dans vos projets.',
    author: mockUsers[0],
    createdAt: '2024-01-14T09:20:00Z',
    updatedAt: '2024-01-14T09:20:00Z',
    likesCount: 56,
    viewsCount: 1800,
    commentsCount: 12,
    tags: ['typescript', 'javascript', 'types', 'developpement'],
    isLiked: false,
  },
  {
    id: '5',
    title: 'Architecture moderne des applications React',
    content: 'L\'architecture d\'une application React peut faire la différence entre un projet maintenable et un cauchemar de développement. Dans cet article, nous explorerons les patterns et pratiques qui ont fait leurs preuves.\n\nNous couvrirons l\'organisation des dossiers, la gestion de l\'état avec Context API et Redux Toolkit, les patterns de composition de composants, et l\'intégration des tests. Vous apprendrez également comment structurer vos hooks personnalisés et gérer les effets de bord.\n\nCes principes vous aideront à créer des applications React scalables et maintenables, que vous travailliez seul ou en équipe.',
    excerpt: 'Patterns et pratiques pour créer des applications React scalables et maintenables avec une architecture solide.',
    author: mockUsers[1],
    createdAt: '2024-01-12T16:10:00Z',
    updatedAt: '2024-01-12T16:10:00Z',
    likesCount: 73,
    viewsCount: 2500,
    commentsCount: 18,
    tags: ['react', 'architecture', 'patterns', 'best-practices'],
    isLiked: true,
  },
];

// Mock comments
export const mockComments: { [postId: string]: Comment[] } = {
  '1': [
    {
      id: '1',
      content: 'Excellent article ! J\'ai particulièrement apprécié la partie sur React Server Components. Avez-vous des ressources supplémentaires à recommander ?',
      author: mockUsers[1],
      postId: '1',
      createdAt: '2024-01-20T16:15:00Z',
      updatedAt: '2024-01-20T16:15:00Z',
    },
    {
      id: '2',
      content: 'Merci pour ce résumé complet. L\'IA dans le développement est vraiment fascinante, j\'ai commencé à utiliser GitHub Copilot et c\'est impressionnant.',
      author: mockUsers[2],
      postId: '1',
      createdAt: '2024-01-20T17:30:00Z',
      updatedAt: '2024-01-20T17:30:00Z',
    },
  ],
  '2': [
    {
      id: '3',
      content: 'Super guide ! Je débute en React Native et cet article m\'a beaucoup aidé à comprendre les concepts de base.',
      author: mockUsers[0],
      postId: '2',
      createdAt: '2024-01-18T11:20:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
    },
    {
      id: '4',
      content: 'Très bien expliqué. Pourriez-vous faire un article sur la navigation avec React Navigation ?',
      author: mockUsers[2],
      postId: '2',
      createdAt: '2024-01-18T14:45:00Z',
      updatedAt: '2024-01-18T14:45:00Z',
    },
  ],
  '3': [
    {
      id: '5',
      content: 'Article très technique et utile. Les exemples de code sont clairs et bien expliqués.',
      author: mockUsers[0],
      postId: '3',
      createdAt: '2024-01-16T15:30:00Z',
      updatedAt: '2024-01-16T15:30:00Z',
    },
  ],
};

// Mock authentication response
export const mockAuthResponse = {
  token: 'mock-jwt-token-12345',
  user: mockUsers[0],
};