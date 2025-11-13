import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStoryMapsByUserId } from '@/db/access/storymap';

export async function GET() {
  try {
    // 获取当前用户会话
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // 验证用户是否已登录
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 调用数据库查询方法
    const storyMaps = await getStoryMapsByUserId(userId);

    // 返回结果
    return NextResponse.json({
      data: storyMaps,
      success: true
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching story maps:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}