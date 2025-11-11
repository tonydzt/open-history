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

  // 构建SQL查询条件
  let whereSql = '';
  let params: any[] = [];

  if (collectionId) {
    whereSql = 'WHERE ce."collectionId" = $1';
    params.push(collectionId);
  } else {
    const userCollections = await getAllUserCollections(userId);
    const collectionIds = userCollections.map(col => col.id);
    
    if (collectionIds.length === 0) {
      return {
        events: [],
        total: 0,
      };
    }
    
    whereSql = 'WHERE ce."collectionId" = ANY($1)';
    params.push(collectionIds);
  }

  // 添加分页参数
  params.push(normalizedPageSize, skip);
  const limitOffsetSql = `
    ORDER BY ce."createdAt" DESC
    LIMIT $2
    OFFSET $3
  `;

  // 使用queryRaw查询以获取geom字段，构造与transformCollectionEventToEvent函数兼容的结构
  const sqlQuery = `
    SELECT 
      ce.id,
      ce."collectionId",
      ce."eventId",
      ce."createdAt",
      ce."updatedAt",
      json_build_object(
        'id', e.id,
        'title', e.title,
        'description', e.description,
        'date', e.date,
        'imageUrl', e."imageUrl",
        'tags', e.tags,
        'userId', e."userId",
        'geom', ST_AsText(e.geom),
        'createdAt', e."createdAt",
        'updatedAt', e."updatedAt",
        'user', json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'image', u.image
        )
      ) as "Event"
    FROM collection_event ce
    JOIN "Event" e ON ce."eventId" = e.id
    JOIN "User" u ON e."userId" = u.id
    ${whereSql}
    ${limitOffsetSql}
  `;

  const collectionEvents = await prisma.$queryRawUnsafe<Array<{
    id: string;
    collectionId: string;
    eventId: string;
    createdAt: Date;
    updatedAt: Date;
    Event: {
      id: string;
      title: string;
      description: string;
      date: Date;
      imageUrl: string | null;
      tags: string[] | null;
      userId: string;
      geom: any;
      createdAt: Date;
      updatedAt: Date;
      user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
      };
    };
  }>>(sqlQuery, ...params);

  // 获取总数
  const totalSql = `
    SELECT COUNT(*) as total
    FROM collection_event ce
    ${whereSql}
  `;
  // 只传递where条件参数，不包含分页参数
  const totalResult = await prisma.$queryRawUnsafe<Array<{total: string}>>(totalSql, params[0]);
  const total = Number(totalResult[0]?.total || 0);

  // 使用现有的转换函数将数据转换为Event接口类型
  const events = collectionEvents.map(transformCollectionEventToEvent);

  return {
    events,
    total,
  };
};
