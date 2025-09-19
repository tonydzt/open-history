'use client';

import ImageUploader from '@/components/ImageUploader';
import { useState } from 'react';

// 简单的图片上传测试页面
const UploadTestPage = () => {
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  // 处理图片上传成功
  const handleImageUpload = (blob: any) => {
    console.log('图片上传成功:', blob);
    setUploadedImages([...uploadedImages, blob]);
  };

  // 处理上传错误
  const handleUploadError = (error: any) => {
    console.error('上传错误:', error);
    alert('上传失败，请重试');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">图片上传测试</h1>
        <p className="text-gray-600">使用下方组件上传图片并测试功能</p>
      </header>

      <main>
        {/* 图片上传组件 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">上传图片</h2>
          <ImageUploader
            onUploadSuccess={handleImageUpload}
            onUploadError={handleUploadError}
            allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
          />
        </div>

        {/* 上传历史 */}
        {uploadedImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">上传历史</h2>
            <div className="space-y-6">
              {uploadedImages.map((image, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <img 
                      src={image.url} 
                      alt={`Uploaded image ${index + 1}`} 
                      className="w-32 h-32 object-cover rounded-lg shadow-sm"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">文件信息</p>
                    <p><strong>URL:</strong> <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-sm">{image.url}</a></p>
                    <p><strong>路径:</strong> <code className="text-sm bg-gray-100 px-2 py-1 rounded">{image.pathname}</code></p>
                    <p><strong>类型:</strong> {image.contentType}</p>
                    {image.size && <p><strong>大小:</strong> {Math.round(image.size / 1024)} KB</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} 图片上传测试页面</p>
      </footer>
    </div>
  );
};

export default UploadTestPage;