'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Navbar } from '@/components';
import MyEventsTab from '@/components/features/tab/MyEventsTab';
import MyTimelinesTab from '@/components/features/tab/MyTimelinesTab';
import MyCollectionsTab from '@/components/features/tab/MyCollectionsTab';
import MyStoryMapsTab from '@/components/features/tab/MyStoryMapsTab';

// 创建一个缓存容器，用于存储tab组件的状态
interface TabCache {
  events: boolean;
  timelines: boolean;
  collections: boolean;
  storyMaps: boolean;
}

// 使用React.memo包装的Tab组件，避免不必要的重新渲染
const CachedEventsTab = React.memo(() => {
  return <MyEventsTab />;
});

const CachedTimelinesTab = React.memo(() => {
  return <MyTimelinesTab />;
});

const CachedCollectionsTab = React.memo(() => {
  return <MyCollectionsTab />;
});

const CachedStoryMapsTab = React.memo(() => {
  return <MyStoryMapsTab />;
});

// 为了在开发环境中更好地调试
CachedEventsTab.displayName = 'CachedEventsTab';
CachedTimelinesTab.displayName = 'CachedTimelinesTab';
CachedCollectionsTab.displayName = 'CachedCollectionsTab';
CachedStoryMapsTab.displayName = 'CachedStoryMapsTab';

export default function MyProfilePage() {
  const t = useTranslations('MyPage');
  const [activeTab, setActiveTab] = useState<'events' | 'timelines' | 'collections' | 'storyMaps'>('events');
  // 使用状态来跟踪哪些tab已经被渲染过
  const [tabCache, setTabCache] = useState<TabCache>({
    events: false,
    timelines: false,
    collections: false,
    storyMaps: false
  });

  // 初始化页面时，加载默认的events tab
  useEffect(() => {
    setTabCache(prev => ({ ...prev, events: true }));
  }, []);

  // 处理tab切换
  const handleTabChange = (tab: 'events' | 'timelines' | 'collections' | 'storyMaps') => {
    setActiveTab(tab);
    // 当切换到一个新的tab时，将其添加到缓存中
    if (!tabCache[tab]) {
      setTabCache(prev => ({ ...prev, [tab]: true }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pageTitle')}</h1>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => handleTabChange('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'events' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {t('tabEvents')}
            </button>
            <button
              onClick={() => handleTabChange('timelines')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'timelines' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {t('tabTimelines')}
            </button>
            <button
              onClick={() => handleTabChange('storyMaps')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'storyMaps' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {t('tabStoryMaps')}
            </button>
            <button
              onClick={() => handleTabChange('collections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'collections' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {t('tabCollections')}
            </button>
          </nav>
        </div>

        {/* Tab Content - 使用绝对定位和条件渲染来确保组件只在首次加载时初始化 */}
        <div className="mt-6 relative min-h-[500px]">
          {/* 始终渲染已经缓存的tab，但只显示当前活跃的tab */}
          {tabCache.events && (
            <div
              className={`absolute inset-0 ${activeTab === 'events' ? 'block' : 'hidden'}`}
            >
              <CachedEventsTab />
            </div>
          )}
          
          {tabCache.timelines && (
            <div
              className={`absolute inset-0 ${activeTab === 'timelines' ? 'block' : 'hidden'}`}
            >
              <CachedTimelinesTab />
            </div>
          )}
                    
          {tabCache.storyMaps && (
            <div
              className={`absolute inset-0 ${activeTab === 'storyMaps' ? 'block' : 'hidden'}`}
            >
              <CachedStoryMapsTab />
            </div>
          )}
          
          {tabCache.collections && (
            <div
              className={`absolute inset-0 ${activeTab === 'collections' ? 'block' : 'hidden'}`}
            >
              <CachedCollectionsTab />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}