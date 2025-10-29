import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { CreateEventData, transformEvent } from '@/db/model/vo/Event';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    // 从数据库中查询事件，包含用户信息
    const events = await db.event.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // 转换为前端使用的类型
    const transformedEvents = events.map(transformEvent);
    
    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: '获取事件列表失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: '需要登录' }, { status: 401 });
    }
    
    const data: CreateEventData = await request.json();
    
    // 验证数据
    if (!data.title || !data.description || !data.timestamp) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }
    
    // 检查用户是否存在
    const existingUser = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (!existingUser) {
      // 如果用户不存在，先创建用户
      await db.user.create({
        data: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          emailVerified: new Date()
        }
      });
    }

    // 创建事件基本信息
    let event: any;
    
    // 如果有地理位置信息，使用原始SQL查询
    if (data.geom) {
      const result = await db.$queryRaw`
        INSERT INTO "Event" (
          id,
          title, 
          description, 
          "imageUrl", 
          date, 
          tags, 
          "userId", 
          geom,
          "createdAt",
          "updatedAt"
        ) 
        VALUES (
          ${uuidv4()},
          ${data.title}, 
          ${data.description}, 
          ${data.images[0] || ''}, 
          ${new Date(data.timestamp)}, 
          ${data.tags || []}, 
          ${session.user.id}, 
          ST_GeomFromText(${`SRID=4326;POINT(${data.geom.lng} ${data.geom.lat})`}, 4326)::geography,
          NOW(),
          NOW()
        ) 
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
      event = result[0];
    } else {
        // 没有地理位置信息，使用常规的Prisma操作
        event = await db.event.create({
          data: {
            title: data.title,
            description: data.description,
            imageUrl: data.images[0] || '',
            date: new Date(data.timestamp),
            tags: data.tags || [],
            user: {
              connect: { id: session.user.id }
            }
          }
        });
      }
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('创建事件失败:', error);
    return NextResponse.json({ error: '创建事件失败' }, { status: 500 });
  }
}