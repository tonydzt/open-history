export interface EventCard {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  sourceType: 'news' | 'social' | 'personal' | 'other';
  images: string[];
  tags: string[];
}