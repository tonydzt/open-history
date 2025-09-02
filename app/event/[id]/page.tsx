'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Event, Perspective } from '@/types';
import { api } from '@/lib/api';
import PerspectiveList from '@/components/PerspectiveList';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [perspectives, setPerspectives] = useState<Perspective[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await api.getEvent(eventId);
        setEvent(data.event);
        setPerspectives(data.perspectives);
      } catch (err) {
        setError('获取事件详情失败，请稍后重试');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150 cursor-not-allowed">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-500 mb-4">{error || '事件不存在'}</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-600 text-white rounded-md">
              {event.sourceType}
            </span>
            <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="btn-secondary flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>分享</span>
            </button>
            <button
              onClick={() => router.push(`/event/${event.id}/perspective`)}
              className="btn-primary"
            >
              补充视角
            </button>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 line-clamp-2">{event.title}</h1>
        
        <div className="flex items-center space-x-3 mb-6">
          {event.author.image && (
            <img
              src={event.author.image}
              alt={event.author.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{event.author.name}</p>
            <p className="text-sm text-gray-500">发布于 {formatDate(event.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Event Images */}
      {event.images.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${event.title} - 图片 ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">事件描述</h2>
        <div className="prose max-w-none whitespace-pre-wrap">
            {event.description}
          </div>
      </div>

      {/* Event Tags */}
      {event.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">标签</h3>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Perspectives */}
      <div className="border-t border-gray-200 pt-8">
        <PerspectiveList perspectives={perspectives} />
      </div>

      {/* Share Success Toast */}
      {showShareSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          链接已复制到剪贴板
        </div>
      )}
    </div>
  );
}
