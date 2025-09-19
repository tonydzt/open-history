import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

// 验证文件类型
function isValidImageType(contentType: string): boolean {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ];
  return validTypes.includes(contentType);
}

// 处理客户端上传请求
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 验证用户是否登录
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: '需要登录' }, { status: 401 });
    }

    // 解析请求体
    const body = (await request.json()) as HandleUploadBody;

    // 使用 Vercel Blob 的 handleUpload 方法处理上传请求
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        // 在生成token之前验证和授权用户
        // 确保这里有适当的认证和授权逻辑
        
        // 注意：clientPayload 在类型定义中是 string，但实际使用中可能是 JSON 字符串
        // 如果需要从客户端传递 contentType，可以让客户端将其作为 JSON 字符串传递
        try {
          // 尝试解析 clientPayload 为 JSON 对象
          const parsedPayload = clientPayload ? JSON.parse(clientPayload) : {};
          // 验证文件类型
          if (parsedPayload?.contentType && !isValidImageType(parsedPayload.contentType)) {
            throw new Error('不支持的文件类型，仅支持图片文件');
          }
        } catch (parseError) {
          // 如果解析失败，忽略此验证
          console.warn('无法解析 clientPayload:', parseError);
        }

        return {
          // 允许的文件类型
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml'
          ],
          // 自动添加随机后缀以避免文件名冲突
          addRandomSuffix: true,
          // 可选的回调URL，当文件上传完成后Vercel会调用此URL
          // callbackUrl: 'https://example.com/api/storage/upload-image/callback',
          // 可选的token负载，将在上传完成回调中传递给服务器
          tokenPayload: JSON.stringify({
            userId: session.user.id,
            uploadTime: new Date().toISOString()
          })
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // 当客户端上传完成后，Vercel API会调用此回调
        // 注意：本地开发环境中可能需要使用工具如ngrok来使此回调正常工作
        
        console.log('Blob上传完成:', {
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
          uploadedAt: new Date().toISOString(),
          tokenPayload
        });

        try {
          // 在这里可以添加上传完成后的逻辑，例如：
          // 1. 将blob URL存储到数据库
          // 2. 更新用户资料
          // 3. 发送通知等
          
          // 示例：如果需要操作数据库，可以取消下面的注释并实现相应逻辑
          /*
          const { userId } = JSON.parse(tokenPayload);
          await db.update({
            avatar: blob.url,
            userId
          });
          */
        } catch (error) {
          console.error('处理上传完成后逻辑失败:', error);
          throw new Error('处理上传完成后逻辑失败');
        }
      }
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('生成上传链接失败:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // Webhook将在收到非200响应时重试5次
    );
  }
}

// 处理上传完成回调（预留接口，根据需要实现）
export async function PUT(request: Request) {
  try {
    // 这里可以处理自定义的上传完成回调逻辑
    // 注意：Vercel Blob的标准回调已经在POST方法的onUploadCompleted中处理
    
    const data = await request.json();
    console.log('自定义上传完成回调:', data);
    
    return NextResponse.json({
      success: true,
      message: '上传完成，已处理'
    }, { status: 200 });
  } catch (error) {
    console.error('处理上传完成回调失败:', error);
    return NextResponse.json({ error: '处理上传完成回调失败' }, { status: 500 });
  }
}