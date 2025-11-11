import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * 创建事件地图与事件的关联关系
 * @param storymapId 事件地图ID
 * @param eventId 事件ID
 * @returns 创建的关联关系对象
 */
export const createStorymapEvent = async (
  storymapId: string,
  eventId: string
) => {
  // 验证参数
  if (!storymapId || typeof storymapId !== 'string') {
    throw new Error('事件地图ID不能为空');
  }

  if (!eventId || typeof eventId !== 'string') {
    throw new Error('事件ID不能为空');
  }

  // 验证事件地图是否存在
  const storymap = await prisma.storymap.findUnique({
    where: { id: storymapId },
  });

  if (!storymap) {
    throw new Error('事件地图不存在');
  }

  // 验证事件是否存在
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error('事件不存在');
  }

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