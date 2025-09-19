import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { put } from '@vercel/blob';
import db from './db';

// 下载图片并上传到Vercel Blob
async function saveUserAvatarToBlob(userId: string, avatarUrl: string): Promise<string> {
  try {
    // 下载头像图片
    const response = await fetch(avatarUrl);
    if (!response.ok) {
      throw new Error(`Failed to download avatar: ${response.status}`);
    }
    
    // 读取图片二进制数据
    const blobData = await response.arrayBuffer();
    
    // 从URL中提取文件扩展名
    const urlParts = avatarUrl.split('.');
    const extension = urlParts[urlParts.length - 1].split('?')[0]; // 移除可能的查询参数
    
    // 生成目标路径
    const path = `user/${userId}/avatar.${extension}`;
    
    // 上传到Vercel Blob
    const blobResult = await put(path, blobData, {
      access: 'public', // 公开访问权限
      contentType: response.headers.get('content-type') || 'image/png',
    });
    
    return blobResult.url;
  } catch (error) {
    console.error('Failed to save user avatar to Blob:', error);
    // 如果上传失败，返回原始头像URL
    return avatarUrl;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // 仅使用Google登录
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // 当用户通过Google登录时
      if (account?.provider === 'google' && user.id && user.image) {
        try {
          // 检查用户是否已经存在
          const existingUser = await db.user.findUnique({
            where: { id: user.id },
            select: { image: true }
          });
          
          // 如果用户不存在或者头像是第三方URL，保存到Blob
          if (!existingUser || (user.image && !user.image.includes('/user/'))) {
            // 保存头像到Vercel Blob
            const blobUrl = await saveUserAvatarToBlob(user.id, user.image);
            
            // 更新用户的头像URL
            await db.user.update({
              where: { id: user.id },
              data: { image: blobUrl }
            });
            
            // 更新user对象的image字段
            user.image = blobUrl;
          }
        } catch (error) {
          console.error('Error processing user avatar:', error);
          // 即使处理失败，也允许用户登录
        }
      }
      return true;
    },
    
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id: string; name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined }).id = token.sub;
        
        // 确保session中的头像URL是Blob存储的URL
        try {
          const user = await db.user.findUnique({
            where: { id: token.sub },
            select: { image: true }
          });
          if (user?.image) {
            session.user.image = user.image;
          }
        } catch (error) {
          console.error('Error fetching user image:', error);
        }
      }
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};
