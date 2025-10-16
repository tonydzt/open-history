export interface EventCard {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  images: string[];
  tags: string[];
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
  tags: dbEvent.tags || []
});

