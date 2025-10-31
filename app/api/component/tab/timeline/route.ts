import { NextResponse } from 'next/server';
import { getUserTimelinesByPage } from '@/db/access/timeline';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 获取当前登录用户
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 解析查询参数
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const cursor = url.searchParams.get('cursor') || undefined;

    // 验证参数
    if (limit <= 0 || limit > 50) {
      return NextResponse.json({ error: 'limit参数无效' }, { status: 400 });
    }

    // 使用getUserTimelinesByPage方法查询数据
    const userId = session.user.id;
    const result = await getUserTimelinesByPage(userId, limit, cursor);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('查询时间轴列表失败:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}