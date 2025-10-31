import { User } from './User';

export interface Perspective {
  id: string;
  content: string;
  userId: string;
  author: User;
  eventId: string;
  createdAt: string;
}

export interface CreatePerspectiveData {
  content: string;
}

// 类型转换函数：将数据库模型转换为前端使用的类型
export const transformPerspective = (dbPerspective: any) => ({
  id: dbPerspective.id,
  content: dbPerspective.content,
  userId: dbPerspective.userId,
  author: {
    id: dbPerspective.user.id,
    name: dbPerspective.user.name || '未知用户',
    email: dbPerspective.user.email || '',
    image: dbPerspective.user.image || ''
  },
  eventId: dbPerspective.eventId,
  createdAt: dbPerspective.createdAt.toISOString()
});