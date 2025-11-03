import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getCollectionEventsByPageSize } from '@/db/access/collectionEvent';

export async function GET(request: Request) {
  try {
    // 获取用户会话
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }
    
    // 从请求URL中获取参数
    const url = new URL(request.url);
    const collectionId = url.searchParams.get('collectionId');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    
    // 验证参数
    if (page < 1 || pageSize < 1) {
      return NextResponse.json({ error: '无效的分页参数' }, { status: 400 });
    }
    
    // 调用收藏夹事件查询函数
    // collectionId可以为空，此时将查询用户所有收藏夹中的事件
    const result = await getCollectionEventsByPageSize(
      collectionId || undefined, // 将空字符串转换为undefined，保持类型一致
      session.user.id,
      page,
      pageSize
    );
    
    // 将Event类型转换为EventCard类型，保持与原接口一致的返回格式
    const transformedEvents = result.events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      timestamp: event.timestamp.slice(0, 10), // 只保留日期部分
      images: event.images || [],
      tags: event.tags || []
    }));
    
    return NextResponse.json({
      events: transformedEvents,
      total: result.total
    });
  } catch (error: any) {
    console.error('Failed to fetch collection events:', error);
    // 如果是权限相关错误，返回403状态码
    if (error.message?.includes('无权限') || error.message?.includes('不存在')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: '获取收藏夹事件列表失败' }, { status: 500 });
  }
}