import { User } from './User';

export interface Event {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  sourceType: 'news' | 'social' | 'personal' | 'other';
  images: string[];
  tags: string[];
  userId: string;
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

export interface EventsPageResponse {
  events: Event[];
  total: number;
}

// 类型转换函数：将数据库模型转换为前端使用的类型
export const transformEvent = (dbEvent: any) => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  timestamp: (dbEvent.date instanceof Date)
  ? dbEvent.date.toISOString() 
  : dbEvent.date,
  sourceType: 'news', // 默认类型
  images: [dbEvent.imageUrl],
  tags: dbEvent.tags || [],
  userId: dbEvent.userId,
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
  createdAt: (dbEvent.createdAt instanceof Date)
  ? dbEvent.createdAt.toISOString() 
  : dbEvent.createdAt,
  updatedAt: (dbEvent.updatedAt instanceof Date)
  ? dbEvent.updatedAt.toISOString() 
  : dbEvent.updatedAt,
});

export const transformCollectionEventToEvent = (dbCollectionEvent: any): Event => {
  // 确保传入的对象包含Event属性
  if (!dbCollectionEvent.Event) {
    throw new Error('Invalid collectionEvent: Event property is missing');
  }
  const dbEvent = dbCollectionEvent.Event;
  return transformEvent(dbEvent);
};

