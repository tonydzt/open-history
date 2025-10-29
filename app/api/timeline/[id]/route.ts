import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { Timeline, Slide, Date as TimelineDate } from '@/db/model/vo/Timeline';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const timelineId = params.id;
    
    if (!timelineId) {
      return NextResponse.json({ error: 'Timeline ID is required' }, { status: 400 });
    }
    
    // 获取时间轴基本信息
    const timeline = await db.timeline.findUnique({
      where: { id: timelineId }
    });
    
    if (!timeline) {
      return NextResponse.json({ error: 'Timeline not found' }, { status: 404 });
    }
    
    // 获取时间轴相关的事件关系
    const timelineEvents = await db.timelineEvent.findMany({
      where: { timelineId }
    });
    
    // 获取所有事件ID
    const eventIds = timelineEvents.map(te => te.eventId);
    
    // 获取事件详细信息
    const eventsMap = new Map<string, any>();
    if (eventIds.length > 0) {
      const events = await db.event.findMany({
        where: { id: { in: eventIds } }
      });
      events.forEach(event => eventsMap.set(event.id, event));
    }
    
    // 辅助函数：转换日期格式
    const convertToTimelineDate = (event: any): TimelineDate => {
      // 解析事件时间戳
      const date = new Date(event.date || event.timestamp);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
      };
    };
    
    // 构建响应数据
    const slides: Slide[] = timelineEvents
      .map(te => {
        const event = eventsMap.get(te.eventId);
        if (!event) return null;
        
        const slide = {
          start_date: convertToTimelineDate(event),
          text: {
            headline: event.title,
            text: event.description || undefined
          },
          media: event.imageUrl ? {
            url: event.imageUrl,
            caption: undefined,
            credit: undefined
          } : undefined,
          group: event.tags && event.tags.length > 0 ? event.tags[0] : undefined,
          unique_id: event.id
        };
        
        return slide as Slide;
      })
      .filter((slide): slide is Slide => slide !== null);
    
    const timelineData: Timeline = {
      events: slides,
      title: {
        text: {
          headline: timeline.title,
          text: timeline.description || undefined
        }
      }
    };
    
    // 添加可选的背景信息
    if (timeline.backgroundImageUrl) {
      timelineData.background = {
        url: timeline.backgroundImageUrl,
        alt: timeline.backgroundImageAlt || undefined,
        color: undefined
      };
    }
    
    // 返回结果时添加额外的元数据
    return NextResponse.json({
      ...timelineData,
      metadata: {
        authorId: timeline.authorId
      }
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    // 获取用户会话
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const timelineId = context.params.id;
    
    if (!timelineId) {
      return NextResponse.json({ error: 'Timeline ID is required' }, { status: 400 });
    }
    
    // 解析请求体
    const bodyData = await request.json();
    // 移除metadata字段，只保留Timeline所需的字段
    const { metadata, ...timelineData } = bodyData;
    
    // 验证必要字段
    if (!timelineData.title || !timelineData.title.text || !timelineData.title.text.headline) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    // 检查时间轴是否存在且属于当前用户
    const existingTimeline = await db.timeline.findUnique({
      where: { id: timelineId }
    });
    
    if (!existingTimeline) {
      return NextResponse.json({ error: 'Timeline not found' }, { status: 404 });
    }
    
    if (existingTimeline.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden - You are not the owner of this timeline' }, { status: 403 });
    }
    
    // 提取必要的数据
    const titleValue = timelineData.title.text.headline;
    const descriptionValue = timelineData.title.text.text;
    
    // 开始数据库事务
    await db.$transaction(async (prisma) => {
      // 更新时间轴基本信息
      await prisma.timeline.update({
        where: { id: timelineId },
        data: {
          title: titleValue,
          description: descriptionValue || undefined,
          backgroundImageUrl: timelineData.background?.url || undefined,
          backgroundImageAlt: timelineData.background?.alt || undefined
        }
      });
      
      // 删除现有的事件关联
      await prisma.timelineEvent.deleteMany({
        where: { timelineId }
      });
      
      // 创建新的事件关联
      if (timelineData.events && timelineData.events.length > 0) {
        await Promise.all(
          timelineData.events.map((slide: any) => {
            // 确保有unique_id对应eventId
            if (!slide.unique_id) {
              throw new Error('Event is missing unique_id');
            }
            
            return prisma.timelineEvent.create({
              data: {
                timelineId,
                eventId: slide.unique_id
              }
            });
          })
        );
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating timeline:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}