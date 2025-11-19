'use client'
import { Timeline } from '@/db/model/vo/Timeline';
import { EventCard } from '@/db/model/vo/EventCard';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import EventSelector from '@/components/features/events/EventSelector';
import TimelineComponent from '@/components/features/timeline/TimelineJS';
import ImageUploader from '@/components/common/ImageUploader';
import Image from 'next/image';

// 更新时间轴的API调用
const updateTimeline = async (id: string, timelineData: Timeline): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/timeline/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(timelineData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update timeline');
  }
  
  return response.json();
};

// 获取时间轴详情的API调用
const getTimelineDetail = async (id: string): Promise<any> => {
  const response = await fetch(`/api/timeline/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch timeline detail');
  }
  
  return response.json();
};

export default function EditTimelinePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const timelineId = params?.id;
  const t = useTranslations('EditTimelinePage');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEventSelectorOpen, setIsEventSelectorOpen] = useState(false);
  const [timelineInitFailed, setTimelineInitFailed] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  // 时间轴基本信息
  const [formData, setFormData] = useState<Timeline>({
    events: []
  });
  
  // 已选择的事件数据
  const [selectedEvents, setSelectedEvents] = useState<EventCard[]>([]);

  // 加载时间轴数据
  useEffect(() => {
    const loadTimelineData = async () => {
      if (!timelineId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const timelineData = await getTimelineDetail(timelineId);
        
        // 检查是否为时间轴所有者
        if (session?.user?.id === timelineData.userId) {
          setIsOwner(true);
        }
        
        // 设置表单数据
        setFormData(prev => ({
          ...prev,
          title: timelineData.title || { text: { headline: '', text: '' } },
          events: timelineData.events || [],
          background: timelineData.background,
          scale: timelineData.scale || 'human'
        }));
        
        // 转换事件数据格式
        const events: EventCard[] = (timelineData.events || []).map((event: any) => ({
          id: event.unique_id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: event.text?.headline || '',
          description: event.text?.text || '',
          timestamp: new Date(
            event.start_date?.year || new Date().getFullYear(),
            (event.start_date?.month || 1) - 1,
            event.start_date?.day || 1
          ).toISOString(),
          images: event.media?.url ? [event.media.url] : [],
          tags: event.group ? [event.group] : []
        }));
        
        setSelectedEvents(events);
      } catch (err) {
        console.error('Failed to load timeline data:', err);
        setError(t('loadFailed'));
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadTimelineData();
  }, [timelineId, t, session]);

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

  // 如果不是所有者，显示无权限提示
  if (!isOwner && !loading && !notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t('noPermission')}</h2>
            <p className="text-gray-600 mb-6">{t('onlyOwnerCanEdit')}</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150"
            >
              {t('goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 如果找不到时间轴，显示404
  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t('timelineNotFound')}</h2>
            <p className="text-gray-600 mb-6">{t('timelineNotFoundMessage')}</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150"
            >
              {t('goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 加载中显示
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <LoadingIndicator buttonStyle={true} loadingText={t('loadingTimeline')} />
        </div>
      </div>
    );
  }

  // 处理基本信息变更
  const handleBasicInfoChange = (field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      title: prev.title ? { ...prev.title, text: { headline: field === 'title' ? value : (prev.title.text?.headline || ''), text: field === 'description' ? value : (prev.title.text?.text || '') } } : { text: { headline: field === 'title' ? value : '', text: field === 'description' ? value : '' } }
    }));
  };
  
  // 处理背景设置变更
  const handleBackgroundChange = (field: 'color' | 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      background: prev.background ? { ...prev.background, [field]: value } : { [field]: value }
    }));
  };
  
  // 处理背景图片上传成功
  const handleBackgroundImageUploadSuccess = (result: any) => {
    setFormData(prev => ({
      ...prev,
      background: prev.background 
        ? { ...prev.background, url: result.url, alt: result.pathname.split('/').pop() }
        : { url: result.url, alt: result.pathname.split('/').pop() }
    }));
  };
  
  // 处理背景图片上传失败
  const handleBackgroundImageUploadError = (error: Error) => {
    setError(`图片上传失败: ${error.message}`);
  };
  
  // 移除背景图片
  const handleRemoveBackgroundImage = () => {
    setFormData(prev => ({
      ...prev,
      background: prev.background 
        ? { ...prev.background, url: undefined, alt: undefined }
        : undefined
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
      
      // 更新表单数据中的事件列表
      setFormData(prev => ({
        ...prev,
        events: updatedEvents.map(event => ({
          start_date: {
            year: new Date(event.timestamp).getFullYear(),
            month: new Date(event.timestamp).getMonth() + 1,
            day: new Date(event.timestamp).getDate()
          },
          text: {
            headline: event.title,
            text: event.description
          },
          media: event.images && event.images.length > 0 ? { url: event.images[0] } : undefined,
          unique_id: event.id,
          group: event.tags && event.tags.length > 0 ? event.tags[0] : undefined
        }))
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
      events: prev.events.filter(event => event.unique_id !== eventId)
    }));
  };

  // 预览时间轴
  const handlePreview = () => {
    if (!formData.title || !formData.title.text || !formData.title.text.headline) {
      setError(t('titleRequired'));
      return;
    }
    
    if (selectedEvents.length === 0 || formData.events.length === 0) {
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
    
    if (!formData.title || !formData.title.text || !formData.title.text.headline) {
      setError(t('titleRequired'));
      return;
    }
    
    if (selectedEvents.length === 0 || formData.events.length === 0) {
      setError(t('atLeastOneEvent'));
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // 调用实际API
      await updateTimeline(timelineId!, formData);
      
      // 成功后跳转到时间轴详情页
      router.push(`/timeline/${timelineId}`);
    } catch (err) {
      setError(t('updateFailed', { error: err instanceof Error ? err.message : t('unknownError') }));
    } finally {
      setSaving(false);
    }
  };

  // 准备TimelineJS数据格式
  const prepareTimelineData = () => {
    return formData;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">      
      {/* 头部导航 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('editTimeline')}</h1>
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
              <TimelineComponent 
                data={prepareTimelineData()}
              />
            )}
          </div>
          
          {/* 底部操作按钮 */}
          <div className="p-6 border-t border-gray-100 flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className={`px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <>⏳ {t('saving')}</>
              ) : (
                <>✓ {t('saveChanges')}</>
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
                value={formData.title?.text?.headline || ''}
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
                value={formData.title?.text?.text || ''}
                onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                placeholder={t('timelineDescriptionPlaceholder')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
            
            {/* 背景设置 */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('backgroundSettings')}</h3>
              
              {/* 背景颜色 */}
              <div className="mb-4">
                <label htmlFor="background-color" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('backgroundColor')}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="background-color"
                    value={formData.background?.color || '#ffffff'}
                    onChange={(e) => handleBackgroundChange('color', e.target.value)}
                    className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.background?.color || ''}
                    onChange={(e) => handleBackgroundChange('color', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
              
              {/* 背景图片 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('backgroundImage')}
                </label>
                {formData.background?.url ? (
                  <div className="relative w-full h-48">
                    <Image 
                      src={formData.background.url} 
                      alt={formData.background.alt || ''}
                      fill
                      className="object-contain rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveBackgroundImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-red-500 transition-colors"
                      aria-label={t('removeImage')}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBackgroundImage()}
                      className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      {t('changeImage')}
                    </button>
                  </div>
                ) : (
                  <ImageUploader
                    onUploadSuccess={handleBackgroundImageUploadSuccess}
                    onUploadError={handleBackgroundImageUploadError}
                    buttonText={t('uploadImage')}
                  />
                )}
              </div>
              
              {/* 背景图片替代文本 */}
              {formData.background?.url && (
                <div className="mb-4">
                  <label htmlFor="background-alt" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('imageAltText')}
                  </label>
                  <input
                    type="text"
                    id="background-alt"
                    value={formData.background.alt || ''}
                    onChange={(e) => handleBackgroundChange('alt', e.target.value)}
                    placeholder={t('imageAltTextPlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* 事件列表 */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('events')}</h2>
            
            {/* 已选择的事件列表 */}
            {selectedEvents.length > 0 ? (
              <div>
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
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEventSelectorOpen(true)}
                    className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('addMoreEvents') || t('selectEvents')}
                  </button>
                </div>
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
              disabled={saving}
              className={`px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <>⏳ {t('saving')}</>
              ) : (
                <>✓ {t('saveChanges')}</>
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
        selectedEventIds={selectedEvents.map(event => event.id)}
      />
    </div>
  );
}