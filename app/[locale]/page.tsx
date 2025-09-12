import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import db from '@/lib/db';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// 类型转换函数：将数据库模型转换为前端使用的类型
const transformEvent = (dbEvent: any): Event => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  timestamp: dbEvent.date.toISOString(),
  sourceType: 'news', // 默认类型
  images: [dbEvent.imageUrl],
  tags: dbEvent.tags || [],
  authorId: dbEvent.userId,
  author: {
    id: dbEvent.user.id,
    name: dbEvent.user.name || '未知用户',
    email: dbEvent.user.email || '',
    image: dbEvent.user.image || ''
  },
  createdAt: dbEvent.createdAt.toISOString(),
  updatedAt: dbEvent.updatedAt.toISOString()
});


export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations('HomePage');

  // 在服务器组件中直接从数据库获取事件数据
  const events = await db.event.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 转换为前端使用的类型
  const transformedEvents = events.map(transformEvent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {t('subtitle')}
        </p>
      </div>

      {/* Events Grid */}
      {transformedEvents.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transformedEvents.map((event: Event) => (
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noEventsTitle')}</h3>
          <p className="text-gray-500 mb-6">{t('noEventsDescription')}</p>
          {session && (
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl hover:bg-primary-700 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('createFirstEventButton')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
