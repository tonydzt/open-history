import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { CreatePerspectiveData } from '@/types';

// 类型转换函数：将数据库模型转换为前端使用的类型
const transformEvent = (dbEvent: any) => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  timestamp: dbEvent.date.toISOString(),
  sourceType: 'news', // 默认类型
  images: [dbEvent.imageUrl],
  tags: dbEvent.tags || [],
  authorId: dbEvent.userId,
  author: {
    id: dbEvent.user.id,
    name: dbEvent.user.name || '未知用户',
    email: dbEvent.user.email || '',
    image: dbEvent.user.image || ''
  },
  createdAt: dbEvent.createdAt.toISOString(),
  updatedAt: dbEvent.updatedAt.toISOString()
});

// 类型转换函数：将数据库模型转换为前端使用的类型
const transformPerspective = (dbPerspective: any) => ({
  id: dbPerspective.id,
  content: dbPerspective.content,
  authorId: dbPerspective.userId,
  author: {
    id: dbPerspective.user.id,
    name: dbPerspective.user.name || '未知用户',
    email: dbPerspective.user.email || '',
    image: dbPerspective.user.image || ''
  },
  eventId: dbPerspective.eventId,
  createdAt: dbPerspective.createdAt.toISOString()
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

  try {
    const {id} = await params;
    
    // 从数据库中查询特定事件，包含用户和视角信息
    const event = await db.event.findUnique({
      where: { id: id },
      include: {
        user: true,
        perspectives: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    
    if (!event) {
      return NextResponse.json({ error: '事件不存在' }, { status: 404 });
    }
    
    // 转换为前端使用的类型
    const transformedEvent = transformEvent(event);
    const transformedPerspectives = event.perspectives.map(transformPerspective);
    
    return NextResponse.json({ event: transformedEvent, perspectives: transformedPerspectives });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: '获取事件详情失败' }, { status: 500 });
  }
}

// 添加视角的API路由
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: '需要登录' }, { status: 401 });
    }
    
    const {id} = await params;
    const data: CreatePerspectiveData = await request.json();
    
    if (!data.content.trim()) {
      return NextResponse.json({ error: '请输入视角内容' }, { status: 400 });
    }
    
    // 检查事件是否存在
    const eventExists = await db.event.findUnique({
      where: { id: id }
    });
    
    if (!eventExists) {
      return NextResponse.json({ error: '事件不存在' }, { status: 404 });
    }
    
    // 在数据库中创建新视角
    const perspective = await db.perspective.create({
      data: {
        title: '用户视角', // 添加默认标题
        content: data.content,
        eventId: id,
        userId: session.user.id
      }
    });
    
    return NextResponse.json(perspective, { status: 201 });
  } catch (error) {
    console.error('添加视角失败:', error);
    return NextResponse.json({ error: '添加视角失败' }, { status: 500 });
  }
}