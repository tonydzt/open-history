'use client';

import { useTranslations } from 'next-intl';

interface LoadingIndicatorProps {
  // 自定义加载文本，可选
  loadingText?: string;
  // 是否显示在按钮样式中，可选
  buttonStyle?: boolean;
  // 额外的CSS类名，可选
  className?: string;
}

/**
 * 通用加载指示器组件
 * 用于显示应用程序中的加载状态
 */
export default function LoadingIndicator({
  loadingText,
  buttonStyle = false,
  className = ''
}: LoadingIndicatorProps) {
  const t = useTranslations('LoadingPage');
  const displayText = loadingText || t('loadingText');

  // 根据是否为按钮样式选择不同的容器样式
  const containerClass = buttonStyle
    ? `inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150 cursor-not-allowed ${className}`
    : `flex justify-center items-center space-x-2 ${className}`;

  // 根据是否为按钮样式选择不同的图标样式
  const iconClass = buttonStyle
    ? 'animate-spin -ml-1 mr-3 h-5 w-5 text-white'
    : 'animate-spin h-10 w-10 border-t-2 border-b-2 border-primary-500';

  return (
    <div className={containerClass}>
      <svg 
        className={iconClass}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{displayText}</span>
    </div>
  );
}