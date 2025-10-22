'use client';
import { useTranslations } from 'next-intl';
import LoadingIndicator from '@/components/common/LoadingIndicator';

export default function EditTimelineLoading() {
  const t = useTranslations('EditTimelinePage');
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12">
        <LoadingIndicator buttonStyle={true} loadingText={t('loading')} />
      </div>
    </div>
  );
}