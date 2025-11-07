'use client'; // 必须在客户端渲染

import { useEffect, useRef, useState } from 'react';
import { StoryMapData } from '@/db/model/vo/Storymap';

interface StoryMapJSProps {
  data: StoryMapData;
  className?: string;
}

const StoryMapJS = ({ data, className = '' }: StoryMapJSProps) => {
  const storymapRef = useRef<any>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    // 加载 CSS 文件
    const loadCSS = (url: string) => {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve(void 0);
        link.onerror = (e) => reject(e);
        document.head.appendChild(link);
        return () => {
          document.head.removeChild(link);
        };
      });
    };

    // 加载 JS 文件
    const loadJS = (url: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => resolve(void 0);
        script.onerror = (e) => reject(e);
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      });
    };

    const initStoryMap = async () => {
      if (typeof window !== 'undefined') {
        try {
          // 加载本地的storymap CSS和JS文件
          await Promise.all([
            loadCSS('/storymap/storymap.css'),
            loadJS('/storymap/storymap-min.js')
          ]);

          console.log('StoryMap CSS and JS loaded successfully.');

          // 确保DOM渲染完成后再初始化
          if (storymapRef.current) {
            // @ts-ignore
            storymapRef.current = new (window as any).KLStoryMap.StoryMap(
              storymapRef.current,
              data
            );

            // 监听幻灯片变化事件
            if (storymapRef.current && storymapRef.current.on) {
              storymapRef.current.on('slidechange', function (e: any) {
                setActiveSlideIndex(e.slideIndex);
              });
            }
          }
        } catch (error) {
          console.error('Error loading StoryMap resources:', error);
        }
      }
    };

    initStoryMap();

    // 组件卸载时清理
    return () => {
      if (storymapRef.current) {
        // 清理StoryMap实例
        if (storymapRef.current && 'innerHTML' in storymapRef.current) {
          (storymapRef.current as HTMLElement).innerHTML = ''; // 清空 div 内容
        }
      }
    };
  }, [data]);

  // 切换到指定幻灯片
  const goToSlide = (index: number) => {
    if (storymapRef.current && storymapRef.current.goTo) {
      storymapRef.current.goTo(index);
      setActiveSlideIndex(index);
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row bg-white rounded-lg overflow-hidden shadow-md ${className}`}>
      {/* 左侧侧边栏 */}
      <div className="lg:w-1/4 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Slides
        </h3>
        <ul className="space-y-2">
          {data.storymap.slides.map((slide, index) => (
            <li key={index}>
              <button
                onClick={() => goToSlide(index)}
                className={`w-full text-left p-3 rounded-md transition-colors ${activeSlideIndex === index ? 'bg-primary-100 text-primary-600 border-l-4 border-primary-500' : 'hover:bg-gray-100 border-l-4 border-transparent'}`}
              >
                <div className="font-medium">{slide.text.headline}</div>
                <div className="text-xs text-gray-500 mt-1">{slide.date}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 右侧地图容器 */}
      <div className="lg:w-3/4">
        <div
          ref={storymapRef}
          id="storymap-container"
          className="w-full h-[600px]"
        />
      </div>
    </div>
  );
};

export default StoryMapJS;