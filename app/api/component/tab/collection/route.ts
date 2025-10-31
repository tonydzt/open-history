import { NextRequest, NextResponse } from 'next/server';
import { createCollection, deleteCollection, updateCollection, getUserCollections } from '@/db/access/collection';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    const user = session.user;

    // 解析请求体
    const data = await request.json();
    
    // 验证必要字段
    if (!data.name) {
      return NextResponse.json({ error: '名称不能为空' }, { status: 400 });
    }

    // 创建收藏夹
    const collection = await createCollection({
      name: data.name,
      description: data.description,
      userId: user.id as string,
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

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
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') || '20', 10) : 20;
    const cursor = searchParams.get('cursor') || undefined;

    // 获取用户收藏夹列表
    const result = await getUserCollections(user.id as string, { limit, cursor });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    const user = session.user;

    // 解析请求体
    const data = await request.json();
    
    // 验证必要字段
    if (!data.collectionId) {
      return NextResponse.json({ error: '收藏夹ID不能为空' }, { status: 400 });
    }

    // 更新收藏夹
    const collection = await updateCollection(
      data.collectionId,
      user.id as string,
      {
        name: data.name,
        description: data.description,
      }
    );

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    const user = session.user;

    // 解析请求体
    const data = await request.json();
    
    // 验证必要字段
    if (!data.collectionId) {
      return NextResponse.json({ error: '收藏夹ID不能为空' }, { status: 400 });
    }

    // 删除收藏夹
    await deleteCollection(data.collectionId, user.id as string);

    return NextResponse.json({ message: '删除成功' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}