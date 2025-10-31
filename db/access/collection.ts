import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * 创建收藏夹
 */
export const createCollection = async (
  data: {
    name: string;
    description?: string;
    userId: string;
  }
) => {

  return await prisma.collection.create({
    data: {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

/**
 * 删除收藏夹
 */
export const deleteCollection = async (
  collectionId: string,
  userId: string
) => {
  // 确保只有收藏夹所有者才能删除
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    throw new Error('收藏夹不存在或无权限删除');
  }

  // 首先删除关联的收藏事件
  await prisma.collection_event.deleteMany({
    where: {
      collectionId,
    },
  });

  // 然后删除收藏夹
  return await prisma.collection.delete({
    where: {
      id: collectionId,
    },
  });
};

/**
 * 更新收藏夹
 */
export const updateCollection = async (
  collectionId: string,
  userId: string,
  data: {
    name?: string;
    description?: string;
  }
) => {
  // 确保只有收藏夹所有者才能更新
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    throw new Error('收藏夹不存在或无权限更新');
  }

  return await prisma.collection.update({
    where: {
      id: collectionId,
    },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};

/**
 * 查询用户的收藏夹列表
 */
export const getUserCollections = async (
  userId: string,
  options?: {
    limit?: number;
    cursor?: string;
  }
) => {
  const limit = options?.limit || 20;
  
  const whereClause: Prisma.collectionWhereInput = {
    userId,
  };

  const orderBy: Prisma.collectionOrderByWithRelationInput = {
    updatedAt: 'desc',
  };

  const collections = await prisma.collection.findMany({
    where: whereClause,
    orderBy,
    take: limit + 1, // 多查询一条用于判断是否有下一页
    cursor: options?.cursor ? { id: options.cursor } : undefined,
    include: {
      _count: {
        select: { collection_event: true },
      },
    },
  });

  let nextCursor: string | null = null;
  if (collections.length > limit) {
    nextCursor = collections[limit]?.id || null;
    collections.pop();
  }

  return {
    collections,
    nextCursor,
  };
};