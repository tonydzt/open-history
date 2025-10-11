'use client'
import { TimelineData } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import EventImageUploader from '@/components/features/events/EventImageUploader';
import { type PutBlobResult } from '@vercel/blob';
import LoadingIndicator from '@/components/common/LoadingIndicator';

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
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // 时间轴基本信息
  const [formData, setFormData] = useState<TimelineData>({
    title: '',
    description: '',
    events: [{
      id: `event_${Date.now()}`,
      title: '',
      description: '',
      timestamp: new Date().toISOString().slice(0, 10),
      images: [''],
      tags: ['']
    }]
  });

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

  // 处理事件变更
  const handleEventChange = (eventId: string, field: keyof TimelineEvent, value: any) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.map(event => 
        event.id === eventId ? { ...event, [field]: value } : event
      )
    }));
  };

  // 添加新事件
  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: `event_${Date.now()}`,
      title: '',
      description: '',
      timestamp: new Date().toISOString().slice(0, 10),
      images: [''],
      tags: ['']
    };
    
    setFormData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  };

  // 删除事件
  const removeEvent = (eventId: string) => {
    if (formData.events.length <= 1) {
      setError(t('atLeastOneEvent'));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId)
    }));
    setError(null);
  };

  // 处理标签变更
  const handleTagsChange = (eventId: string, index: number, value: string) => {
    setFormData(prev => {
      const updatedEvents = [...prev.events];
      const eventIndex = updatedEvents.findIndex(event => event.id === eventId);
      
      if (eventIndex !== -1) {
        const updatedTags = [...updatedEvents[eventIndex].tags!];
        updatedTags[index] = value;
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          tags: updatedTags
        };
      }
      
      return { ...prev, events: updatedEvents };
    });
  };

  // 添加新标签
  const addTag = (eventId: string) => {
    setFormData(prev => {
      const updatedEvents = [...prev.events];
      const eventIndex = updatedEvents.findIndex(event => event.id === eventId);
      
      if (eventIndex !== -1) {
        const updatedTags = [...updatedEvents[eventIndex].tags!, ''];
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          tags: updatedTags
        };
      }
      
      return { ...prev, events: updatedEvents };
    });
  };

  // 删除标签
  const removeTag = (eventId: string, index: number) => {
    setFormData(prev => {
      const updatedEvents = [...prev.events];
      const eventIndex = updatedEvents.findIndex(event => event.id === eventId);
      
      if (eventIndex !== -1) {
        const updatedTags = updatedEvents[eventIndex].tags!.filter((_, i) => i !== index);
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          tags: updatedTags.length > 0 ? updatedTags : ['']
        };
      }
      
      return { ...prev, events: updatedEvents };
    });
  };

  // 处理图片上传成功
  const handleImageUploadSuccess = (eventId: string, result: PutBlobResult) => {
    setFormData(prev => {
      const updatedEvents = [...prev.events];
      const eventIndex = updatedEvents.findIndex(event => event.id === eventId);
      
      if (eventIndex !== -1) {
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          images: [result.url]
        };
      }
      
      return { ...prev, events: updatedEvents };
    });
  };

  // 处理图片上传错误
  const handleImageUploadError = (error: Error) => {
    setError(error.message);
  };

  // 预览时间轴
  const handlePreview = () => {
    if (!formData.title.trim()) {
      setError(t('titleRequired'));
      return;
    }
    
    if (formData.events.some(event => !event.title.trim() || !event.timestamp)) {
      setError(t('completeEventInfo'));
      return;
    }
    
    setError(null);
    setIsPreviewMode(true);
    
    // 模拟加载TimelineJS
    setTimeout(() => {
      if (timelineContainerRef.current) {
        // 这里可以实际集成TimelineJS
        renderMockTimeline();
      }
    }, 500);
  };

  // 返回编辑模式
  const handleBackToEdit = () => {
    setIsPreviewMode(false);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError(t('titleRequired'));
      return;
    }
    
    if (formData.events.some(event => !event.title.trim() || !event.timestamp)) {
      setError(t('completeEventInfo'));
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

  // 渲染模拟的TimelineJS预览
  const renderMockTimeline = () => {
    if (!timelineContainerRef.current) return;
    
    // 清空容器
    timelineContainerRef.current.innerHTML = '';
    
    // 排序事件
    const sortedEvents = [...formData.events].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // 创建时间轴容器
    const timelineWrapper = document.createElement('div');
    timelineWrapper.className = 'relative w-full';
    
    // 创建时间轴线
    const timelineLine = document.createElement('div');
    timelineLine.className = 'absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200';
    timelineWrapper.appendChild(timelineLine);
    
    // 添加事件点
    sortedEvents.forEach((event, index) => {
      const isLeft = index % 2 === 0;
      const eventWrapper = document.createElement('div');
      eventWrapper.className = `relative flex ${isLeft ? 'justify-start md:justify-end md:pr-12' : 'justify-start md:pl-12'} mb-8`;
      
      // 时间点
      const dot = document.createElement('div');
      dot.className = 'absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary-600 border-4 border-white shadow-md';
      eventWrapper.appendChild(dot);
      
      // 事件内容
      const eventContent = document.createElement('div');
      eventContent.className = `w-full md:w-5/12 bg-white p-4 rounded-lg shadow-md border border-gray-100`;
      
      // 事件日期
      const eventDate = document.createElement('div');
      eventDate.className = 'text-sm text-primary-600 font-medium mb-1';
      eventDate.textContent = new Date(event.timestamp).toLocaleDateString();
      eventContent.appendChild(eventDate);
      
      // 事件标题
      const eventTitle = document.createElement('h3');
      eventTitle.className = 'text-lg font-bold text-gray-900 mb-2';
      eventTitle.textContent = event.title;
      eventContent.appendChild(eventTitle);
      
      // 事件描述
      if (event.description) {
        const eventDesc = document.createElement('p');
        eventDesc.className = 'text-gray-600 mb-3';
        eventDesc.textContent = event.description;
        eventContent.appendChild(eventDesc);
      }
      
      // 事件图片
      if (event.images && event.images[0] && event.images[0] !== '') {
        const eventImage = document.createElement('img');
        eventImage.src = event.images[0];
        eventImage.className = 'w-full h-48 object-cover rounded-md mb-3';
        eventContent.appendChild(eventImage);
      }
      
      // 事件标签
      if (event.tags && event.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'flex flex-wrap gap-2';
        
        event.tags.forEach(tag => {
          if (tag.trim()) {
            const tagElement = document.createElement('span');
            tagElement.className = 'bg-primary-50 text-primary-600 text-xs px-2 py-1 rounded-full';
            tagElement.textContent = tag.trim();
            tagsContainer.appendChild(tagElement);
          }
        });
        
        if (tagsContainer.children.length > 0) {
          eventContent.appendChild(tagsContainer);
        }
      }
      
      eventWrapper.appendChild(eventContent);
      timelineWrapper.appendChild(eventWrapper);
    });
    
    timelineContainerRef.current.appendChild(timelineWrapper);
  };

  // 监听窗口大小变化，重新渲染时间轴
  useEffect(() => {
    if (isPreviewMode) {
      const handleResize = () => {
        renderMockTimeline();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isPreviewMode, formData]);

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
            
            {/* 时间轴预览容器 */}
            <div className="mt-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{formData.title}</h3>
              {formData.description && (
                <p className="text-gray-600 mb-4">{formData.description}</p>
              )}
            </div>
          </div>
          
          {/* 时间轴内容 */}
          <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            <div ref={timelineContainerRef} className="w-full">
              {/* TimelineJS 将在这里渲染 */}
              <div className="flex justify-center items-center h-64 text-gray-500">
                {t('loadingPreview')}
              </div>
            </div>
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
            
            {/* 事件添加按钮 */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={addEvent}
                className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('addEvent')}
              </button>
            </div>
            
            {/* 事件表单 */}
            {formData.events.map((event, eventIndex) => (
              <div key={event.id} className="bg-gray-50 p-6 rounded-lg mb-6 relative">
                {/* 删除事件按钮 */}
                {formData.events.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEvent(event.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={t('deleteEvent')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('event')} {eventIndex + 1}
                </h3>
                
                {/* 事件标题 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('eventTitle')}
                  </label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => handleEventChange(event.id, 'title', e.target.value)}
                    placeholder={t('eventTitlePlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
                
                {/* 事件描述 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('eventDescription')}
                  </label>
                  <textarea
                    value={event.description}
                    onChange={(e) => handleEventChange(event.id, 'description', e.target.value)}
                    placeholder={t('eventDescriptionPlaceholder')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                
                {/* 事件日期 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('eventDate')}
                  </label>
                  <input
                    type="date"
                    value={event.timestamp}
                    onChange={(e) => handleEventChange(event.id, 'timestamp', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
                
                {/* 事件图片 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('eventImage')}
                  </label>
                  <EventImageUploader
                    onSuccess={(result: PutBlobResult) => handleImageUploadSuccess(event.id, result)}
                    onError={handleImageUploadError}
                    showPreview={true}
                  />
                </div>
                
                {/* 事件标签 */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('eventTags')}
                  </label>
                  <div className="space-y-2">
                    {event.tags?.map((tag, tagIndex) => (
                      <div key={tagIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleTagsChange(event.id, tagIndex, e.target.value)}
                          placeholder={t('eventTagPlaceholder')}
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        />
                        {event.tags?.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTag(event.id, tagIndex)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label={t('removeTag')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addTag(event.id)}
                      className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
                    >
                      + {t('addTag')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}