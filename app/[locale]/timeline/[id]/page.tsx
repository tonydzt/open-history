import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import TimelineJS from '@/components/features/timeline/TimelineJS';
import { Timeline } from '@/db/model/vo/Timeline';
import prisma from '@/lib/db';

/**
 * 时间轴详情页
 * 展示特定ID的时间轴内容，使用TimelineJS组件渲染
 */
export default async function TimelineDetailPage({
  params
}: {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}) {
  // 异步获取params中的id
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TimelineDetailPage' });

  try {
    // 获取时间轴基本信息
    const timeline = await prisma.timeline.findUnique({
      where: { id }
    });
    
    if (!timeline) {
      notFound();
    }
    
    // 获取时间轴事件关联关系
    const timelineEventRelations = await prisma.timelineEvent.findMany({
      where: { timelineId: id },
      select: { eventId: true }
    });
    
    if (timelineEventRelations.length === 0) {
      notFound();
    }
    
    // 获取所有相关的事件ID
    const eventIds = timelineEventRelations.map(rel => rel.eventId);
    
    // 获取所有事件信息
    const events = await prisma.event.findMany({
      where: { id: { in: eventIds } }
    });

    // 根据Timeline接口正确构建时间轴数据
    const timelineData: Timeline = {
      title: {
        text: {
          headline: timeline.title,
          text: timeline.description || ''
        }
      },
      events: events.map(event => {
        const eventDate = new Date(event.date);
        
        return {
          start_date: {
            year: eventDate.getFullYear(),
            month: eventDate.getMonth() + 1,
            day: eventDate.getDate()
          },
          // Event模型中没有endDate属性，使用相同的日期作为结束日期
          end_date: {
            year: eventDate.getFullYear(),
            month: eventDate.getMonth() + 1,
            day: eventDate.getDate()
          },
          text: {
            headline: event.title,
            text: event.description || ''
          },
          media: event.imageUrl
            ? {
                url: event.imageUrl,
                thumbnail: event.imageUrl,
                caption: '',
                credit: ''
              }
            : undefined,
          // 使用tags作为group，如果有多个标签则使用第一个
          group: event.tags && event.tags.length > 0 ? event.tags[0] : ''
        };
      }),
      scale: 'human' as const,
      // 根据Background类型定义，只包含url属性
      background: timeline.backgroundImageUrl
        ? {
            url: timeline.backgroundImageUrl
          }
        : undefined
    };

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 时间轴标题和描述 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{timeline.title}</h1>
            <p className="text-gray-600 mb-4">{timeline.description}</p>
            
            {/* 时间轴信息 */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>{t('scale_human')}</span>
              <span>•</span>
              <span>{t(`eventCount`, { count: events.length })}</span>
            </div>
          </div>

          {/* 时间轴组件 */}
          <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <TimelineJS data={timelineData} />
          </div>

          {/* 时间轴创建信息 */}
          <div className="text-sm text-gray-500">
            <p>{t('createdBy', { name: timeline.authorId || 'Unknown' })}</p>
            <p>{t('createdAt', { date: new Date(timeline.createdAt).toLocaleDateString() })}</p>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    notFound();
  }
}