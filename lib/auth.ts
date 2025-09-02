import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    // 本地开发模式下使用简单的凭证登录
    CredentialsProvider({
      id: 'credentials',
      name: '开发登录',
      credentials: {
        username: { label: '用户名', type: 'text', placeholder: '请输入用户名' },
      },
      async authorize(credentials) {
        // 在开发环境中，接受任何用户名登录
        if (credentials?.username) {
          // 返回有效的用户对象，包含必要的字段
          return {
            id: 'dev-user-' + Date.now(),
            name: credentials.username,
            email: `${credentials.username}@example.com`,
            image: 'https://avatars.githubusercontent.com/u/10000000?v=4',
          };
        }
        return null;
      },
    }),
    // 仅在配置了环境变量时启用GitHub登录
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    ] : []),
    // 仅在配置了环境变量时启用Google登录
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id: string; name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined }).id = token.sub;
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
