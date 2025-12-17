import { CollectionEvent } from './collectionEvent';
import { DEFAULT_COLLECTION_PREFIX } from '@/lib/constants';

/**
 * 收藏夹模型接口
 */
export interface Collection {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  num?: number;
  collection_event?: CollectionEvent[];
}

/**
 * 收藏夹转换函数
 * @param dbCollection 数据库中的收藏夹对象
 * @returns 转换后的收藏夹接口对象
 */
export function transformCollection(dbCollection: any): Collection {
  return {
    id: dbCollection.id,
    name: dbCollection.name,
    description: dbCollection.description,
    userId: dbCollection.userId,
    createdAt: dbCollection.createdAt,
    updatedAt: dbCollection.updatedAt,
    num: dbCollection.num,
    collection_event: dbCollection.collection_event
  };
}

/**
 * 获取用户默认收藏夹ID
 * @param userId 用户ID
 * @returns 默认收藏夹ID，格式为`${DEFAULT_COLLECTION_PREFIX}${userId}`
 */
export function getDefaultCollectionId(userId: string): string {
  return `${DEFAULT_COLLECTION_PREFIX}${userId}`;
}

