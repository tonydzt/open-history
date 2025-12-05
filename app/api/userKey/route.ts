import { NextRequest, NextResponse } from 'next/server';
import { createUserKey, deleteUserKey, getUserKeysByUserId } from '@/db/access/userKey';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

/**
 * 创建用户密钥
 * POST /api/external/userKey
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    // 生成RSA密钥对
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048, // 密钥长度
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    const userKey = await createUserKey(session.user.id, publicKey, privateKey);
    return NextResponse.json(userKey, { status: 201 });
  } catch (error) {
    console.error('创建用户密钥失败:', error);
    return NextResponse.json({ error: '创建用户密钥失败' }, { status: 500 });
  }
}

/**
 * 查询用户密钥
 * GET /api/external/userKey
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const userKeys = await getUserKeysByUserId(session.user.id);
    return NextResponse.json(userKeys, { status: 200 });
  } catch (error) {
    console.error('查询用户密钥失败:', error);
    return NextResponse.json({ error: '查询用户密钥失败' }, { status: 500 });
  }
}

/**
 * 删除用户密钥
 * DELETE /api/external/userKey?id=密钥ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: '密钥ID不能为空' }, { status: 400 });
    }

    // 先检查密钥是否属于当前用户
    const userKeys = await getUserKeysByUserId(session.user.id);
    const keyToDelete = userKeys.find(key => key.id === id);

    if (!keyToDelete) {
      return NextResponse.json({ error: '密钥不存在或不属于当前用户' }, { status: 404 });
    }

    await deleteUserKey(id);
    return NextResponse.json({ message: '密钥删除成功' }, { status: 200 });
  } catch (error) {
    console.error('删除用户密钥失败:', error);
    return NextResponse.json({ error: '删除用户密钥失败' }, { status: 500 });
  }
}