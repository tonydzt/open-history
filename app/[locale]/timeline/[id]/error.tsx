'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

/**
 * 时间轴详情页错误边界组件
 */
export default function TimelineDetailError({ error, reset }: ErrorProps) {
  const t = useTranslations('TimelineDetailPage');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale || 'en';

  useEffect(() => {
    // 记录错误
    console.error('Timeline detail page error:', error);

    // 5秒后自动尝试重置
    const timer = setTimeout(() => {
      reset();
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, reset]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t('error.title') || 'Something went wrong'}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('error.message') || 'We encountered an error while loading the timeline details. Please try again later.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('error.tryAgain') || 'Try Again'}
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              {t('error.goBack') || 'Go Back'}
            </button>
            <button
              onClick={() => router.push(`/${locale}`)}
              className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              {t('error.goHome') || 'Go Home'}
            </button>
          </div>
        </div>
      </div>
  );
}