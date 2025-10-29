import db from '@/lib/db';
import { Event } from '@prisma/client';

/**
 * 按userId分页查询用户事件列表（下拉分页方式）
 * @param userId 用户ID
 * @param pageSize 每页大小
 * @param cursor 游标ID，用于下拉加载更多数据
 * @returns 用户事件列表及是否有更多数据的标志
 */
export const getEventsByUserId = async (
  userId: string,
  pageSize: number = 10,
  cursor?: string
): Promise<{ events: Event[]; hasMore: boolean }> => {
  // 构建查询条件
  const query: any = {
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: pageSize + 1, // 多查询一条用于判断是否还有更多数据
    include: {
        user: true,
    }
  };

  // 如果提供了游标，则添加游标条件
  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1; // 跳过游标所在的记录
  }

  // 执行查询
  const events = await db.event.findMany(query);

  // 判断是否还有更多数据
  const hasMore = events.length > pageSize;

  // 如果有更多数据，则移除多查询的那条
  if (hasMore) {
    events.pop();
  }

  return { events, hasMore };
};