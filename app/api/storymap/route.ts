import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createStoryMap, getStoryMapById } from '@/db/access/storymap';
import { createStorymapEvent } from '@/db/access/storymapEvent';
import { StoryMapData, transformEventToStoryMapSlide } from '@/db/model/vo/Storymap';

/**
 * 创建故事地图的API路由
 */
export async function POST(request: Request) {
  try {
    // 验证用户是否登录
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: '需要登录' }, { status: 401 });
    }

    // 解析请求体
    const requestData = await request.json();

    // 验证必要字段
    if (!requestData.name || typeof requestData.name !== 'string') {
      return NextResponse.json({ error: '故事地图名称不能为空' }, { status: 400 });
    }

    // 提取事件ID列表（可选）
    const eventIds = Array.isArray(requestData.eventIds) ? requestData.eventIds : [];

    // 创建故事地图
    const storymap = await createStoryMap({
      name: requestData.name,
      description: requestData.description || '',
      userId: session.user.id
    });

    // 如果有事件ID，创建关联关系
    const eventRelations = [];
    if (eventIds.length > 0) {
      for (const eventId of eventIds) {
        try {
          const relation = await createStorymapEvent(storymap.id, eventId);
          eventRelations.push(relation);
        } catch (error) {
          console.warn(`添加事件 ${eventId} 到故事地图失败:`, error);
          // 继续处理其他事件，不中断整个流程
        }
      }
    }

    // 返回创建结果
    return NextResponse.json({
      storymap,
      eventRelations,
      success: true
    }, { status: 201 });
  } catch (error: any) {
    console.error('创建故事地图失败:', error);
    return NextResponse.json({ error: error.message || '创建故事地图失败' }, { status: 500 });
  }
}

/**
 * 获取故事地图详情的API路由
 */
export async function GET(request: Request) {
  try {
    // 从URL中解析故事地图ID
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: '故事地图ID不能为空' }, { status: 400 });
    }

    // 查询故事地图数据
    const storymapData = await getStoryMapById(id);

    // 转换为StoryMapData类型
    const storyMapResult: StoryMapData = {
      storymap: {
        language: 'en',
        map_type: 'osm:standard',
        map_as_image: false,
        slides: []
      }
    };

    // 创建概述幻灯片
    storyMapResult.storymap.slides.push({
      type: 'overview',
      text: {
        headline: storymapData.name,
        text: storymapData.description || ''
      },
      zoom: 4
    });

    // 添加事件幻灯片
    if (storymapData.storymap_event && storymapData.storymap_event.length > 0) {
      for (const item of storymapData.storymap_event) {
        if (item.event) {
          const event = item.event;
          storyMapResult.storymap.slides.push(transformEventToStoryMapSlide(event));
        }
      }
    }

    return NextResponse.json({
      data: storyMapResult,
      success: true
    }, { status: 200 });
  } catch (error: any) {
    console.error('获取故事地图失败:', error);
    return NextResponse.json({ error: error.message || '获取故事地图失败' }, { status: 500 });
  }
}