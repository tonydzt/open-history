import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { CreateEventData, transformEvent  } from '@/db/model/vo/Event';
import { CreatePerspectiveData, transformPerspective } from '@/db/model/vo/Perspective';

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

// 更新事件的API路由
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: '需要登录' }, { status: 401 });
    }
    
    const {id} = await params;
    const data: CreateEventData = await request.json();
    
    // 验证数据
    if (!data.title || !data.description || !data.timestamp) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    
    // 查找事件并验证所有权
    const event = await db.event.findUnique({
      where: { id: id },
      select: { userId: true }
    });
    
    if (!event) {
      return NextResponse.json({ error: '事件不存在' }, { status: 404 });
    }
    
    // 权限校验：只有事件创建者才能更新
    if (event.userId !== session.user.id) {
      return NextResponse.json({ error: '没有权限更新此事件' }, { status: 403 });
    }
    
    // 更新事件信息
    let updatedEvent: any;
    
    // 如果有地理位置信息，使用原始SQL查询
    if (data.geom) {
      const result = await db.$queryRaw`
        UPDATE "Event"
        SET
          title = ${data.title},
          description = ${data.description},
          "imageUrl" = ${data.images[0] || ''},
          date = ${new Date(data.timestamp)},
          tags = ${data.tags || []},
          geom = ST_GeomFromText(${`SRID=4326;POINT(${data.geom.lng} ${data.geom.lat})`}, 4326)::geography,
          "updatedAt" = NOW()
        WHERE id = ${id}
        RETURNING 
          id,
          title,
          description,
          "imageUrl",
          date,
          tags,
          "userId",
          ST_AsGeoJSON(geom) as geom,
          "createdAt",
          "updatedAt"
      ` as Array<any>;
      updatedEvent = result[0];
    } else {
      // 没有地理位置信息，使用常规的Prisma操作
      updatedEvent = await db.event.update({
        where: { id: id },
        data: {
          title: data.title,
          description: data.description,
          imageUrl: data.images[0] || '',
          date: new Date(data.timestamp),
          tags: data.tags || [],
          updatedAt: new Date()
        }
      });
    }
    
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('更新事件失败:', error);
    return NextResponse.json({ error: '更新事件失败' }, { status: 500 });
  }
}

// 删除事件的API路由
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: '需要登录' }, { status: 401 });
    }
    
    const {id} = await params;
    
    // 查找事件并验证所有权
    const event = await db.event.findUnique({
      where: { id: id },
      select: { userId: true }
    });
    
    if (!event) {
      return NextResponse.json({ error: '事件不存在' }, { status: 404 });
    }
    
    // 权限校验：只有事件创建者才能删除
    if (event.userId !== session.user.id) {
      return NextResponse.json({ error: '没有权限删除此事件' }, { status: 403 });
    }
    
    // 事务处理：先删除相关联的数据，再删除事件
    await db.$transaction(async (tx) => {
      // 删除与该事件相关的所有视角
      await tx.perspective.deleteMany({
        where: { eventId: id }
      });
      
      // 删除与该事件相关的所有收藏事件关联
      await tx.collection_event.deleteMany({
        where: { eventId: id }
      });
      
      // 删除与该事件相关的所有故事地图事件关联
      await tx.storymap_event.deleteMany({
        where: { eventId: id }
      });
      
      // 删除事件
      await tx.event.delete({
        where: { id: id }
      });
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('删除事件失败:', error);
    return NextResponse.json({ error: '删除事件失败' }, { status: 500 });
  }
}