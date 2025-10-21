import prisma from '@/lib/db';
import { Timeline } from '@/db/model/vo/Timeline';

/**
 * 获取时间轴基本信息
 * @param id 时间轴ID
 * @returns 时间轴对象
 */
export const getTimelineById = async (id: string) => {
  return await prisma.timeline.findUnique({
    where: { id }
  });
};

/**
 * 将数据库中的时间轴数据转换为TimelineJS所需的格式
 * @param timeline 数据库中的时间轴对象
 * @param events 相关的事件列表
 * @returns 格式化后的Timeline数据
 */
export const formatTimelineData = (timeline: any, events: any[]): Timeline => {
  return {
    title: {
      text: {
        headline: timeline.title,
        text: timeline.description || ''
      }
    },
    events: events.map(event => {
      const eventDate = new Date(event.date);
      
      return {
        start_date: {
          year: eventDate.getFullYear(),
          month: eventDate.getMonth() + 1,
          day: eventDate.getDate()
        },
        end_date: {
          year: eventDate.getFullYear(),
          month: eventDate.getMonth() + 1,
          day: eventDate.getDate()
        },
        text: {
          headline: event.title,
          text: event.description || ''
        },
        media: event.imageUrl
          ? {
              url: event.imageUrl,
              thumbnail: event.imageUrl,
              caption: '',
              credit: ''
            }
          : undefined,
        group: event.tags && event.tags.length > 0 ? event.tags[0] : ''
      };
    }),
    scale: 'human' as const,
    background: timeline.backgroundImageUrl
      ? {
          url: timeline.backgroundImageUrl
        }
      : undefined
  };
};