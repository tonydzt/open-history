import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * 创建新的事件地图
 * @param data 创建事件地图所需的数据
 * @returns 创建的事件地图对象
 */
export const createStoryMap = async (data: {
    name: string;
    description?: string;
    userId: string;
}) => {
    // 验证数据
    if (!data.name || typeof data.name !== 'string') {
        throw new Error('事件地图名称不能为空');
    }

    if (!data.userId || typeof data.userId !== 'string') {
        throw new Error('用户ID不能为空');
    }

    // 验证用户是否存在
    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    });

    if (!user) {
        throw new Error('用户不存在');
    }

    // 创建事件地图
    return await prisma.storymap.create({
        data: {
            id: uuidv4(),
            name: data.name,
            description: data.description || '',
            userId: data.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
};

/**
 * 根据ID查询故事地图数据
 * @param id 故事地图ID
 * @returns 故事地图对象
 */
export const getStoryMapById = async (id: string) => {
    // 验证数据
    if (!id || typeof id !== 'string') {
        throw new Error('故事地图ID不能为空');
    }

    // 使用raw SQL查询，通过ST_AsText函数获取geom字段的字符串表示
    // tongbug修改: PostgreSQL 默认对列名和表名进行 不区分大小写 的处理。因此，如果列名或表名没有用双引号括起来，PostgreSQL 会将它们转换为小写字母
    const result = await prisma.$queryRaw<Array<any>>`
    SELECT 
      sm.*, 
      json_agg(
        json_build_object(
          'id', sme.id,
          'storymapId', sme."storymapId",
          'eventId', sme."eventId",
          'event', json_build_object(
        'id', e.id,
        'title', e.title,
        'description', e.description,
        'date', e.date,
        'imageUrl', e."imageUrl",
        'tags', e.tags,
        'userId', e."userId",
        'geom', ST_AsText(e.geom),
        'createdAt', e."createdAt",
        'updatedAt', e."updatedAt"
          )
        )
        ORDER BY sme.id ASC
      ) as storymap_event
    FROM storymap sm
    LEFT JOIN storymap_event sme ON sm.id = sme."storymapId"
    LEFT JOIN "Event" e ON sme."eventId" = e.id
    WHERE sm.id = ${id}
    GROUP BY sm.id;
  `;

    const storyMap = result[0] as any;

    if (!storyMap) {
        throw new Error('故事地图不存在');
    }

    return storyMap;
};