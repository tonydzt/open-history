import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { Timeline } from '@/db/model/vo/Timeline';

export async function POST(request: NextRequest) {
  try {
    // 获取用户会话
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 解析请求体
    const timelineData: Timeline = await request.json();
    
    // 验证必要字段
    if (!timelineData.title || !timelineData.title.text || !timelineData.title.text.headline) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    if (!timelineData.events || timelineData.events.length === 0) {
      return NextResponse.json({ error: 'At least one event is required' }, { status: 400 });
    }
    
    // 提取必要的数据，避免类型错误
    const titleValue = timelineData.title.text.headline;
    const descriptionValue = timelineData.title.text.text;
    
    // 开始数据库事务
    const result = await db.$transaction(async (prisma) => {
      // 创建时间轴记录
      const timeline = await prisma.timeline.create({
        data: {
          title: titleValue,
          description: descriptionValue || undefined,
          backgroundImageUrl: timelineData.background?.url || undefined,
          backgroundImageAlt: timelineData.background?.alt || undefined,
          authorId:  session.user.id
        },
      });
      
      // 创建时间轴事件关系记录
      await Promise.all(
        timelineData.events.map((event, index) => {
          // 确保有unique_id对应eventId
          if (!event.unique_id) {
            throw new Error(`Event at index ${index} is missing unique_id`);
          }
          
          return prisma.timelineEvent.create({
            data: {
              timelineId: timeline.id,
              eventId: event.unique_id
            },
          });
        })
      );
      
      return timeline;
    });
    
    // 返回创建的时间轴ID
    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating timeline:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}