import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { transformToEventCard } from '@/db/model/vo/EventCard';

export async function GET(request: Request) {
  try {
    // 从请求URL中获取分页参数
    const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    
    // 验证参数
    if (page < 1 || pageSize < 1) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }
    
    // 获取总数
    const total = await db.event.count();
    
    // 查询事件数据
      const skip = Math.max(0, (page - 1) * pageSize);
      const take = Math.max(1, Math.min(pageSize, 50)); // 设置合理的上限
      
      const events = await db.event.findMany({
        include: {
          user: true
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: skip,
        take: take
      });
    
    // 转换为EventCard类型
    const transformedEvents = events.map(transformToEventCard);
    
    return NextResponse.json({
      events: transformedEvents,
      total
    });
  } catch (error) {
    console.error('Failed to fetch events from database:', error);
    return NextResponse.json({ error: '获取事件列表失败' }, { status: 500 });
  }
}