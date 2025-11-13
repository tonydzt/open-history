'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StoryMapCard } from '@/db/model/vo/Storymap';

const MyStoryMapsTab: React.FC = () => {
  const t = useTranslations('MyStoryMapsTab');
  const router = useRouter();
  const [storyMaps, setStoryMaps] = useState<StoryMapCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStoryMaps = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/component/tab/storymap');
        
        if (!response.ok) {
          throw new Error('Failed to fetch story maps');
        }
        
        const data = await response.json();
        setStoryMaps(data.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        console.error('Error fetching story maps:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoryMaps();
  }, []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('loadingStoryMaps')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('errorLoadingStoryMaps')}</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          onClick={() => window.location.reload()}
        >
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('myStoryMapsTitle')}</h2>
        <button 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          onClick={() => router.push('/storymap/create')}
        >
          {t('createNewStoryMap')}
        </button>
      </div>

      {storyMaps.length > 0 ? (
        <div className="space-y-4">
          {storyMaps.map((storyMap) => (
            <Link key={storyMap.id} href={`/storymap/${storyMap.id}`} className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{storyMap.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{storyMap.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{t('updatedAt')}: {formatDate(storyMap.updatedAt)}</span>
                  <span>{t('eventCount')}: {storyMap.eventCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noStoryMapsCreated')}</h3>
          <p className="text-gray-600 mb-4">{t('noStoryMapsDescription')}</p>
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
            onClick={() => router.push('/storymap/create')}
          >
            {t('createFirstStoryMap')}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyStoryMapsTab;