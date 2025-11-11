'use client'; // 必须在客户端渲染

import { useEffect, useRef, useState } from 'react';
import { StoryMapData } from '@/db/model/vo/Storymap';

interface StoryMapJSProps {
  data: StoryMapData;
  className?: string;
}

const StoryMapJS = ({ data, className = '' }: StoryMapJSProps) => {
  const storymapRef = useRef<any>(null);
  const storymapInstanceRef = useRef<any>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState<string>('25%'); // 默认25%宽度（对应1/4）
  const [isDragging, setIsDragging] = useState(false);

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
            // 先清空容器内容，避免重复渲染
            storymapRef.current.innerHTML = '';
            
            // @ts-ignore
            storymapInstanceRef.current = new (window as any).KLStoryMap.StoryMap(
              storymapRef.current,
              data
            );

            // 监听幻灯片变化事件
            if (storymapInstanceRef.current && storymapInstanceRef.current.on) {
              storymapInstanceRef.current.on('slidechange', function (e: any) {
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
      // 清理事件监听器
      if (storymapInstanceRef.current && storymapInstanceRef.current.off) {
        storymapInstanceRef.current.off('slidechange');
      }
      
      // 清空容器内容
      if (storymapRef.current && 'innerHTML' in storymapRef.current) {
        (storymapRef.current as HTMLElement).innerHTML = '';
      }
      
      // 重置实例引用
      storymapInstanceRef.current = null;
    };
  }, [data]);

  // 切换到指定幻灯片
  const goToSlide = (index: number) => {
    if (storymapInstanceRef.current && storymapInstanceRef.current.goTo) {
      storymapInstanceRef.current.goTo(index);
      setActiveSlideIndex(index);
    }
  };

  // 切换侧边栏显示状态
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // 处理拖拽过程
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sidebarVisible) return;
      
      // 获取父容器宽度
      const container = storymapRef.current?.parentElement?.parentElement;
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      // 计算侧边栏宽度占比
      let newWidthPercent = (e.clientX / containerWidth) * 100;
      
      // 设置最小宽度（20%）和最大宽度（50%）限制
      newWidthPercent = Math.max(20, Math.min(50, newWidthPercent));
      
      setSidebarWidth(`${newWidthPercent}%`);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    // 只有在拖拽状态下才添加事件监听器
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    // 清理事件监听器
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, sidebarVisible]);

  return (
    <div className={`relative flex flex-col lg:flex-row bg-white rounded-lg overflow-hidden shadow-md ${className}`} style={{ cursor: isDragging ? 'col-resize' : 'default' }}>
      {/* 左侧侧边栏 */}
      <div 
        className={`bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto transition-all duration-300 ${sidebarVisible ? 'block' : 'hidden lg:w-0'}`}
        style={{ width: sidebarVisible ? sidebarWidth : '0' }}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
            aria-label="Hide sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
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

      {/* 可拖拽分隔线 */}
      {sidebarVisible && (
        <div 
          className="w-1 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors flex items-center justify-center"
          onMouseDown={handleDragStart}
          aria-label="Resize sidebar"
        >
          <div className="w-0.5 h-8 bg-gray-400 rounded-full"></div>
        </div>
      )}
      
      {/* 显示侧边栏按钮 - 当侧边栏隐藏时显示在地图区域 */}
      {!sidebarVisible && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-10 p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-50"
          aria-label="Show sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {/* 右侧地图容器 */}
      <div className={`flex-1 w-full transition-all duration-300`}>
        <div
          ref={storymapRef}
          id="storymap-container"
          className="w-full h-full min-h-[600px]"
        />
      </div>
    </div>
  );
};

export default StoryMapJS;