interface Post {
  id: number;
  title: string;
  content: string;
  user_id: string;
  user_name: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  tags: string[];
  medias: Media[];
}

interface Media {
  id: number;
  path_name: string;
  type: 'image' | 'video' | 'audio' | 'document';
}

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  user_name: string;
  created_at: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Mon premier post',
    content: 'Voici mon premier post sur cette plateforme ! J\'espère que vous allez apprécier le contenu que je vais partager.',
    user_id: '1',
    user_name: 'Tsanta Randria',
    created_at: '2024-01-15T10:30:00Z',
    likes_count: 12,
    comments_count: 3,
    is_liked: false,
    tags: ['première', 'bienvenue'],
    medias: [
      {
        id: 1,
        path_name: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'image'
      }
    ]
  },
  {
    id: 2,
    title: 'Voyage à la montagne',
    content: 'Une journée incroyable en montagne ! Le paysage était à couper le souffle.',
    user_id: '2',
    user_name: 'Rasoa Rakoto',
    created_at: '2024-01-14T15:45:00Z',
    likes_count: 28,
    comments_count: 7,
    is_liked: true,
    tags: ['voyage', 'montagne', 'nature'],
    medias: [
      {
        id: 2,
        path_name: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'image'
      }
    ]
  }
];

export const api = {
  // Posts
  getPosts: async (): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPosts;
  },

  getPost: async (id: string): Promise<Post | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPosts.find(post => post.id.toString() === id) || null;
  },

  createPost: async (postData: {
    title: string;
    content: string;
    tags: string[];
    medias: string[];
  }): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPost: Post = {
      id: Date.now(),
      ...postData,
      user_id: '1',
      user_name: 'John Doe',
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      medias: postData.medias.map((path, index) => ({
        id: Date.now() + index,
        path_name: path,
        type: 'image' as const
      }))
    };
    mockPosts.unshift(newPost);
    return newPost;
  },

  likePost: async (postId: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.is_liked = !post.is_liked;
      post.likes_count += post.is_liked ? 1 : -1;
    }
  },

  // Comments
  getComments: async (postId: number): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 1,
        content: 'Super post !',
        user_name: 'Alice',
        created_at: '2024-01-15T11:00:00Z'
      },
      {
        id: 2,
        content: 'J\'adore cette photo',
        user_name: 'Bob',
        created_at: '2024-01-15T11:30:00Z'
      }
    ];
  },

  addComment: async (postId: number, content: string): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now(),
      content,
      user_name: 'John Doe',
      created_at: new Date().toISOString()
    };
  },

  // Search
  searchPosts: async (query: string): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
  },

  searchUsers: async (query: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', created_at: '2024-01-01T00:00:00Z' },
      { id: '2', name: 'Marie Claire', email: 'marie@example.com', created_at: '2024-01-02T00:00:00Z' },
      { id: '3', name: 'Pierre Martin', email: 'pierre@example.com', created_at: '2024-01-03T00:00:00Z' }
    ];
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Tags
  getTags: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return ['technologie', 'voyage', 'nature', 'cuisine', 'sport', 'art', 'musique', 'photo'];
  }
};