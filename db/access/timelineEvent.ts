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

/**
 * 根据ID获取时间轴
 * @param timelineId 时间轴ID
 * @returns 时间轴对象，如果不存在则返回null
 */
export const getTimelineById = async (timelineId: string) => {
  // 验证参数
  if (!timelineId || typeof timelineId !== 'string') {
    throw new Error('时间轴ID不能为空');
  }

  return await db.timeline.findUnique({
    where: { id: timelineId },
    select: {
      id: true,
      userId: true,
    },
  });
};

/**
 * 验证时间轴是否存在
 * @param timelineId 时间轴ID
 * @param userId 可选，用户ID，用于验证时间轴是否属于该用户
 * @returns 时间轴对象
 */
export const verifyTimelineExists = async (timelineId: string, userId?: string) => {
  const timeline = await getTimelineById(timelineId);
  
  if (!timeline) {
    throw new Error('时间轴不存在');
  }

  // 如果提供了userId，验证时间轴是否属于该用户
  if (userId && timeline.userId !== userId) {
    throw new Error('没有权限访问该时间轴');
  }

  return timeline;
};

/**
 * 创建时间轴与事件的关联关系
 * @param timelineId 时间轴ID
 * @param eventId 事件ID
 * @param userId 可选，用户ID，用于验证时间轴是否属于该用户
 * @returns 创建的关联关系对象
 */
export const createTimelineEvent = async (
  timelineId: string,
  eventId: string,
  userId?: string
) => {
  // 验证参数
  if (!timelineId || typeof timelineId !== 'string') {
    throw new Error('时间轴ID不能为空');
  }

  if (!eventId || typeof eventId !== 'string') {
    throw new Error('事件ID不能为空');
  }

  // 验证时间轴是否存在，如果提供了userId，则验证时间轴是否属于该用户
  await verifyTimelineExists(timelineId, userId);

  // // 验证事件是否存在
  // const event = await db.event.findUnique({ where: { id: eventId } });
  // if (!event) {
  //   throw new Error('事件不存在');
  // }

  // // 检查关联关系是否已存在
  // const existing = await db.timelineEvent.findFirst({
  //   where: {
  //     timelineId,
  //     eventId,
  //   },
  // });

  // if (existing) {
  //   throw new Error('该事件已添加到时间轴中');
  // }

  // 创建关联关系
  return await db.timelineEvent.create({
    data: {
      timelineId,
      eventId,
    },
  });
};