import db from '@/lib/db';

/**
 * 获取时间轴事件关联关系
 * @param timelineId 时间轴ID
 * @returns 时间轴事件关联列表
 */
export const getTimelineEvents = async (timelineId: string) => {
  return await db.timelineEvent.findMany({
    where: { timelineId },
    select: { eventId: true }
  });
};

/**
 * 根据事件ID列表获取事件信息
 * @param eventIds 事件ID列表
 * @returns 事件列表
 */
export const getEventsByIds = async (eventIds: string[]) => {
  return await db.event.findMany({
    where: { id: { in: eventIds } }
  });
};

/**
 * 从时间轴事件关联关系中提取事件ID列表
 * @param timelineEventRelations 时间轴事件关联关系列表
 * @returns 事件ID列表
 */
export const extractEventIds = (timelineEventRelations: Array<{ eventId: string }>) => {
  return timelineEventRelations.map(rel => rel.eventId);
};