'use client';

import { useEffect, useRef } from 'react';

interface ConfirmProps {
  show: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  cancelVariant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

const Confirm: React.FC<ConfirmProps> = ({
  show,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  cancelVariant = 'secondary',
  className = '',
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // 当组件显示时，将焦点设置到确认按钮上
  useEffect(() => {
    if (show && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [show]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;

      // ESC 键关闭确认框
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
      // Enter 键触发确认
      if (e.key === 'Enter') {
        onConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onConfirm, onCancel]);

  // 如果不显示，不渲染组件
  if (!show) return null;

  // 根据变体获取按钮样式
  const getButtonStyles = (variant: 'primary' | 'secondary' | 'danger') => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 text-white hover:bg-primary-700 focus:bg-primary-700';
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:bg-gray-200';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:bg-red-700';
      default:
        return 'bg-primary-600 text-white hover:bg-primary-700 focus:bg-primary-700';
    }
  };

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-in fade-in duration-300
        ${className}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="
          bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden
          animate-in fade-in slide-in-from-bottom-5 duration-300
        "
      >
        {/* 标题 */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 id="confirm-title" className="text-lg font-medium text-gray-900">
              {title}
            </h3>
          </div>
        )}

        {/* 消息内容 */}
        <div className="px-6 py-5">
          <p className="text-gray-700 whitespace-pre-line">{message}</p>
        </div>

        {/* 按钮区域 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          {/* 取消按钮 */}
          {onCancel && (
            <button
              onClick={onCancel}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                ${getButtonStyles(cancelVariant)}
              `}
              aria-label="取消"
            >
              {cancelText}
            </button>
          )}

          {/* 确认按钮 */}
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
              ${getButtonStyles(confirmVariant)}
            `}
            aria-label="确认"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
