// components/Timeline.jsx
'use client'; // 必须在客户端渲染

import { useEffect, useRef } from 'react';

// 动态导入，避免服务端渲染
const TimelineComponent = ({ data }: { data: any }) => {
  const timelineRef = useRef(null);
  const timeline = useRef(null);

  useEffect(() => {
    // 在客户端动态导入
    const initTimeline = async () => {
      if (typeof window !== 'undefined') {
        // 动态导入TimelineJS
        const TimelineJS = await import('@knight-lab/timelinejs') as any;
        const { TL } = TimelineJS;
        
        // 清理已有实例
        if (timeline.current) {
          (timeline.current as any).destroy();
        }

        // 初始化时间轴
        timeline.current = new TL.Timeline(timelineRef.current, data, {
          scale: 'human', // 或 'cosmological'
          language: 'zh' // 支持中文
        });
      }
    };

    initTimeline();

    // 组件卸载时清理
    return () => {
      if (timeline.current) {
        (timeline.current as any).destroy();
      }
    };
  }, [data]); // 数据变化时重新初始化

  return (
    <div>
      <div ref={timelineRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default TimelineComponent;