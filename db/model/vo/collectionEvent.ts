
import { Event, transformEvent } from './Event';
import { Collection } from './collection';

/**
 * 收藏夹事件关联表的视图模型
 */
export interface CollectionEvent {
  id: string;
  collectionId: string;
  eventId: string;
  createdAt?: Date;
  updatedAt?: Date;
  collection?: Collection;
  event?: Event;
}

/**
 * 收藏夹事件列表响应模型
 */
export interface CollectionEventsResponse {
  events: CollectionEvent[];
  nextCursor: string | null;
}

/**
 * 将数据库中的collection_event模型转换为前端视图模型
 * @param dbCollectionEvent 数据库中的收藏夹事件关联记录
 * @returns CollectionEvent视图模型
 */
export const transformToCollectionEvent = (dbCollectionEvent: any): CollectionEvent => ({
  id: dbCollectionEvent.id,
  collectionId: dbCollectionEvent.collectionId,
  eventId: dbCollectionEvent.eventId,
  createdAt: dbCollectionEvent.createdAt,
  updatedAt: dbCollectionEvent.updatedAt,
  // 关联对象可能需要单独转换，这里保持原样
  collection: dbCollectionEvent.collection,
  // tong注释: 这里Event是属性名，区分大小写的！写dbCollectionEvent.event就取不到值
  event: transformEvent(dbCollectionEvent.Event)
});



