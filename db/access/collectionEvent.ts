import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { CollectionEventsResponse, transformToCollectionEvent } from '@/db/model/vo/collectionEvent';
import { EventsPageResponse, transformCollectionEventToEvent } from '@/db/model/vo/Event';
import { getAllUserCollections } from './collection';

/**
 * 添加事件到收藏夹
 */
export const addEventToCollection = async (
  collectionId: string,
  eventId: string,
  userId: string
) => {
  // 验证收藏夹是否存在且属于当前用户
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    throw new Error('收藏夹不存在或无权限访问');
  }

  // 验证事件是否存在
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new Error('事件不存在');
  }

  // 检查是否已经收藏过该事件
  const existing = await prisma.collection_event.findFirst({
    where: {
      collectionId,
      eventId,
    },
  });

  if (existing) {
    throw new Error('该事件已在收藏夹中');
  }

  // 添加到收藏夹
  return await prisma.collection_event.create({
    data: {
      id: uuidv4(),
      collectionId,
      eventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

/**
 * 从收藏夹移除事件
 */
export const removeEventFromCollection = async (
  collectionId: string,
  eventId: string,
  userId: string
) => {
  // 验证收藏夹是否存在且属于当前用户
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    throw new Error('收藏夹不存在或无权限访问');
  }

  // 删除收藏关系
  const result = await prisma.collection_event.deleteMany({
    where: {
      collectionId,
      eventId,
    },
  });

  if (result.count === 0) {
    throw new Error('该事件不在收藏夹中');
  }

  return result;
};

/**
 * 分页获取收藏夹事件列表
   */
export const getCollectionEventsByPage = async (
  collectionId: string,
  userId: string,
  options?: {
    limit?: number;
    cursor?: string;
  }
): Promise<CollectionEventsResponse> => {
  // 验证收藏夹是否存在且属于当前用户
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    throw new Error('收藏夹不存在或无权限访问');
  }

  const limit = options?.limit || 20;

  const whereClause: Prisma.collection_eventWhereInput = {
    collectionId,
  };

  const orderBy: Prisma.collection_eventOrderByWithRelationInput = {
    createdAt: 'desc',
  };

  const collectionEvents = await prisma.collection_event.findMany({
    where: whereClause,
    orderBy,
    take: limit + 1, // 多查询一条用于判断是否有下一页
    cursor: options?.cursor ? { id: options.cursor } : undefined,
    include: {
      Event: {
        include: {
          user: true,
        },
      },
    },
  });

  let nextCursor: string | null = null;
  if (collectionEvents.length > limit) {
    nextCursor = collectionEvents[limit]?.id || null;
    collectionEvents.pop();
  }

  // 使用转换函数将数据库模型转换为视图模型
  const events = collectionEvents.map(transformToCollectionEvent);

  return {
    events,
    nextCursor,
  };
};

/**
 * 分页获取收藏夹事件列表（使用page+pageSize分页）
 * 如果collectionId为空，则查询用户所有收藏夹下的事件列表
 */
export const getCollectionEventsByPageSize = async (
  collectionId: string | null | undefined,
  userId: string,
  page: number,
  pageSize: number
): Promise<EventsPageResponse> => {
  // 验证分页参数
  const normalizedPage = Math.max(1, page || 1);
  const normalizedPageSize = Math.max(1, Math.min(100, pageSize || 20));
  const skip = (normalizedPage - 1) * normalizedPageSize;

  let whereClause: Prisma.collection_eventWhereInput = {};

  // 如果指定了collectionId，验证收藏夹是否存在且属于当前用户
  if (collectionId) {
    const collection = await prisma.collection.findUnique({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      throw new Error('收藏夹不存在或无权限访问');
    }
    
    whereClause.collectionId = collectionId;
  } else {
    // 如果没有指定collectionId，查询用户所有收藏夹的ID
    const userCollections = await getAllUserCollections(userId);
    const collectionIds = userCollections.map(col => col.id);
    
    // 如果用户没有收藏夹，则返回空列表
    if (collectionIds.length === 0) {
      return {
        events: [],
        total: 0,
      };
    }
    
    whereClause.collectionId = {
      in: collectionIds,
    };
  }

  const orderBy: Prisma.collection_eventOrderByWithRelationInput = {
    createdAt: 'desc',
  };

  // 获取事件列表
  const collectionEvents = await prisma.collection_event.findMany({
    where: whereClause,
    orderBy,
    skip,
    take: normalizedPageSize,
    include: {
      Event: {
        include: {
          user: true,
        },
      },
    },
  });

  // 获取总数
  const total = await prisma.collection_event.count({
    where: whereClause,
  });

  // 使用转换函数将数据库模型转换为Event接口类型
  const events = collectionEvents.map(transformCollectionEventToEvent);

  return {
    events,
    total,
  };
};
