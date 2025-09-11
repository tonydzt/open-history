import { PrismaClient } from '@prisma/client';

// 全局类型声明
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 创建Prisma Client实例
// 在开发环境中使用全局变量以避免热重载时创建多个实例
const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export default db;