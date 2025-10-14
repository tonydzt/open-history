import { Perspective } from '@/db/types';
import { useTranslations } from 'next-intl';

interface PerspectiveListProps {
  perspectives: Perspective[];
}

export default function PerspectiveList({ perspectives }: PerspectiveListProps) {
  const t = useTranslations('PerspectiveList');
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (perspectives.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-500">{t('noPerspectives')}</p>
        <p className="text-sm text-gray-400">{t('beTheFirst')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t('title')} ({perspectives.length})
      </h3>
      
      {perspectives.map((perspective) => (
        <div key={perspective.id} className="card p-6">
          <div className="flex items-start space-x-3">
            {perspective.author.image && (
              <img
                src={perspective.author.image.includes('googleusercontent.com') && perspective.author.image.includes('=s96-c') 
                  ? perspective.author.image.replace('=s96-c', '') 
                  : perspective.author.image}
                alt={perspective.author.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">{perspective.author.name}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{formatDate(perspective.createdAt)}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-truncate-2">{perspective.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
