export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  sourceType: 'news' | 'social' | 'personal' | 'other';
  images: string[];
  tags: string[];
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Perspective {
  id: string;
  content: string;
  authorId: string;
  author: User;
  eventId: string;
  createdAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  timestamp: string;
  sourceType: 'news' | 'social' | 'personal' | 'other';
  images: string[];
  tags: string[];
}

export interface CreatePerspectiveData {
  content: string;
}
