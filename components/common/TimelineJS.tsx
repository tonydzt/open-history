'use client'; // 必须在客户端渲染

import { Timeline } from '@/types/timeline-type';
import { useEffect, useRef } from 'react';

// 动态导入，避免服务端渲染
const TimelineComponent = ({ data }: { data: Timeline }) => {

  const timelineRef = useRef(null);

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
      });
    };

    const initTimeline = async () => {
      if (typeof window !== 'undefined') {

        try {
          await Promise.all([
            loadCSS('/timelinejs/timeline.css'),
            loadJS('/timelinejs/timeline-min.js')
          ]);
          console.log('CSS and JS loaded successfully.');

          // tongbug修改：这里的 TL 是全局对象，确保在DOM渲染完成后才能初始化，否则会报一些错误
          // 这里通过判断timelineRef.current非空，来确保DOM渲染完成
          if (timelineRef.current) {
            // 初始化时间轴
            var options = {
              hash_bookmark: false,
              initial_zoom: 5
            }
            
            // tongbug修改：这里的TL是本地原生JS库/timelinejs/timeline-min.js里引入的，无法通过TypeScript 的类型检查，但是能正常使用。所以这里通过@ts-ignore忽略这个检查
            // 这里@ts-ignore 只会忽略紧跟在它下面的那一行的 TypeScript 检查
            // @ts-ignore
            timelineRef.current = new TL.Timeline(timelineRef.current, data, options);
          }
        } catch (error) {
          console.error('Error loading external resources', error);
        }
      }
    };

    initTimeline();

    // 组件卸载时清理
    return () => {
      if (timelineRef.current) {
        // 清理，防止组件卸载后数据泄漏
        if (timelineRef.current && 'innerHTML' in timelineRef.current) {
          (timelineRef.current as HTMLElement).innerHTML = ''; // 清空 div 内容
        }
      }
    };
  }, [data]);

  return (
    <div>
      <div ref={timelineRef} id="timeline-container" style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default TimelineComponent;