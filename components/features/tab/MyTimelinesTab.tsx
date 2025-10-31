'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// API响应中单个时间轴项的类型定义
interface TimelineResponseItem {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  eventCount: number;
  visibility: 'public' | 'private';
}

// API响应类型定义
interface TimelineApiResponse {
  timelines: TimelineResponseItem[];
  nextCursor: string | null;
}

// 格式化日期函数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const MyTimelinesTab: React.FC = () => {
  const t = useTranslations('MyTimelinesTab');
  const [timelines, setTimelines] = useState<TimelineResponseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // 获取时间轴数据的函数
  const fetchTimelines = async (cursor?: string, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params = new URLSearchParams();
      params.append('limit', '10');
      if (cursor) {
        params.append('cursor', cursor);
      }

      const response = await fetch(`/api/component/tab/timeline?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('获取时间轴数据失败');
      }

      const data: TimelineApiResponse = await response.json();

      if (isLoadMore) {
        setTimelines(prev => [...prev, ...data.timelines]);
      } else {
        setTimelines(data.timelines);
      }

      setHasNextPage(data.nextCursor !== null);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取时间轴数据时发生错误');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchTimelines();
  }, []);

  // 加载更多数据
  const handleLoadMore = () => {
    if (hasNextPage && nextCursor && !loadingMore) {
      fetchTimelines(nextCursor, true);
    }
  };

  // 创建新时间轴
  const handleCreateTimeline = () => {
    // 跳转到创建时间轴页面
    window.location.href = '/timeline/create';
  };

  // 渲染加载中状态
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="text-gray-600">{t('loading')}...</div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('error')}</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          onClick={() => fetchTimelines()}
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('myTimelinesTitle')}</h2>
        <button 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          onClick={handleCreateTimeline}
        >
          {t('createNewTimeline')}
        </button>
      </div>

      {timelines.length > 0 ? (
        <div>
          <div className="space-y-4">
            {timelines.map((timeline) => (
              <Link key={timeline.id} href={`/timeline/${timeline.id}`} className="block">
                <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                  <div 
                    className="h-32 bg-cover bg-center" 
                    style={{ 
                      backgroundImage: timeline.backgroundImageUrl 
                        ? `url(${timeline.backgroundImageUrl})` 
                        : `linear-gradient(to right, ${timeline.backgroundColor || '#4A5568'}, ${adjustColor(timeline.backgroundColor || '#4A5568', 20)})` 
                    }}
                  >
                    <div className="w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
                      <h3 className="text-white text-xl font-bold">{timeline.title || '未命名时间轴'}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 mb-4 line-clamp-2">{timeline.description || ''}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">
                          {t('updatedAt')}: {formatDate(timeline.updatedAt)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${timeline.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {t(`visibility.${timeline.visibility || 'private'}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 加载更多按钮 */}
          {hasNextPage && (
            <div className="mt-6 text-center">
              <button 
                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? t('loadingMore') : t('loadMore')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noTimelinesCreated')}</h3>
          <p className="text-gray-600 mb-4">{t('noTimelinesDescription')}</p>
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
            onClick={handleCreateTimeline}
          >
            {t('createFirstTimeline')}
          </button>
        </div>
      )}
    </div>
  );
};

// 辅助函数：调整颜色亮度
function adjustColor(color: string, amount: number): string {
  return '#' + color.substring(1).replace(/../g, color => 
    ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
  );
}

export default MyTimelinesTab;