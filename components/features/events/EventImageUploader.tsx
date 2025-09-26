'use client';

import { useState } from 'react';
import { type PutBlobResult } from '@vercel/blob';
import ImageUploader from '@/components/common/ImageUploader';
import { useTranslations } from 'next-intl';

interface EventImageUploaderProps {
  // 当前的图片URL
  value: string;
  // 值变化时的回调函数
  onChange: (url: string) => void;
  // 上传错误时的回调函数
  onUploadError?: (error: Error) => void;
  // 事件ID（可选），编辑事件时使用
  eventId?: string;
}

export default function EventImageUploader({
  value,
  onChange,
  onUploadError,
  eventId
}: EventImageUploaderProps) {
  const t = useTranslations('EventImageUploader');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 处理外站URL输入变化
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // 处理图片上传成功
  const handleImageUpload = (result: PutBlobResult) => {
    onChange(result.url);
    setUploadError(null);
  };

  // 处理图片上传失败
  const handleUploadError = (error: Error) => {
    setUploadError(error.message);
    if (onUploadError) {
      onUploadError(error);
    }
  };

  // 清除当前图片
  const handleClear = () => {
    onChange('');
    setUploadError(null);
  };

  return (
    <div className="space-y-4">
      {/* 只有当没有图片或图片加载失败时才显示上传区域 */}
      {(!value || uploadError) && (
        <>
          {/* 外站URL输入框 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('externalImageUrl')}
            </label>
            <input
              type="url"
              value={value}
              onChange={handleUrlChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* 分隔线 */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex-grow h-px bg-gray-300"></div>
            {t('or')}
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* 图片上传组件 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('uploadLocalImage')}
            </label>
            <ImageUploader
              onUploadSuccess={handleImageUpload}
              onUploadError={handleUploadError}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
              showPreview={false}
              clientPayload={JSON.stringify({
                // 如果有eventId，传递给API用于创建正确的路径
                // 注意：在创建事件时，eventId还不存在，所以会上传到临时位置
                eventId: eventId || '',
                // 文件名会由ImageUploader组件处理
                fileName: ''
              })}
            />
          </div>

          {/* 上传错误信息 */}
          {uploadError && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
              {uploadError}
            </div>
          )}
        </>
      )}

      {/* 当前图片预览 */}
      {value && !uploadError && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">{t('currentImage')}</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* 图片预览 */}
            <img 
              src={value} 
              alt={t('currentImage')} 
              className="max-w-xs max-h-48 object-cover rounded-md"
              onError={() => {
                // 处理图片加载失败的情况
                setUploadError(t('imageLoadError'));
              }}
            />
            {/* 文件信息 */}
            <div className="flex-1">
              <p className="text-sm break-all">{value}</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="mt-4 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          >
            {t('clear')}
          </button>
        </div>
      )}
    </div>
  );
}