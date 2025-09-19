import { Suspense } from 'react';

// 图片上传测试页面的加载组件
const UploadTestLoading = () => {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-xl text-gray-600">加载图片上传测试页面...</p>
      </div>
    }>
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-xl text-gray-600">加载图片上传测试页面...</p>
      </div>
    </Suspense>
  );
};

export default UploadTestLoading;