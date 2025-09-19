'use client';

import { useEffect } from 'react';

// 图片上传测试页面的错误处理组件
interface UploadTestErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const UploadTestError = ({ error, reset }: UploadTestErrorProps) => {
  useEffect(() => {
    // 记录错误到控制台
    console.error('图片上传测试页面错误:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">发生错误</h1>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        很抱歉，图片上传测试页面加载失败。请尝试刷新页面或稍后再试。
      </p>
      <button 
        onClick={() => reset()} 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        重试
      </button>
    </div>
  );
};

export default UploadTestError;