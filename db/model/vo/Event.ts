import { User } from './User';

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

export interface CreateEventData {
  title: string;
  description: string;
  timestamp: string;
  sourceType: 'news' | 'social' | 'personal' | 'other';
  images: string[];
  tags: string[];
  geom?: GeoLocation;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

// 类型转换函数：将数据库模型转换为前端使用的类型
export const transformEvent = (dbEvent: any) => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  timestamp: dbEvent.date.toISOString(),
  sourceType: 'news', // 默认类型
  images: [dbEvent.imageUrl],
  tags: dbEvent.tags || [],
  authorId: dbEvent.userId,
  author: {
    id: dbEvent.user.id,
    name: dbEvent.user.name || '未知用户',
    email: dbEvent.user.email || '',
    image: dbEvent.user.image || ''
  },
  // 从数据库提取地理位置信息（如果存在）
  ...(dbEvent.geom && {
    geom: {
      // 从PostgreSQL的GEOGRAPHY格式中提取经纬度
      // 格式通常为"SRID=4326;POINT(lng lat)"
      lat: parseFloat(dbEvent.geom.match(/POINT\(([^\s]+)\s+([^\)]+)\)/)?.[2] || '0'),
      lng: parseFloat(dbEvent.geom.match(/POINT\(([^\s]+)\s+([^\)]+)\)/)?.[1] || '0')
    }
  }),
  createdAt: dbEvent.createdAt.toISOString(),
  updatedAt: dbEvent.updatedAt.toISOString()
});