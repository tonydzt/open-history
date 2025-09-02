'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CreateEventData } from '@/types';

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16),
    sourceType: 'news',
    images: [''],
    tags: [''],
  });

  // 检查用户登录状态
  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150 cursor-not-allowed">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </div>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录提示
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">请先登录</h2>
            <p className="text-gray-600 mb-6">创建事件功能需要登录后才能使用</p>
            <a 
              href="/auth/signin" 
              className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150"
            >
              立即登录
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'images' | 'tags', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'images' | 'tags') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'images' | 'tags', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('标题和描述为必填项');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await api.createEvent({
        ...formData,
        images: formData.images.filter(img => img.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
      });
      
      router.push(`/event/${result.id}`);
    } catch (err) {
      setError('创建事件失败，请稍后重试');
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">创建新事件</h1>
        <p className="text-gray-600">记录一个值得被记住的事件，让更多人了解真相</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            事件标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="input-field"
            placeholder="请输入事件标题"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            事件描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="input-field"
            rows={4}
            placeholder="请详细描述事件内容"
            required
          />
        </div>

        {/* Timestamp */}
        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-2">
            发生时间
          </label>
          <input
            type="datetime-local"
            id="timestamp"
            value={formData.timestamp}
            onChange={(e) => handleInputChange('timestamp', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Source Type */}
        <div>
          <label htmlFor="sourceType" className="block text-sm font-medium text-gray-700 mb-2">
            来源类型
          </label>
          <select
            id="sourceType"
            value={formData.sourceType}
            onChange={(e) => handleInputChange('sourceType', e.target.value)}
            className="input-field"
          >
            <option value="news">新闻</option>
            <option value="social">社交媒体</option>
            <option value="personal">个人经历</option>
            <option value="other">其他</option>
          </select>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            图片链接
          </label>
          <div className="space-y-2">
            {formData.images.map((image, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleArrayChange('images', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('images', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('images')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + 添加图片
            </button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <div className="space-y-2">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="标签名称"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tags', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + 添加标签
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={loading}
          >
            取消
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '创建中...' : '创建事件'}
          </button>
        </div>
      </form>
    </div>
  );
}
