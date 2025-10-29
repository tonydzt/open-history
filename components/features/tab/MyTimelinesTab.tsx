'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// 定义兼容的Timeline类型
interface Timeline {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  background?: {
    color: string;
    image: string;
  };
  eventCount?: number;
  visibility?: 'public' | 'private';
}

// Mock数据
const mockTimelines: Timeline[] = [
  {
    id: '1',
    title: '2024年全球科技发展时间轴',
    description: '记录2024年全球范围内重要的科技突破和创新事件',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-15T14:30:00Z',
    userId: 'user1',
    background: {
      color: '#f3f4f6',
      image: 'https://example.com/timeline-bg1.jpg'
    },
    eventCount: 12,
    visibility: 'public'
  },
  {
    id: '2',
    title: '中国环保发展历程',
    description: '从改革开放到现在，中国环境保护政策和行动的演变',
    createdAt: '2024-04-20T09:00:00Z',
    updatedAt: '2024-04-28T16:20:00Z',
    userId: 'user1',
    background: {
      color: '#e0f2fe',
      image: 'https://example.com/timeline-bg2.jpg'
    },
    eventCount: 8,
    visibility: 'private'
  },
  {
    id: '3',
    title: '个人成长记录',
    description: '记录我在2024年的重要时刻和成长历程',
    createdAt: '2024-03-01T12:00:00Z',
    updatedAt: '2024-05-10T18:45:00Z',
    userId: 'user1',
    background: {
      color: '#fef3c7',
      image: ''
    },
    eventCount: 15,
    visibility: 'private'
  }
];

const MyTimelinesTab: React.FC = () => {
  const t = useTranslations('MyTimelinesTab');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('myTimelinesTitle')}</h2>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors">
          {t('createNewTimeline')}
        </button>
      </div>

      {mockTimelines.length > 0 ? (
        <div className="space-y-4">
          {mockTimelines.map((timeline) => (
            <Link key={timeline.id} href={`/timeline/${timeline.id}`} className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                <div 
                  className="h-32 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: timeline.background?.image 
                      ? `url(${timeline.background.image})` 
                      : `linear-gradient(to right, ${timeline.background?.color || '#4A5568'}, ${adjustColor(timeline.background?.color || '#4A5568', 20)})` 
                  }}
                >
                  <div className="w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold">{timeline.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4 line-clamp-2">{timeline.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {t('updatedAt')}: {formatDate(timeline.updatedAt)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t('eventCount')}: {timeline.eventCount}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${timeline.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {t(`visibility.${timeline.visibility}`)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noTimelinesCreated')}</h3>
          <p className="text-gray-600 mb-4">{t('noTimelinesDescription')}</p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors">
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