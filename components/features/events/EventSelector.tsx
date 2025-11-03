import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { EventCard } from '@/db/model/vo/EventCard';

interface EventSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvents: (events: EventCard[]) => void;
  selectedEventIds?: string[];
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    collection_event: number;
  };
}

// 从API获取收藏夹列表
const fetchCollections = async (): Promise<Collection[]> => {
  try {
    const response = await fetch(
      '/api/component/tab/collection?limit=50',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('获取收藏夹列表失败');
    }
    
    const data = await response.json();
    return data.collections || [];
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
};

// 从API获取事件列表
const fetchEvents = async (page: number, pageSize: number, collectionId?: string): Promise<{ events: EventCard[], total: number }> => {
  try {
    let url = `/api/component/events/EventSelector/GetEventByPages?page=${page}&pageSize=${pageSize}`;
    if (collectionId) {
      url += `&collectionId=${collectionId}`;
    }
    
    const response = await fetch(url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('获取事件列表失败');
    }
    
    const data = await response.json();
    return {
      events: data.events || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

const EventSelector: React.FC<EventSelectorProps> = ({ isOpen, onClose, onAddEvents, selectedEventIds = [] }) => {
  const t = useTranslations('EventSelector');
  const [events, setEvents] = useState<EventCard[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // 加载收藏夹列表
  const loadCollections = async () => {
    if (!isOpen) return;
    
    try {
      const result = await fetchCollections();
      setCollections(result);
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  // 加载事件列表
  const loadEvents = async (pageNum: number, collectionId?: string) => {
    setLoading(true);
    try {
      const result = await fetchEvents(pageNum, pageSize, collectionId);
      setEvents(result.events);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Failed to load events:', error);
      // 可以在这里添加用户友好的错误提示
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载收藏夹列表
  useEffect(() => {
    loadCollections();
  }, [isOpen]);

  // 初始化加载和分页变化时加载
  useEffect(() => {
    if (isOpen) {
      loadEvents(page, selectedCollection || undefined);
    }
  }, [isOpen, page, selectedCollection]);

  // 处理事件选择
  const handleEventSelect = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(event => event.id));
    }
  };

  // 处理添加事件
  const handleAddSelectedEvents = () => {
    const selectedEventsData = events.filter(event => 
      selectedEvents.includes(event.id)
    );
    if (selectedEventsData.length > 0) {
      onAddEvents(selectedEventsData);
      setSelectedEvents([]); // 清空选择
      onClose(); // 关闭选择框
    }
  };

  // 当选择框打开或已选中的事件ID变化时，更新选中状态
  useEffect(() => {
    if (isOpen) {
      // 只保留当前页面中存在且在selectedEventIds中的事件ID
      const filteredSelectedEvents = events
        .map(event => event.id)
        .filter(id => selectedEventIds.includes(id));
      setSelectedEvents(filteredSelectedEvents);
    }
  }, [isOpen, events, selectedEventIds]);

  // 如果选择框未打开，不渲染
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* 选择框头部 */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{t('selectEvents')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('close')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 收藏夹选择区域 - 固定在最上方 */}
        <div className="p-6 border-b border-gray-100">
          <label htmlFor="collection-select" className="block text-sm font-medium text-gray-700 mb-2">
            {t('selectCollection')}
          </label>
          <select
            id="collection-select"
            value={selectedCollection}
            onChange={(e) => {
              setSelectedCollection(e.target.value);
              setPage(1); // 重置到第一页
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">{t('allEvents')}</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name} ({collection._count.collection_event})
              </option>
            ))}
          </select>
        </div>

        {/* 事件列表区域 - 可滚动 */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingIndicator buttonStyle={false} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* 选择操作栏 */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={events.length > 0 && selectedEvents.length === events.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                    {t('selectAll')}
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  {t('selectedCount', { count: selectedEvents.length })}
                </span>
              </div>

              {/* 事件列表 */}
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.map(event => (
                    <div
                      key={event.id}
                      className={`border rounded-lg p-4 transition-colors ${selectedEvents.includes(event.id) ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => handleEventSelect(event.id)}
                          className="h-4 w-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <div className="text-sm text-gray-500 mb-2">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {event.description}
                            </p>
                          )}
                          {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {event.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {event.images && event.images[0] && (
                          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={event.images[0]}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {t('noEvents')}
                  </div>
                )}
              </div>

              {/* 分页控件 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {t('prevPage')}
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${pageNum === page ? 'bg-primary-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {t('nextPage')}
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 选择框底部 */}
        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleAddSelectedEvents}
            disabled={selectedEvents.length === 0 || loading}
            className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors ${selectedEvents.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {t('addSelected')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSelector;