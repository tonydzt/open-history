'use client';

import { useTranslations } from 'next-intl';

/**
 * 时间轴详情页加载状态
 */
export default function TimelineDetailLoading() {
  const t = useTranslations('TimelineDetailPage');


  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-8" />
      <h1 className="text-2xl font-semibold text-center">{t('loading') || 'Loading timeline details...'}</h1>
      <p className="text-gray-500 mt-4 text-center">{t('loadingMessage') || 'Please wait while we fetch the timeline data.'}</p>
    </div>
  );
}