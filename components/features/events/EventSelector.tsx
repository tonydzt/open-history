import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LoadingIndicator from '@/components/common/LoadingIndicator';

// 定义事件类型
interface Event {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  images?: string[];
  tags?: string[];
}

interface EventSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvents: (events: Event[]) => void;
}

// 模拟获取事件列表的API
const mockGetEvents = async (page: number, pageSize: number): Promise<{ events: Event[], total: number }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟事件数据
  const allEvents: Event[] = Array.from({ length: 30 }, (_, i) => ({
    id: `event_${Date.now()}_${i}`,
    title: `示例事件 ${i + 1}`,
    description: `这是一个示例事件的描述文本，包含了事件的详细信息。事件编号: ${i + 1}`,
    timestamp: new Date(Date.now() - i * 86400000 * 7).toISOString().slice(0, 10),
    images: i % 3 === 0 ? [`https://picsum.photos/seed/${i}/300/200`] : [],
    tags: i % 2 === 0 ? [`标签${i % 5 + 1}`, `标签${(i + 1) % 5 + 1}`] : []
  }));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEvents = allEvents.slice(startIndex, endIndex);
  
  return {
    events: paginatedEvents,
    total: allEvents.length
  };
};

const EventSelector: React.FC<EventSelectorProps> = ({ isOpen, onClose, onAddEvents }) => {
  const t = useTranslations('EventSelector');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // 加载事件列表
  const loadEvents = async (pageNum: number) => {
    setLoading(true);
    try {
      const result = await mockGetEvents(pageNum, pageSize);
      setEvents(result.events);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载和分页变化时加载
  useEffect(() => {
    if (isOpen) {
      loadEvents(page);
    }
  }, [isOpen, page]);

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

  // 关闭选择框时清空选择
  useEffect(() => {
    if (!isOpen) {
      setSelectedEvents([]);
    }
  }, [isOpen]);

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

        {/* 选择框内容 */}
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