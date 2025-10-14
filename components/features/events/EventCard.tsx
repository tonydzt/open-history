import Link from 'next/link';
import { Event } from '@/db/types';
import { useTranslations } from 'next-intl';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const t = useTranslations('EventCard');
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 检查图片是否有效
  const isImageValid = event.images && event.images.length > 0 && event.images[0] && event.images[0].trim() !== '';

  return (
    <Link href={`/event/${event.id}`} className="block h-full">
      <div className="card overflow-hidden hover:scale-[1.02] transition-transform duration-200 h-full flex flex-col">
        {/* 固定高度的图片区域 */}
        <div className="relative h-48 overflow-hidden">
          {isImageValid ? (
            <img
              src={event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-600 text-white rounded-md">
              {t(`sourceTypes.${event.sourceType}`) || event.sourceType}
            </span>
          </div>
        </div>

        {/* 内容区域，使用flex布局确保卡片高度一致 */}
        <div className="p-6 pb-8 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 text-truncate-2">{truncateDescription(event.description)}</p>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 底部区域，使用margin-top:auto确保它总是在底部 */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-2">
              {event.author.image && (
                <img
                  src={event.author.image.includes('googleusercontent.com') && event.author.image.includes('=s96-c') 
                    ? event.author.image.replace('=s96-c', '') 
                    : event.author.image}
                  alt={event.author.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-sm text-gray-600">{event.author.name}</span>
            </div>
            <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
