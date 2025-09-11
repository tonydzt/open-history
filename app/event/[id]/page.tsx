import { Event, Perspective } from '@/types';
import PerspectiveList from '@/components/PerspectiveList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

// 类型转换函数
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

const transformPerspective = (dbPerspective: any): Perspective => ({
  id: dbPerspective.id,
  content: dbPerspective.content,
  authorId: dbPerspective.userId,
  author: {
    id: dbPerspective.user.id,
    name: dbPerspective.user.name || '未知用户',
    email: dbPerspective.user.email || '',
    image: dbPerspective.user.image || ''
  },
  eventId: dbPerspective.eventId,
  createdAt: dbPerspective.createdAt.toISOString()
});

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const session = await getServerSession(authOptions);
  
  // 在服务器组件中直接从数据库获取数据
  let event: Event | null = null;
  let perspectives: Perspective[] = [];
  let error: string | null = null;
  
  try {
    // 获取事件详情
    const dbEvent = await db.event.findUnique({
      where: {
        id: id
      },
      include: {
        user: true
      }
    });
    
    if (!dbEvent) {
      error = '事件不存在';
    } else {
      // 转换为前端使用的类型
      event = transformEvent(dbEvent);
      
      // 获取该事件的所有视角
      const dbPerspectives = await db.perspective.findMany({
        where: {
          eventId: id
        },
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // 转换为前端使用的类型
      perspectives = dbPerspectives.map(transformPerspective);
    }
  } catch (err) {
    error = '获取事件详情失败，请稍后重试';
    console.error('Error fetching event:', err);
  }
  


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          <a href="/" className="btn-primary inline-block">
            返回首页
          </a>
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
            <a href="#" className="btn-secondary flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>分享</span>
            </a>
            <a href={`/event/${event.id}/perspective`} className="btn-primary">
              补充视角
            </a>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 line-clamp-2">{event.title}</h1>
        
        <div className="flex items-center space-x-3 mb-6">
          {event.author.image && (
            <img
              src={event.author.image.includes('googleusercontent.com') && event.author.image.includes('=s96-c') 
                ? event.author.image.replace('=s96-c', '') 
                : event.author.image}
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

      {/* 分享成功提示将在下一个版本中实现 */}
    </div>
  );
}
