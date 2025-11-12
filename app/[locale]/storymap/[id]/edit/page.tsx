'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import EventSelector from '@/components/features/events/EventSelector';
import StoryMapJS from '@/components/features/storymap/storymapJS';
import { EventCard } from '@/db/model/vo/EventCard';
import { StoryMapData, StoryMapSlide, transformLocation } from '@/db/model/vo/Storymap';

// 更新故事地图的API调用
const updateStoryMap = async (id: string, storymapData: StoryMapData, selectedEvents: EventCard[]): Promise<{ success: boolean }> => {
  // 提取首页幻灯片中的标题和描述
  const overviewSlide = storymapData.storymap.slides.find(slide => slide.type === 'overview');
  const name = overviewSlide?.text.headline || '';
  const description = overviewSlide?.text.text || '';
  
  // 提取事件ID列表
  const eventIds = selectedEvents.map(event => event.id);
  
  const response = await fetch('/api/storymap', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      name,
      description,
      eventIds
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update storymap');
  }
  
  const result = await response.json();
  return { success: result.success };
};

// 获取故事地图数据的函数
const fetchStoryMapData = async (id: string): Promise<{ data: StoryMapData, events: EventCard[] }> => {
  const response = await fetch(`/api/storymap?id=${id}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch storymap data');
  }
  
  const responseData = await response.json();
  
  // 从storymap_event中提取事件数据
  // 注意：这里需要额外的API调用或数据处理来获取完整的事件卡片数据
  // 目前我们假设GET接口返回的数据足够构建事件卡片
  const events: EventCard[] = [];
  
  // 如果幻灯片数组中有非overview类型的幻灯片，我们可以尝试从中提取事件信息
  const eventSlides = responseData.data.storymap.slides.filter((slide: StoryMapSlide) => slide.type !== 'overview');
  eventSlides.forEach((slide: StoryMapSlide, index: number) => {
    events.push({
      id: slide.id, // 这只是临时ID，实际应用中应该使用真实的事件ID
      title: slide.text.headline,
      description: slide.text.text,
      timestamp: slide.date || new Date().toISOString(),
      images: slide.media?.url ? [slide.media.url] : [],
      tags: [],
      geom: slide.location ? {
        lat: slide.location.lat,
        lng: slide.location.lon
      } : undefined
    });
  });
  
  return { data: responseData.data, events };
};

export default function EditStoryMapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const storymapId = params?.id;
  const t = useTranslations('CreateStoryMapPage'); // 复用创建页面的翻译
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEventSelectorOpen, setIsEventSelectorOpen] = useState(false);
  const [storymapInitFailed, setStorymapInitFailed] = useState(false);
  
  // 故事地图基本信息
  const [formData, setFormData] = useState<StoryMapData>({
    storymap: {
      language: 'en',
      map_type: 'osm:standard',
      map_as_image: false,
      slides: []
    }
  });
  
  // 已选择的事件数据
  const [selectedEvents, setSelectedEvents] = useState<EventCard[]>([]);

  // 加载故事地图数据
  useEffect(() => {
    const loadStoryMapData = async () => {
      if (!storymapId) {
        setError('Invalid storymap ID');
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        const { data, events } = await fetchStoryMapData(storymapId);
        setFormData(data);
        setSelectedEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load storymap data');
        console.error('Error loading storymap data:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    loadStoryMapData();
  }, [storymapId]);

  // 如果会话状态正在加载中，显示加载指示器
  if (status === 'loading' || initialLoading) {
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
    setFormData(prev => {
      // 获取现有的首页slide或创建新的
      let overviewSlide = prev.storymap.slides.find(slide => slide.type === 'overview');
      
      if (!overviewSlide) {
        // 如果不存在首页slide，则创建一个新的
        overviewSlide = {
          id: 'overview-0',
          type: 'overview',
          date: value, // 初始使用标题作为date
          text: {
            headline: field === 'title' ? value : '',
            text: field === 'description' ? value : ''
          },
          location: { lat: 39.9042, lon: 116.4074 }, // 默认北京坐标
        };
        return {
          ...prev,
          storymap: {
            ...prev.storymap,
            slides: [overviewSlide, ...prev.storymap.slides.filter(slide => slide.type !== 'overview')]
          }
        };
      } else {
        // 更新现有首页slide
        const updatedOverview = {
          ...overviewSlide,
          text: {
            ...overviewSlide.text,
            [field === 'title' ? 'headline' : 'text']: value
          },
          // 如果是标题变更，也更新date字段
          ...(field === 'title' && { date: value })
        };
        
        return {
          ...prev,
          storymap: {
            ...prev.storymap,
            slides: prev.storymap.slides.map(slide => 
              slide.type === 'overview' ? updatedOverview : slide
            )
          }
        };
      }
    });
  };

  // 处理添加事件
  const handleAddEvents = (events: EventCard[]) => {
    // 避免重复添加事件
    const existingEventIds = new Set(selectedEvents.map(event => event.id));
    const newEvents = events.filter(event => !existingEventIds.has(event.id));
    
    if (newEvents.length > 0) {
      const updatedEvents = [...selectedEvents, ...newEvents];
      setSelectedEvents(updatedEvents);
      
      // 更新表单数据中的幻灯片列表
      const newSlides: StoryMapSlide[] = newEvents.map(event => {
        return {
          id: event.id,
          date: new Date(event.timestamp).toISOString().split('T')[0], // 格式化为 YYYY-MM-DD
          text: {
            headline: event.title,
            text: event.description || ''
          },
          location: event.geom ? transformLocation(event.geom) : { lat: 0, lon: 0 },
          media: event.images && event.images.length > 0 ? {
            url: event.images[0],
            credit: '',
            caption: ''
          } : undefined
        };
      });
      
      // 获取overview slide
      const overviewSlide = formData.storymap.slides.find(slide => slide.type === 'overview');
      // 过滤掉非overview的slides
      const nonOverviewSlides = formData.storymap.slides.filter(slide => slide.type !== 'overview');
      
      setFormData(prev => ({
        ...prev,
        storymap: {
          ...prev.storymap,
          slides: overviewSlide ? [overviewSlide, ...nonOverviewSlides, ...newSlides] : [...nonOverviewSlides, ...newSlides]
        }
      }));
    }
    
    // 关闭选择器
    setIsEventSelectorOpen(false);
  };

  // 处理移除事件
  const handleRemoveEvent = (eventId: string) => {
    // 找到要移除的事件在selectedEvents中的索引
    const eventIndex = selectedEvents.findIndex(event => event.id === eventId);
    
    if (eventIndex !== -1) {
      setSelectedEvents(prev => prev.filter(event => event.id !== eventId));
      
      // 获取overview slide
      const overviewSlide = formData.storymap.slides.find(slide => slide.type === 'overview');
      // 过滤掉要移除的事件对应的slide
      const updatedSlides = formData.storymap.slides.filter((slide, index) => {
        // 保留overview slide，移除对应的事件slide
        // 如果有overview slide，事件slide从索引1开始
        return slide.type === 'overview' || index !== eventIndex + (overviewSlide ? 1 : 0);
      });
      
      setFormData(prev => ({
        ...prev,
        storymap: {
          ...prev.storymap,
          slides: updatedSlides
        }
      }));
    }
  };

  // 预览故事地图
  const handlePreview = () => {
    // 检查是否有首页slide且有标题
    const overviewSlide = formData.storymap.slides.find(slide => slide.type === 'overview');
    if (!overviewSlide || !overviewSlide.text.headline) {
      setError(t('titleRequired'));
      return;
    }
    
    if (selectedEvents.length === 0 || formData.storymap.slides.filter(slide => slide.type !== 'overview').length === 0) {
      setError(t('atLeastOneEvent'));
      return;
    }
    
    setError(null);
    setIsPreviewMode(true);
  };

  // 返回编辑模式
  const handleBackToEdit = () => {
    setIsPreviewMode(false);
    setStorymapInitFailed(false);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 检查是否有首页slide且有标题
    const overviewSlide = formData.storymap.slides.find(slide => slide.type === 'overview');
    if (!overviewSlide || !overviewSlide.text.headline) {
      setError(t('titleRequired'));
      return;
    }
    
    if (selectedEvents.length === 0 || formData.storymap.slides.filter(slide => slide.type !== 'overview').length === 0) {
      setError(t('atLeastOneEvent'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 调用实际API，传递selectedEvents
      await updateStoryMap(storymapId!, formData, selectedEvents);
      
      // 成功后跳转到故事地图详情页
      router.push(`/storymap/${storymapId}`);
    } catch (err) {
      setError(t('createFailed', { error: err instanceof Error ? err.message : t('unknownError') }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">      
      {/* 头部导航 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">编辑故事地图</h1>
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
        // 全页面预览模式
        <div className="fixed inset-0 bg-white z-10 flex flex-col">
          {/* 故事地图内容 - 占据全部空间 */}
          <div className="absolute inset-0 overflow-hidden">
            {storymapInitFailed ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                {t('storymapInitFailed')}
                <button 
                  onClick={() => setStorymapInitFailed(false)}
                  className="ml-4 text-primary-600 hover:underline"
                >
                  {t('retry')}
                </button>
              </div>
            ) : (
              <StoryMapJS 
                data={formData}
                className="h-full"
              />
            )}
          </div>
          
          {/* 悬浮操作按钮 - 右下角固定位置 */}
          <div className="fixed bottom-6 right-6 z-20 flex flex-col space-y-4">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 bg-primary-600 text-white rounded-md shadow-lg hover:bg-primary-500 transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>⏳ {t('submitting')}</>
              ) : (
                <>✓ 保存修改</>
              )}
            </button>
            <button 
              onClick={handleBackToEdit}
              className="px-5 py-3 border border-gray-300 bg-white text-gray-700 rounded-md shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              ← {t('backToEdit')}
            </button>
          </div>
        </div>
      ) : (
        // 编辑模式 - 表单
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('storymapInfo')}</h2>
            
              {/* 故事地图标题 */}
            <div className="mb-6">
              <label htmlFor="storymap-title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('storymapTitle')}
              </label>
              <input
                type="text"
                id="storymap-title"
                value={formData.storymap.slides.find(slide => slide.type === 'overview')?.text.headline || ''}
                onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                placeholder={t('storymapTitlePlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
            </div>
            
            {/* 故事地图描述 */}
            <div className="mb-6">
              <label htmlFor="storymap-description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('storymapDescription')}
              </label>
              <textarea
                id="storymap-description"
                value={formData.storymap.slides.find(slide => slide.type === 'overview')?.text.text || ''}
                onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                placeholder={t('storymapDescriptionPlaceholder')}
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
              disabled={loading}
              className={`px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>⏳ {t('submitting')}</>
              ) : (
                <>✓ 保存修改</>
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