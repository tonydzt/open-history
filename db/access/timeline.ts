import prisma from '@/lib/db';
import { Timeline } from '@/db/model/vo/Timeline';

/**
 * 按userId分页查询用户的时间轴列表
 * @param userId 用户ID
 * @param limit 每页数量
 * @param cursor 分页游标，用于下拉加载更多
 * @returns 时间轴列表和下一个游标
 */
export const getUserTimelinesByPage = async (userId: string, limit: number = 10, cursor?: string) => {
  const queryParams: any = {
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1, // 多查询一个用于判断是否有下一页
  };

  // 如果有游标，则使用游标进行分页
  if (cursor) {
    queryParams.cursor = { id: cursor };
    queryParams.skip = 1;
  }

  const timelines = await prisma.timeline.findMany(queryParams);
  
  // 计算是否有下一页和下一个游标
  const hasNextPage = timelines.length > limit;
  const nextCursor = hasNextPage ? timelines[limit].id : null;
  
  // 返回实际需要的数据（去掉多查询的那个）
  const result = hasNextPage ? timelines.slice(0, limit) : timelines;
  
  return {
    timelines: result,
    nextCursor
  };
};

/**
 * 获取时间轴基本信息
 * @param id 时间轴ID
 * @returns 时间轴对象
 */
export const getTimelineById = async (id: string) => {
  return await prisma.timeline.findUnique({ where: { id } });
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