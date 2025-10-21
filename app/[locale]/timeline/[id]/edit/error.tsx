'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function EditTimelineError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  const t = useTranslations();
  const router = useRouter();
  
  useEffect(() => {
    // 记录错误信息
    console.error('Edit timeline error:', error);
  }, [error]);
  
  // 5秒后自动尝试重置
  useEffect(() => {
    const timer = setTimeout(() => {
      reset();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [reset]);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-4">{t('somethingWentWrong')}</h2>
        <p className="text-red-700 mb-6">{t('errorMessage')}</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t('tryAgain')}
          </button>
          
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          >
            {t('goBack')}
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {t('goHome')}
          </button>
        </div>
      </div>
    </div>
  );
}