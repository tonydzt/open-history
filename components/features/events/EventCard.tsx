"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Event } from '@/db/model/vo/Event';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import CollectionDialog from '@/components/features/collection/CollectionDialog';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const t = useTranslations('EventCard');
  const { data: session } = useSession();
  const user = session?.user;
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [collected, setCollected] = useState(false);

  const handleOpenCollectionDialog = () => {
    if (user) {
      setShowCollectionDialog(true);
    }
  };

  const handleCollectionSuccess = () => {
    setCollected(true);
  };
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
    <>
      <Link href={`/event/${event.id}`} className="block h-full">
        <div className="card overflow-hidden hover:scale-[1.02] transition-transform duration-200 h-full flex flex-col">
          {/* 固定高度的图片区域 */}
          <div className="relative h-48 overflow-hidden">
            {isImageValid ? (
              <Image
                src={event.images[0]}
                alt={event.title}
                fill
                objectFit="contain"
                className="object-contain"
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
                  <Image
                  src={event.author.image.includes('googleusercontent.com') && event.author.image.includes('=s96-c') 
                    ? event.author.image.replace('=s96-c', '') 
                    : event.author.image}
                  alt={event.author.name}
                  width={24}
                  height={24}
                  objectFit="contain"
                  className="rounded-full"
                />
                )}
                <span className="text-sm text-gray-600">{event.author.name}</span>
              </div>
              
              <button
                type="button"
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${collected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpenCollectionDialog();
                }}
                title={collected ? t('collected') : t('collect')}
              >
                <svg className="w-4 h-4" fill={collected ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
              
              <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* 收藏对话框 */}
      {user && (
        <CollectionDialog
          isOpen={showCollectionDialog}
          onClose={() => setShowCollectionDialog(false)}
          eventId={event.id}
          userId={user.id}
          onSuccess={handleCollectionSuccess}
        />
      )}
    </>
  )}
