'use client';

import { useEffect, useState } from 'react';

// Alert 组件的类型定义
export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  show: boolean;
  duration?: number; // 自动关闭时间（毫秒），0 表示不自动关闭
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  show,
  duration = 0,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(show);

  // 更新可见性状态
  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  // 自动关闭定时器
  useEffect(() => {
    if (isVisible && duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // 如果不可见，不渲染组件
  if (!isVisible) return null;

  // 根据类型获取不同的样式
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
        };
      case 'error':
        return {
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
        };
      case 'info':
        return {
          iconColor: 'text-primary-500',
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200',
          textColor: 'text-primary-800',
        };
      default:
        return {
          iconColor: 'text-primary-500',
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200',
          textColor: 'text-primary-800',
        };
    }
  };

  // 根据类型获取图标
  const getIcon = () => {
    const { iconColor } = getTypeStyles();
    switch (type) {
      case 'success':
        return (
          <svg
            className={`w-5 h-5 ${iconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            className={`w-5 h-5 ${iconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className={`w-5 h-5 ${iconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            className={`w-5 h-5 ${iconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const { bgColor, borderColor, textColor } = getTypeStyles();

  return (
    <div
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md
        ${bgColor} ${borderColor} border-l-4 rounded-lg shadow-lg overflow-hidden
        animate-in fade-in slide-in-from-top-5 duration-300
        ${className}
      `}
      role="alert"
    >
      <div className="p-4 flex items-start space-x-3">
        {/* 图标 */}
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          {/* 标题 */}
          {title && (
            <h3 className={`font-medium ${textColor} mb-1`}>{title}</h3>
          )}
          {/* 消息 */}
          <p className={`text-sm ${textColor} whitespace-pre-line`}>{message}</p>
        </div>

        {/* 关闭按钮 */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="关闭"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;