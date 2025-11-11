import { GeoLocation, Event } from '@/db/model/vo/Event';

export interface EventCard {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  images: string[];
  tags: string[];
  geom?: GeoLocation;
}

/**
 * 将数据库事件模型转换为EventCard视图模型
 * @param dbEvent 数据库事件模型
 * @returns EventCard视图模型
 */
export const transformToEventCard = (dbEvent: any): EventCard => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  timestamp: dbEvent.date.toISOString().slice(0, 10), // 只保留日期部分
  images: dbEvent.imageUrl ? [dbEvent.imageUrl] : [],
  tags: dbEvent.tags || [],
  // 从数据库提取地理位置信息（如果存在）
  ...(dbEvent.geom && {
    geom: {
      // 从PostgreSQL的GEOGRAPHY格式中提取经纬度
      // 格式通常为"SRID=4326;POINT(lng lat)"
      lat: parseFloat(dbEvent.geom.match(/POINT\(([^\s]+)\s+([^\)]+)\)/)?.[2] || '0'),
      lng: parseFloat(dbEvent.geom.match(/POINT\(([^\s]+)\s+([^\)]+)\)/)?.[1] || '0')
    }
  })
});

/**
 * 将Event接口转换为EventCard接口
 * @param event Event接口对象
 * @returns EventCard接口对象
 */
export const transformEventToEventCard = (event: Event): EventCard => ({
  id: event.id,
  title: event.title,
  description: event.description,
  timestamp: event.timestamp.slice(0, 10), // 只保留日期部分
  images: event.images || [],
  tags: event.tags || [],
  geom: event.geom
});

