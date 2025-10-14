'use client'
import { TimelineData } from '@/db/types';
import { EventCard } from '@/db/model/vo/EventCard';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import EventSelector from '@/components/features/events/EventSelector';
import TimelineJS from '@/components/features/timeline/TimelineJS';

// 模拟创建时间轴的API调用
const mockCreateTimeline = async (timelineData: TimelineData): Promise<{ id: string }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  // 模拟返回创建的时间轴ID
  return { id: `timeline_${Date.now()}` };
};

export default function CreateTimelinePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('CreateTimelinePage');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEventSelectorOpen, setIsEventSelectorOpen] = useState(false);
  const [timelineInitFailed, setTimelineInitFailed] = useState(false);
  
  // 时间轴基本信息
  const [formData, setFormData] = useState<TimelineData>({
    title: '',
    description: '',
    events: [],
    id: '',
    createdAt: '',
    updatedAt: '',
    authorId: ''
  });
  
  // 已选择的事件数据
  const [selectedEvents, setSelectedEvents] = useState<EventCard[]>([]);

  // 如果会话状态正在加载中，显示加载指示器
  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <LoadingIndicator buttonStyle={true} loadingText={t('loading')} />
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录提示
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t('pleaseLogin')}</h2>
            <p className="text-gray-600 mb-6">{t('loginRequired')}</p>
            <a
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150"
            >
              {t('loginNow')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 处理基本信息变更
  const handleBasicInfoChange = (field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理添加事件
  const handleAddEvents = (events: EventCard[]) => {
    // 避免重复添加事件
    const existingEventIds = new Set(selectedEvents.map(event => event.id));
    const newEvents = events.filter(event => !existingEventIds.has(event.id));
    
    if (newEvents.length > 0) {
      const updatedEvents = [...selectedEvents, ...newEvents];
      setSelectedEvents(updatedEvents);
      
      // 更新表单数据中的事件ID列表
      setFormData(prev => ({
        ...prev,
        events: updatedEvents.map(event => event.id)
      }));
    }
    
    // 关闭选择器
    setIsEventSelectorOpen(false);
  };

  // 处理移除事件
  const handleRemoveEvent = (eventId: string) => {
    setSelectedEvents(prev => prev.filter(event => event.id !== eventId));
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter(id => id !== eventId)
    }));
  };

  // 预览时间轴
  const handlePreview = () => {
    if (!formData.title.trim()) {
      setError(t('titleRequired'));
      return;
    }
    
    if (selectedEvents.length === 0) {
      setError(t('atLeastOneEvent'));
      return;
    }
    
    setError(null);
    setIsPreviewMode(true);
  };

  // 返回编辑模式
  const handleBackToEdit = () => {
    setIsPreviewMode(false);
    setTimelineInitFailed(false);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError(t('titleRequired'));
      return;
    }
    
    if (selectedEvents.length === 0) {
      setError(t('atLeastOneEvent'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 添加用户ID
      const timelineDataWithUser = {
        ...formData,
        authorId: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 调用模拟API
      const result = await mockCreateTimeline(timelineDataWithUser);
      
      // 成功后跳转到时间轴详情页
      router.push(`/timeline/${result.id}`);
    } catch (err) {
      setError(t('createFailed', { error: err instanceof Error ? err.message : t('unknownError') }));
    } finally {
      setLoading(false);
    }
  };

  // 准备TimelineJS数据格式
  const prepareTimelineData = () => {
    return {
      title: formData.title,
      description: formData.description,
      events: selectedEvents
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">      
      {/* 头部导航 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('createTimeline')}</h1>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
        >
          {t('cancel')}
        </button>
      </div>

      {/* 错误信息显示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {isPreviewMode ? (
        // 预览模式
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('preview')}</h2>
              <button 
                onClick={handleBackToEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
              >
                {t('backToEdit')}
              </button>
            </div>
          </div>
          
          {/* 时间轴内容 */}
          <div className="overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            {timelineInitFailed ? (
              <div className="flex justify-center items-center h-64 text-gray-500">
                {t('timelineInitFailed')}
                <button 
                  onClick={() => setTimelineInitFailed(false)}
                  className="ml-4 text-primary-600 hover:underline"
                >
                  {t('retry')}
                </button>
              </div>
            ) : (
              <TimelineJS 
                data={prepareTimelineData()}
              />
            )}
          </div>
          
          {/* 底部操作按钮 */}
          <div className="p-6 border-t border-gray-100 flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>⏳ {t('submitting')}</>
              ) : (
                <>✓ {t('createTimeline')}</>
              )}
            </button>
          </div>
        </div>
      ) : (
        // 编辑模式 - 表单
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('timelineInfo')}</h2>
            
            {/* 时间轴标题 */}
            <div className="mb-6">
              <label htmlFor="timeline-title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('timelineTitle')}
              </label>
              <input
                type="text"
                id="timeline-title"
                value={formData.title}
                onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                placeholder={t('timelineTitlePlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>
            
            {/* 时间轴描述 */}
            <div className="mb-6">
              <label htmlFor="timeline-description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('timelineDescription')}
              </label>
              <textarea
                id="timeline-description"
                value={formData.description}
                onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                placeholder={t('timelineDescriptionPlaceholder')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
          
          {/* 事件列表 */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('events')}</h2>
            
            {/* 已选择的事件列表 */}
            {selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleDateString()}
                          {event.tags && event.tags.length > 0 && (
                            <span className="ml-2">
                              {event.tags.slice(0, 3).join(', ')}
                              {event.tags.length > 3 && '+更多'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(event.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={t('removeEvent')}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">{t('noEventsSelected')}</p>
                <button
                  type="button"
                  onClick={() => setIsEventSelectorOpen(true)}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
                >
                  {t('selectEvents')}
                </button>
              </div>
            )}
          </div>
          
          {/* 底部操作按钮 */}
          <div className="p-6 flex justify-between">
            <button
              type="button"
              onClick={handlePreview}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t('preview')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>⏳ {t('submitting')}</>
              ) : (
                <>✓ {t('createTimeline')}</>
              )}
            </button>
          </div>
        </form>
      )}
      
      {/* 事件选择器 */}
      <EventSelector
        isOpen={isEventSelectorOpen}
        onClose={() => setIsEventSelectorOpen(false)}
        onAddEvents={handleAddEvents}
      />
    </div>
  );
}