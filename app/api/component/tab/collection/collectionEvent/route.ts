import { NextRequest, NextResponse } from 'next/server';
import { getCollectionEventsByPage } from '@/db/access/collectionEvent';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    const user = session.user;

    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const collectionId = searchParams.get('collectionId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') || '20', 10) : 20;
    const cursor = searchParams.get('cursor') || undefined;

    // 验证必要参数
    if (!collectionId) {
      return NextResponse.json({ error: '收藏夹ID不能为空' }, { status: 400 });
    }

    // 获取收藏夹下的事件列表
    const result = await getCollectionEventsByPage(collectionId, user.id as string, { limit, cursor });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch collection events from database:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}