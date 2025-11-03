'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { collection } from '@prisma/client';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import EventCard from '@/components/features/events/EventCard';
import { CollectionEvent, CollectionEventsResponse } from '@/db/model/vo/collectionEvent';

// 扩展collection类型，添加_count字段
interface CollectionWithCount extends collection {
  _count?: {
    collection_event: number;
  };
}

// API响应类型
interface ApiResponse {
  collections: CollectionWithCount[];
  nextCursor: string | null;
}

const MyCollectionsTab: React.FC = () => {
  const t = useTranslations('MyCollectionsTab');
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionWithCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [editCollectionName, setEditCollectionName] = useState('');
  const [editCollectionDescription, setEditCollectionDescription] = useState('');
  // 新增：收藏夹事件列表相关状态
  const [collectionEvents, setCollectionEvents] = useState<CollectionEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewCollectionName('');
    setNewCollectionDescription('');
  };

  const handleOpenEditModal = (collection: CollectionWithCount) => {
    setEditingCollection(collection);
    setEditCollectionName(collection.name);
    setEditCollectionDescription(collection.description || '');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingCollection(null);
    setEditCollectionName('');
    setEditCollectionDescription('');
  };

  // 从API获取收藏夹数据
  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/component/tab/collection');
      
      if (!response.ok) {
        throw new Error('获取收藏夹失败');
      }
      
      const data: ApiResponse = await response.json();
      setCollections(data.collections);
      
      // 如果有收藏夹且没有选中的收藏夹，默认选中第一个
      if (data.collections.length > 0 && !selectedCollection) {
        setSelectedCollection(data.collections[0].id);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchCollections();
  }, []);

  // 当选中的收藏夹变化时，获取该收藏夹的事件列表
  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionEvents(selectedCollection);
    } else {
      setCollectionEvents([]);
    }
  }, [selectedCollection]);

  // 创建收藏夹
  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      alert('请输入收藏夹名称');
      return;
    }

    try {
      const response = await fetch('/api/component/tab/collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCollectionName,
          description: newCollectionDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '创建收藏夹失败');
      }

      // 重新获取收藏夹列表
      await fetchCollections();
      handleCloseCreateModal();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // 编辑收藏夹
  const handleEditCollection = async () => {
    if (!editingCollection || !editCollectionName.trim()) {
      alert('请输入收藏夹名称');
      return;
    }

    try {
      const response = await fetch('/api/component/tab/collection', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionId: editingCollection.id,
          name: editCollectionName,
          description: editCollectionDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '编辑收藏夹失败');
      }

      // 重新获取收藏夹列表
      await fetchCollections();
      handleCloseEditModal();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // 删除收藏夹
  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm(t('confirmDeleteCollection'))) {
      return;
    }

    try {
      const response = await fetch('/api/component/tab/collection', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionId: collectionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除收藏夹失败');
      }

      // 如果删除的是当前选中的收藏夹，清除选中状态
      if (selectedCollection === collectionId) {
        setSelectedCollection(null);
      }

      // 重新获取收藏夹列表
      await fetchCollections();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 获取收藏夹事件数量
  const getEventCount = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection?._count?.collection_event || 0;
  };

  // 获取收藏夹事件列表
  const fetchCollectionEvents = async (collectionId: string) => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      
      // 调用新的收藏夹事件列表接口
      const response = await fetch(`/api/component/tab/collection/collectionEvent?collectionId=${collectionId}`);
      
      if (!response.ok) {
        throw new Error('获取收藏夹事件列表失败');
      }
      
      const data: CollectionEventsResponse = await response.json();
      setCollectionEvents(data.events || []);
    } catch (err) {
      setEventsError((err as Error).message);
    } finally {
      setEventsLoading(false);
    }
  };

  const selectedCollectionData = collections.find(c => c.id === selectedCollection);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('myCollectionsTitle')}</h2>
        <button 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          onClick={handleOpenCreateModal}
        >
          {t('createNewCollection')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingIndicator />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 收藏夹列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">{t('collectionList')}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {collections.map((collection) => (
                  <div key={collection.id} className="relative">
                    <div
                      onClick={() => setSelectedCollection(collection.id)}
                      className={`w-full text-left p-4 transition-colors cursor-pointer ${selectedCollection === collection.id ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{collection.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{collection.description}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {collection.updatedAt ? formatDate(collection.updatedAt) : ''}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                              {getEventCount(collection.id)} {t('events')}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(collection);
                            }}
                            className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            aria-label={t('edit')}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCollection(collection.id);
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            aria-label={t('delete')}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  {eventsLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <LoadingIndicator />
                    </div>
                  ) : eventsError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                      {eventsError}
                    </div>
                  ) : collectionEvents.length > 0 ? (
                    <div className="space-y-4">
                      {collectionEvents.map((item) => (
                        // tong注释: item.event!，这里!是非空断言操作符，用于告诉编译器某个值不会是null或undefined，使用 ! 操作符会跳过 TypeScript 的空值检查，这样可能会导致运行时错误
                        <EventCard key={item.eventId} event={item.event!} />
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
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
            onClick={handleOpenCreateModal}
          >
            {t('createFirstCollection')}
          </button>
        </div>
      )}

      {/* 创建收藏夹模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{t('createCollection')}</h3>
              <button 
                onClick={handleCloseCreateModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('collectionName')}</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('enterCollectionName')}
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('collectionDescription')}</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder={t('enterCollectionDescription')}
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                />
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                <button 
                  onClick={handleCloseCreateModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleCreateCollection}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
                >
                  {t('create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑收藏夹模态框 */}
      {showEditModal && editingCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{t('editCollection')}</h3>
              <button 
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('collectionName')}</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('enterCollectionName')}
                  value={editCollectionName}
                  onChange={(e) => setEditCollectionName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('collectionDescription')}</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder={t('enterCollectionDescription')}
                  value={editCollectionDescription}
                  onChange={(e) => setEditCollectionDescription(e.target.value)}
                />
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                <button 
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleEditCollection}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCollectionsTab;