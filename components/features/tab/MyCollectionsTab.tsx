'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { collection } from '@prisma/client';
import { collection_event } from '@prisma/client';
import { EventCard } from '@/components';
import { Event } from '@/db/model/vo/Event';

// Mock收藏夹数据
const mockCollections: collection[] = [
  {
    id: '1',
    name: '科技新闻收藏',
    description: '收集的重要科技新闻和创新信息',
    createdAt: new Date('2024-05-10T15:30:00Z'),
    updatedAt: new Date('2024-05-18T10:20:00Z'),
    userId: 'user1'
  },
  {
    id: '2',
    name: '环保相关资讯',
    description: '环保政策、活动和研究的收集',
    createdAt: new Date('2024-04-22T09:15:00Z'),
    updatedAt: new Date('2024-05-05T16:45:00Z'),
    userId: 'user1'
  },
  {
    id: '3',
    name: '个人灵感库',
    description: '日常收集的灵感和创意点子',
    createdAt: new Date('2024-03-01T12:00:00Z'),
    updatedAt: new Date('2024-05-12T19:30:00Z'),
    userId: 'user1'
  }
];

// Mock收藏夹中的事件数据
const mockCollectionEvents: collection_event[] = [
  {
    id: '1',
    collectionId: '1',
    eventId: '1',
    createdAt: new Date('2024-05-18T10:20:00Z'),
    updatedAt: new Date('2024-05-18T10:20:00Z')
  },
  {
    id: '2',
    collectionId: '1',
    eventId: '2',
    createdAt: new Date('2024-05-10T15:30:00Z'),
    updatedAt: new Date('2024-05-10T15:30:00Z')
  },
  {
    id: '3',
    collectionId: '2',
    eventId: '1',
    createdAt: new Date('2024-05-05T16:45:00Z'),
    updatedAt: new Date('2024-05-05T16:45:00Z')
  },
  {
    id: '4',
    collectionId: '2',
    eventId: '3',
    createdAt: new Date('2024-04-22T09:15:00Z'),
    updatedAt: new Date('2024-04-22T09:15:00Z')
  },
  {
    id: '5',
    collectionId: '3',
    eventId: '2',
    createdAt: new Date('2024-05-12T19:30:00Z'),
    updatedAt: new Date('2024-05-12T19:30:00Z')
  },
  {
    id: '6',
    collectionId: '3',
    eventId: '3',
    createdAt: new Date('2024-03-01T12:00:00Z'),
    updatedAt: new Date('2024-03-01T12:00:00Z')
  }
];

// Mock事件数据（用于展示）
const mockEvents: Record<string, Event> = {
  '1': {
    id: '1',
    title: '全球气候峰会在巴黎召开',
    description: '各国领导人齐聚巴黎，就应对气候变化达成新的协议。会议重点讨论了减排目标和国际合作机制。',
    timestamp: '2024-05-15T10:00:00Z',
    sourceType: 'news',
    images: ['https://example.com/climate-summit.jpg'],
    tags: ['气候', '国际会议', '环保'],
    authorId: 'user1',
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z',
    author: {
      id: 'user1',
      name: '环保记者 李明',
      image: 'https://example.com/author1.jpg',
      email: 'liming@example.com'
    }
  },
  '2': {
    id: '2',
    title: '科技创新大会在上海举办',
    description: '2024科技创新大会展示了人工智能、量子计算等前沿技术的最新进展。多家科技巨头发布了重要产品。',
    timestamp: '2024-04-20T09:30:00Z',
    sourceType: 'social',
    images: ['https://example.com/tech-conference.jpg'],
    tags: ['科技', '人工智能', '创新'],
    authorId: 'user1',
    createdAt: '2024-04-20T09:30:00Z',
    updatedAt: '2024-04-20T09:30:00Z',
    author: {
      id: 'user1',
      name: '科技爱好者 张伟',
      image: 'https://example.com/author1.jpg',
      email: 'zhangwei@example.com'
    }
  },
  '3': {
    id: '3',
    title: '社区植树活动圆满完成',
    description: '周末社区组织了一场大型植树活动，共有超过200名志愿者参与，种植了500多棵树苗。',
    timestamp: '2024-03-10T14:00:00Z',
    sourceType: 'personal',
    images: [],
    tags: ['社区', '环保', '志愿活动'],
    authorId: 'user1',
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-03-10T14:00:00Z',
    author: {
      id: 'user1',
      name: '社区志愿者 王芳',
      image: 'https://example.com/author1.jpg',
      email: 'wangfang@example.com'
    }
  }
};

const MyCollectionsTab: React.FC = () => {
  const t = useTranslations('MyCollectionsTab');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(mockCollections[0]?.id || null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 获取选中收藏夹中的事件
  const getCollectionEvents = (collectionId: string) => {
    return mockCollectionEvents
      .filter(ce => ce.collectionId === collectionId)
      .map(ce => mockEvents[ce.eventId])
      .filter(Boolean);
  };

  // 获取收藏夹事件数量
  const getEventCount = (collectionId: string) => {
    return mockCollectionEvents.filter(ce => ce.collectionId === collectionId).length;
  };

  const selectedEvents = selectedCollection ? getCollectionEvents(selectedCollection) : [];
  const selectedCollectionData = mockCollections.find(c => c.id === selectedCollection);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('myCollectionsTitle')}</h2>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors">
          {t('createNewCollection')}
        </button>
      </div>

      {mockCollections.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 收藏夹列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">{t('collectionList')}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {mockCollections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => setSelectedCollection(collection.id)}
                    className={`w-full text-left p-4 transition-colors ${selectedCollection === collection.id ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{collection.name}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{collection.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {collection.updatedAt ? formatDate(collection.updatedAt.toISOString()) : ''}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                            {getEventCount(collection.id)} {t('events')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 收藏夹内容 */}
          <div className="lg:col-span-2">
            {selectedCollectionData && (
              <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">{selectedCollectionData.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedCollectionData.description}</p>
                </div>
                <div className="p-4">
                  {selectedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {selectedEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">{t('noEventsInCollection')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noCollectionsCreated')}</h3>
          <p className="text-gray-600 mb-4">{t('noCollectionsDescription')}</p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors">
            {t('createFirstCollection')}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCollectionsTab;