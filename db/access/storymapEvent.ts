import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * 根据ID获取事件
 * @param eventId 事件ID
 * @returns 事件对象，如果不存在则返回null
 */
export const getEventById = async (eventId: string) => {
  // 验证参数
  if (!eventId || typeof eventId !== 'string') {
    throw new Error('事件ID不能为空');
  }

  return await prisma.event.findUnique({
    where: { id: eventId },
  });
};

/**
 * 验证事件是否存在
 * @param eventId 事件ID
 * @returns 事件对象
 */
export const verifyEventExists = async (eventId: string) => {
  const event = await getEventById(eventId);
  
  if (!event) {
    throw new Error('事件不存在');
  }

  return event;
};

/**
 * 根据ID获取事件地图
 * @param storymapId 事件地图ID
 * @returns 事件地图对象，如果不存在则返回null
 */
export const getStorymapById = async (storymapId: string) => {
  // 验证参数
  if (!storymapId || typeof storymapId !== 'string') {
    throw new Error('事件地图ID不能为空');
  }

  return await prisma.storymap.findUnique({
    where: { id: storymapId },
    select: {
      id: true,
      userId: true
    }
  });
};

/**
 * 验证事件地图是否存在
 * @param storymapId 事件地图ID
 * @param userId 可选参数，用户ID，如果提供则验证事件地图是否属于该用户
 * @returns 事件地图对象
 */
export const verifyStorymapExists = async (storymapId: string, userId?: string) => {
  const storymap = await getStorymapById(storymapId);
  
  if (!storymap) {
    throw new Error('事件地图不存在');
  }

  // 如果提供了userId参数，验证事件地图是否属于该用户
  if (userId && storymap.userId !== userId) {
    throw new Error('该事件地图不属于当前用户');
  }

  return storymap;
};

/**
 * 创建事件地图与事件的关联关系
 * @param storymapId 事件地图ID
 * @param eventId 事件ID
 * @param userId 可选参数，用户ID，如果提供则验证事件地图是否属于该用户
 * @returns 创建的关联关系对象
 */
export const createStorymapEvent = async (
  storymapId: string,
  eventId: string,
  userId?: string
) => {
  // 验证参数
  if (!storymapId || typeof storymapId !== 'string') {
    throw new Error('事件地图ID不能为空');
  }

  if (!eventId || typeof eventId !== 'string') {
    throw new Error('事件ID不能为空');
  }

  // 验证事件地图是否存在
  await verifyStorymapExists(storymapId, userId);

  // 验证事件是否存在
  await verifyEventExists(eventId);

  // 检查关联关系是否已存在
  const existing = await prisma.storymap_event.findFirst({
    where: {
      storymapId,
      eventId,
    },
  });

  if (existing) {
    throw new Error('该事件已添加到事件地图中');
  }

  // 创建关联关系
  return await prisma.storymap_event.create({
    data: {
      id: uuidv4(),
      storymapId,
      eventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

/**
 * 删除事件地图与事件的关联关系
 * @param storymapId 事件地图ID
 * @param eventId 事件ID
 * @param userId 可选参数，用户ID，如果提供则验证事件地图是否属于该用户
 * @returns 删除的关联关系对象
 */
export const deleteStorymapEvent = async (
  storymapId: string,
  eventId: string,
  userId?: string
) => {
  // 验证参数
  if (!storymapId || typeof storymapId !== 'string') {
    throw new Error('事件地图ID不能为空');
  }

  if (!eventId || typeof eventId !== 'string') {
    throw new Error('事件ID不能为空');
  }

  // 验证事件地图是否存在
  await verifyStorymapExists(storymapId, userId);

  // 检查关联关系是否存在
  const existing = await prisma.storymap_event.findFirst({
    where: {
      storymapId,
      eventId,
    },
  });

  if (!existing) {
    throw new Error('关联关系不存在');
  }

  // 删除关联关系
  return await prisma.storymap_event.delete({
    where: {
      id: existing.id,
    },
  });
};

/**
 * 根据事件地图ID删除所有相关的事件关联关系
 * @param storymapId 事件地图ID
 * @param userId 可选参数，用户ID，如果提供则验证事件地图是否属于该用户
 * @returns 删除的关联关系对象数组
 */
export const deleteAllStorymapEvents = async (
  storymapId: string,
  userId?: string
) => {
  // 验证参数
  if (!storymapId || typeof storymapId !== 'string') {
    throw new Error('事件地图ID不能为空');
  }

  // 验证事件地图是否存在
  await verifyStorymapExists(storymapId, userId);

  // 删除所有关联关系
  return await prisma.storymap_event.deleteMany({
    where: {
      storymapId,
    },
  });
};