'use client'

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import StoryMapJS from '@/components/features/storymap/storymapJS';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { StoryMapData } from '@/db/model/vo/Storymap';

export default function StoryMapDetailPage() {
  const router = useRouter();
  const t = useTranslations('StoryMapDetailPage');
  const params = useParams<{ id: string }>();
  const id = params?.id;;

  const [storymapData, setStorymapData] = useState<StoryMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storymapInitFailed, setStorymapInitFailed] = useState(false);

  // 获取故事地图数据
  useEffect(() => {
    const fetchStoryMapData = async () => {
      if (!id) {
        setError(t('invalidStorymapId'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // 调用API获取故事地图数据
        const response = await fetch(`/api/storymap?id=${id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || t('failedToFetchData'));
        }
        
        const responseData = await response.json();
        setStorymapData(responseData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('unknownError'));
        console.error('Error fetching storymap data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryMapData();
  }, [id]);

  // 编辑故事地图
  const handleEdit = () => {
    router.push(`/storymap/${id}/edit`);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <LoadingIndicator loadingText={t('loading')} />
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !storymapData) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t('error')}</h2>
          <p className="text-gray-600 mb-6">{error || t('storymapNotFound')}</p>
          <button
                onClick={() => router.back()}
                className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150"
              >
                {t('back')}
              </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 编辑按钮 - 固定在右上角 */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleEdit}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-500 transition-colors shadow-lg"
        >
          {t('edit')}
        </button>
      </div>

      {/* 故事地图展示 - 全页面 */}
      <div className="w-full h-screen">
          {storymapInitFailed ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              {t('storymapInitFailed')}
              <button 
                onClick={() => setStorymapInitFailed(false)}
                className="ml-4 text-primary-600 hover:underline"
              >
                {t('retry')}
              </button>
            </div>
          ) : (
            <StoryMapJS 
              data={storymapData}
              className="w-full h-full"
            />
          )}
        </div>
    </div>
  );
}