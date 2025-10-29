import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getEventsByUserId } from '@/db/access/event';
import { transformEvent } from '@/db/model/vo/Event';

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const userId = request.nextUrl.searchParams.get('userId');
    const pageSizeStr = request.nextUrl.searchParams.get('pageSize');
    const cursor = request.nextUrl.searchParams.get('cursor');

    // 参数验证
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    // 设置默认值
    const pageSize = pageSizeStr ? parseInt(pageSizeStr, 10) : 10;
    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid pageSize parameter. Must be between 1 and 100.' },
        { status: 400 }
      );
    }

    // 获取当前用户会话（用于权限检查）
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    // 权限检查：用户只能查看自己的事件列表
    if (userId !== currentUserId) {
      return NextResponse.json(
        { error: 'Permission denied. You can only access your own events.' },
        { status: 403 }
      );
    }

    // 调用数据库查询方法
    const result = await getEventsByUserId(userId, pageSize, cursor || undefined);

    // 使用transformEvent函数将数据库模型转换为前端使用的类型
    const transformedEvents = result.events.map(event => transformEvent(event));

    // 返回转换后的结果
    return NextResponse.json({
      events: transformedEvents,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}