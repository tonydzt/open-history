import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createStorymapEvent } from '@/db/access/storymapEvent';

/**
 * 添加事件到故事地图的API路由
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 获取用户会话
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const resolvedParams = await params;
    const storymapId = resolvedParams.id;
    
    // 解析请求体
    const bodyData = await request.json();
    const { eventId } = bodyData;
 
    // 创建事件关联
    const storymapEvent = await createStorymapEvent(storymapId, eventId, session.user.id);
    
    return NextResponse.json({ success: true, storymapEvent }, { status: 201 });
  } catch (error) {
    console.error('Error adding event to storymap:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
