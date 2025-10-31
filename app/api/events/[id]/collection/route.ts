import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addEventToCollection } from '@/db/access/collectionEvent';

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    const userId = session.user.id as string;

    // 解析请求体
    const data = await request.json();
    
    // 验证必要字段
    if (!data.collectionId) {
      return NextResponse.json({ error: '收藏夹ID不能为空' }, { status: 400 });
    }

    // 获取事件ID
    const eventId = request.url.split('/api/events/')[1].split('/collection')[0];
    
    // 添加事件到收藏夹
    await addEventToCollection(data.collectionId, eventId, userId);

    return NextResponse.json({ message: '添加成功' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}