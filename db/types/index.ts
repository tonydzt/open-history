export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// 地理位置类型定义
export interface GeoLocation {
  lat: number;
  lng: number;
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
  geom?: GeoLocation;
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
  geom?: GeoLocation;
}

export interface CreatePerspectiveData {
  content: string;
}

export interface TimelineData {
  id: string;
  title: string;
  description: string;
  events: Event[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
};


