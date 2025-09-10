'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Event } from '@/types';
import { api } from '@/lib/api';
import EventCard from '@/components/EventCard';

export default function HomePage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        // 错误会被error.tsx捕获
        throw err;
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到 Chronicle
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          记录事件，分享视角，构建完整的历史图景。在这里，每个故事都有多个角度，每个视角都值得被倾听。
        </p>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有事件</h3>
          <p className="text-gray-500 mb-6">成为第一个创建事件的人</p>
          {session && (
            <Link 
              href="/create" 
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl hover:bg-primary-700 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建第一个事件
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
