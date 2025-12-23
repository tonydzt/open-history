import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createTimelineEvent } from '@/db/access/timelineEvent';

/**
 * 添加事件到时间轴的API路由
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 获取用户会话
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const resolvedParams = await params;
    const timelineId = resolvedParams.id;
    
    // 解析请求体
    const bodyData = await request.json();
    const { eventId } = bodyData;
    
    // 创建事件关联
    const timelineEvent = await createTimelineEvent(timelineId, eventId, session.user.id);
    
    return NextResponse.json({ success: true, timelineEvent }, { status: 201 });
  } catch (error) {
    console.error('Error adding event to timeline:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}