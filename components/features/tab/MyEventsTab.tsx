'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { EventCard } from '@/components';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { Event } from '@/db/model/vo/Event';

interface EventsResponse {
  events: Event[];
  hasMore: boolean;
}

const MyEventsTab: React.FC = () => {
  const t = useTranslations('MyEventsTab');
  const router = useRouter();
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // 获取事件列表的函数
  const fetchEvents = async (isLoadMore = false) => {
    if (!session?.user?.id) {
      setError('用户未登录');
      setLoading(false);
      return;
    }

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        userId: session.user.id,
        pageSize: '10'
      });

      if (cursor) {
        params.append('cursor', cursor);
      }

      const response = await fetch(`/api/component/tab/event?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data: EventsResponse = await response.json();
      
      if (isLoadMore) {
        setEvents(prev => [...prev, ...data.events]);
      } else {
        setEvents(data.events);
      }
      
      setHasMore(data.hasMore);
      // 更新cursor为最后一个事件的id
      if (data.events.length > 0) {
        setCursor(data.events[data.events.length - 1].id);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取事件列表失败');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchEvents();
  }, [session?.user?.id]);

  // 设置无限滚动
  useEffect(() => {
    if (!loadingRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore) {
          fetchEvents(true);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadingRef.current);

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, loadingMore, cursor]);

  // 处理重试
  const handleRetry = () => {
    fetchEvents();
  };

  if (loading || status === 'loading') {
    return (
      <div className="p-8 text-center">
        <LoadingIndicator loadingText={t('loadingEvents')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('errorTitle')}</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          onClick={handleRetry}
        >
          {t('retryButton')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('myEventsTitle')}</h2>
        <button 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          onClick={() => router.push('/create')}
        >
          {t('createNewEvent')}
        </button>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {loadingMore && (
            <div className="col-span-full py-4 text-center">
              <LoadingIndicator loadingText={t('loadingMore')} className="text-sm" />
            </div>
          )}
          <div ref={loadingRef} style={{ height: '20px' }} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noEventsCreated')}</h3>
          <p className="text-gray-600 mb-4">{t('noEventsDescription')}</p>
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
            onClick={() => router.push('/create')}
          >
            {t('createFirstEvent')}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyEventsTab;