import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { authOptions } from '@/lib/auth';
import TimelineJS from '@/components/features/timeline/TimelineJS';
import ShareComponent from '@/components/features/share/ShareComponent';
import { getCurrentPageUrl } from '@/utils/Webutils';
import { getTimelineById, formatTimelineData } from '@/db/access/timeline';
import { getTimelineEvents, extractEventIds, getEventsByIds } from '@/db/access/timelineEvent';

/**
 * 时间轴详情页
 * 展示特定ID的时间轴内容，使用TimelineJS组件渲染
 */
export default async function TimelineDetailPage({
  params
}: {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}) {
  // 异步获取params中的id和locale
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TimelineDetailPage' });

  // 构建分享URL
  const headerList = await headers();
  const pathname = `/${locale}/timeline/${id}`;
  const storyMapUrl = getCurrentPageUrl({ headers: headerList, pathname });

  try {
    // 获取当前用户会话信息
    const session = await getServerSession(authOptions);
    const user = session?.user;
    
    // 获取时间轴基本信息
    const timeline = await getTimelineById(id);
    
    if (!timeline) {
      notFound();
    }
    
    // 获取时间轴事件关联关系
    const timelineEventRelations = await getTimelineEvents(id);
    
    if (timelineEventRelations.length === 0) {
      notFound();
    }
    
    // 获取所有相关的事件ID
    const eventIds = extractEventIds(timelineEventRelations);
    
    // 获取所有事件信息
    const events = await getEventsByIds(eventIds);

    // 构建时间轴数据
    const timelineData = formatTimelineData(timeline, events);

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 时间轴标题和描述 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">{timeline.title}</h1>
              <div className="flex gap-3">
                {/* 编辑按钮 - 只有创建人才能看到 */}
                {user && timeline.userId === user.id && (
                  <a 
                    href={`/timeline/${id}/edit`} 
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
                  >
                    {t('edit')}
                  </a>
                )}
                {/* 添加事件按钮 - 只有创建人才能看到 */}
                {user && timeline.userId === user.id && (
                  <a 
                    href={`/create?timelineId=${id}`} 
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-green-500 transition-colors"
                  >
                    {t('addEvent')}
                  </a>
                )}
                {/* 分享按钮 */}
                <div suppressHydrationWarning>
                  <ShareComponent
                    storyMapUrl={storyMapUrl}
                    title={timeline.title}
                    description={timeline.description ?? undefined}
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{timeline.description}</p>
          </div>

          {/* 时间轴组件 */}
          <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <TimelineJS data={timelineData} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    notFound();
  }
}