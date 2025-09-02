import Link from 'next/link';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link href={`/event/${event.id}`} className="block">
      <div className="card overflow-hidden hover:scale-[1.02] transition-transform duration-200">
        {/* Image */}
        {event.images.length > 0 && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-600 text-white rounded-md">
                {event.sourceType}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 pb-8">
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

          {/* Footer */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              {event.author.image && (
                <img
                  src={event.author.image}
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
