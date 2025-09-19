'use client';

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

interface ImageUploaderProps {
  // 上传成功后的回调函数
  onUploadSuccess?: (result: PutBlobResult) => void;
  // 上传失败后的回调函数
  onUploadError?: (error: Error) => void;
  // 允许的文件类型，默认只允许图片
  allowedTypes?: string[];
  // 上传按钮文本
  buttonText?: string;
  // 是否显示预览
  showPreview?: boolean;
}

export default function ImageUploader({ 
  onUploadSuccess, 
  onUploadError, 
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  buttonText = '上传图片',
  showPreview = true 
}: ImageUploaderProps) {
  // 文件输入框引用
  const inputFileRef = useRef<HTMLInputElement>(null);
  // 存储上传结果
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  // 存储上传进度
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  // 存储上传状态
  const [isUploading, setIsUploading] = useState(false);
  // 存储错误信息
  const [error, setError] = useState<string | null>(null);

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      setError('请选择一个文件');
      return;
    }

    const file = inputFileRef.current.files[0];
    
    // 验证文件类型
    if (!allowedTypes.includes(file.type)) {
      setError(`不支持的文件类型，仅支持: ${allowedTypes.join(', ')}`);
      return;
    }

    // 重置状态
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 使用 Vercel Blob 客户端上传文件
      // 注意：这里的 handleUploadUrl 指向我们在 app/api/storage/upload-image/route.ts 中实现的 API 端点
      const newBlob = await upload(file.name, file, {
        access: 'public', // 设置为公共访问
        handleUploadUrl: '/api/storage/upload-image',
        // 注意：Vercel Blob 的 onUploadProgress 参数可能不是数字
        // 根据实际情况处理上传进度
        onUploadProgress: (event) => {
          // 尝试获取进度百分比
          let progressPercentage = 0;
          try {
            // 检查 event 是否是 ProgressEvent 或包含 loaded 和 total 属性的对象
            if (event && typeof event === 'object') {
              const loaded = (event as any).loaded || 0;
              const total = (event as any).total || 1;
              progressPercentage = Math.round((loaded / total) * 100);
            }
          } catch (error) {
            console.warn('无法计算上传进度:', error);
          }
          setUploadProgress(progressPercentage);
        }
      });

      // 存储上传结果
      setBlob(newBlob);
      // 调用成功回调
      if (onUploadSuccess) {
        onUploadSuccess(newBlob);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '上传失败';
      setError(errorMessage);
      // 调用失败回调
      if (onUploadError) {
        onUploadError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      // 重置上传状态
      setIsUploading(false);
      setUploadProgress(null);
      // 清除文件输入
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };

  // 清除上传结果
  const handleClear = () => {
    setBlob(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* 上传按钮 */}
      <div>
        <input
          
          type="file"
          ref={inputFileRef}
          onChange={handleFileSelect}
          accept={allowedTypes.join(',')}
          className="hidden"
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => inputFileRef.current?.click()}
          disabled={isUploading}
          className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors 
            ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              上传中...
            </span>
          ) : (
            buttonText
          )}
        </button>
        
        {/* 上传进度条 */}
        {uploadProgress !== null && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {/* 上传结果预览 */}
      {showPreview && blob && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">上传成功</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* 图片预览 */}
            {(blob.contentType?.startsWith('image/')) && (
              <img 
                src={blob.url} 
                alt="Uploaded preview" 
                className="max-w-xs max-h-48 object-cover rounded-md"
              />
            )}
            {/* 文件信息 */}
            <div className="flex-1">
              <p><strong>文件名:</strong> {blob.pathname.split('/').pop()}</p>
              {"size" in blob && (
                <p><strong>大小:</strong> {Math.round((blob as any).size / 1024)} KB</p>
              )}
              <p><strong>URL:</strong> <a href={blob.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{blob.url}</a></p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="mt-4 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
          >
            清除
          </button>
        </div>
      )}
    </div>
  );
}