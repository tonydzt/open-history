import { Event, GeoLocation } from '@/db/model/vo/Event';
import { Perspective } from '@/db/model/vo/Perspective';
import 'leaflet/dist/leaflet.css';
import PerspectiveList from '@/components/features/events/PerspectiveList';
import StaticMapWrapper from '@/components/features/map/StaticMapWrapper';
import EventActionsMenu from '@/components/features/events/EventActionsMenu';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

// 类型转换函数
const transformEvent = (dbEvent: any): Event => {
  let geom: GeoLocation | undefined = undefined;
  // 尝试从geom字段解析地理位置信息
  if (dbEvent.geom) {
    try {
      // 如果geom是对象格式
      if (typeof dbEvent.geom === 'object') {
        if (dbEvent.geom.coordinates) {
          geom = {
            lat: dbEvent.geom.coordinates[1],
            lng: dbEvent.geom.coordinates[0]
          };
        } else if (dbEvent.geom.lng !== undefined && dbEvent.geom.lat !== undefined) {
          geom = {
            lat: parseFloat(dbEvent.geom.lat),
            lng: parseFloat(dbEvent.geom.lng)
          };
        }
      }
      // 如果geom是字符串格式
      else if (typeof dbEvent.geom === 'string') {
        try {
          // 尝试解析JSON格式
          const pointData = JSON.parse(dbEvent.geom);
          if (pointData.lng !== undefined && pointData.lat !== undefined) {
            geom = {
              lat: parseFloat(pointData.lat),
              lng: parseFloat(pointData.lng)
            };
          } else if (pointData.coordinates && Array.isArray(pointData.coordinates)) {
            geom = {
              lat: parseFloat(pointData.coordinates[1]),
              lng: parseFloat(pointData.coordinates[0])
            };
          }
        } catch (jsonError) {
          // JSON解析失败，尝试解析空间数据格式
          if (dbEvent.geom.includes('SRID=') || dbEvent.geom.startsWith('POINT')) {
            const match = dbEvent.geom.match(/POINT\(([^ ]+) ([^)]+)\)/);
            if (match && match.length === 3) {
              geom = {
                lat: parseFloat(match[2]),
                lng: parseFloat(match[1])
              };
            }
          }
        }
      }
    } catch (error) {
      console.error('解析地理位置失败:', error);
    }
  }

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    timestamp: dbEvent.date.toISOString(),
    sourceType: 'news', // 默认类型
    images: [dbEvent.imageUrl],
    tags: dbEvent.tags || [],
    userId: dbEvent.userId,
    author: {
      id: dbEvent.user.id,
      name: dbEvent.user.name || '未知用户',
      email: dbEvent.user.email || '',
      image: dbEvent.user.image || ''
    },
    geom: geom,
    createdAt: dbEvent.createdAt.toISOString(),
    updatedAt: dbEvent.updatedAt.toISOString()
  };
};

const transformPerspective = (dbPerspective: any): Perspective => ({
  id: dbPerspective.id,
  content: dbPerspective.content,
  userId: dbPerspective.userId,
  author: {
    id: dbPerspective.user.id,
    name: dbPerspective.user.name || '未知用户',
    email: dbPerspective.user.email || '',
    image: dbPerspective.user.image || ''
  },
  eventId: dbPerspective.eventId,
  createdAt: dbPerspective.createdAt.toISOString()
});

// tongbug修改: nextJS 15的参数需要是{ params }: { params: Promise<{ id: string }> }这种带Promise格式的！
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const session = await getServerSession(authOptions);
  const t = await getTranslations('EventDetailPage');
  
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
      // 由于geom字段是Unsupported类型，我们需要使用原始SQL查询来获取它
      const geomResult = (await db.$queryRaw`
        SELECT ST_AsText(geom) as geom FROM "Event" WHERE id = ${id}
      `) as any[];
      
      // 将geom数据添加到dbEvent中
      if (geomResult && geomResult.length > 0 && geomResult[0].geom) {
        // 使用类型断言
        (dbEvent as any).geom = geomResult[0].geom;
      }
      
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('loadingFailed')}</h3>
          <p className="text-gray-500 mb-4">{error || t('eventNotFound')}</p>
          <a href="/" className="btn-primary inline-block">
            {t('backToHome')}
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
          <EventActionsMenu 
            eventId={event.id} 
            isAuthor={session?.user?.id === event.userId} 
            shareButtonText={t('shareButton')}
            addPerspectiveButtonText={t('addPerspectiveButton')}
            editButtonText={t('editButton')}
            deleteEventButtonText={t('deleteEventButton')}
            actionsMenuText={t('actionsMenu') || 'Actions'}
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 line-clamp-2">{event.title}</h1>
        
        <div className="flex items-center space-x-3 mb-6">
          {event.author.image && (
            <Image
              src={event.author.image.includes('googleusercontent.com') && event.author.image.includes('=s96-c') 
                ? event.author.image.replace('=s96-c', '') 
                : event.author.image}
              alt={event.author.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{event.author.name}</p>
            <p className="text-sm text-gray-500">{t('publishedAt')} {formatDate(event.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Event Images */}
      {event.images.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.images.map((image, index) => (
              <div key={index} className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${event.title} - 图片 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('eventDescription')}</h2>
        <div className="prose max-w-none whitespace-pre-wrap">
            {event.description}
          </div>
      </div>
      {/* 显示地理位置信息 */}
      {event.geom && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{t('location')}</h3>
          <div className="relative h-64 w-full rounded-md border-2 border-gray-300 overflow-hidden">
            <StaticMapWrapper coordinates={event.geom} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {event.geom.lat.toFixed(6)}, {event.geom.lng.toFixed(6)}
          </p>
        </div>
      )}

      {/* Event Tags */}
      {event.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('tags')}</h3>
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

      {/* 删除功能已整合到EventActionsMenu组件中 */}

      {/* 分享成功提示将在下一个版本中实现 */}
    </div>
  );
}
