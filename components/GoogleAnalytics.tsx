'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 扩展Window接口，添加gtag函数和dataLayer数组类型
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GoogleAnalytics = () => {
  const pathname = usePathname();
  const measurementId = process.env.GA_MEASUREMENT_ID;

  // 检查是否有测量ID，没有则不加载Google Analytics
  if (!measurementId) {
    return null;
  }

  // 初始化Google Analytics脚本
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      // 创建并插入Google Analytics脚本
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      // 初始化dataLayer和gtag函数
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        if (window.dataLayer) {
          window.dataLayer.push(arguments);
        }
      };
      if (window.dataLayer && window.gtag) {
          window.gtag('js', new Date());
          window.gtag('config', measurementId);
        }

      // 清理函数
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        // 注意：这里不删除dataLayer和gtag，因为可能有其他部分在使用它们
      };
    }
  }, [measurementId]);

  // 监听页面变化，发送页面浏览事件
  useEffect(() => {
    if (pathname && typeof window !== 'undefined' && window.dataLayer && typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: pathname,
      });
    }
  }, [pathname, measurementId]);

  return null;
};

export default GoogleAnalytics;