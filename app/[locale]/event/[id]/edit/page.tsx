"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CreateEventData, GeoLocation } from '@/types';
import LeafletMapWrapper from '@/components/features/map/LeafletMapWrapper';
import EventImageUploader from '@/components/features/events/EventImageUploader';
// Leaflet CSS 需要单独导入
import 'leaflet/dist/leaflet.css';

export default function EditEventPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const t = useTranslations('EditEventPage');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16),
    sourceType: 'news',
    images: [''],
    tags: [''],
    geom: undefined,
  });

  // 加载事件数据
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoadingData(true);
        const eventResponse = await fetch(`/api/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event');
        }
        const eventData = await eventResponse.json();
        
        // 转换数据格式以适应表单
        const formattedData: CreateEventData = {
          title: eventData.event.title,
          description: eventData.event.description,
          timestamp: eventData.event.timestamp.slice(0, 16), // 移除秒和毫秒部分
          sourceType: eventData.event.sourceType,
          images: eventData.event.images.length > 0 ? eventData.event.images : [''],
          tags: eventData.event.tags.length > 0 ? eventData.event.tags : [''],
          geom: eventData.event.geom,
        };
        
        setFormData(formattedData);
      } catch (err) {
        setError(t('fetchEventFailed'));
        console.error('Error fetching event data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchEventData();
  }, [eventId, t]);

  // 如果用户未登录，显示登录提示
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t('pleaseLogin')}</h2>
            <p className="text-gray-600 mb-6">{t('loginRequired')}</p>
            <a
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-600 hover:bg-primary-500 transition ease-in-out duration-150"
            >
              {t('loginNow')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 如果正在加载数据，显示加载状态
  if (isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">{t('loadingEvent')}</h3>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeomChange = (geom: GeoLocation) => {
    setFormData(prev => ({ ...prev, geom }));
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
      setError(t('titleAndDescriptionRequired'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 准备表单数据，包含地理位置转换
      const eventData = {
        ...formData,
        images: formData.images.filter(img => img.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        // 直接传递geom对象，API路由会负责转换格式
        geom: formData.geom
      };

      // 使用fetch API调用更新事件的PUT请求
      const updateResponse = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update event');
      }

      router.push(`/event/${eventId}`);
    } catch (err) {
      setError(t('updateEventFailed'));
      console.error('Error updating event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pageTitle')}</h1>
        <p className="text-gray-600">{t('pageSubtitle')}</p>
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
            {t('eventTitle')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="input-field"
            placeholder={t('enterEventTitle')}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            {t('eventDescription')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="input-field"
            rows={4}
            placeholder={t('enterEventDescription')}
            required
          />
        </div>

        {/* Timestamp */}
        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-2">
            {t('occurrenceTime')}
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
            {t('sourceType')}
          </label>
          <select
            id="sourceType"
            value={formData.sourceType}
            onChange={(e) => handleInputChange('sourceType', e.target.value)}
            className="input-field"
          >
            <option value="news">{t('sourceTypeOptions.news')}</option>
            <option value="social">{t('sourceTypeOptions.social')}</option>
            <option value="personal">{t('sourceTypeOptions.personal')}</option>
            <option value="other">{t('sourceTypeOptions.other')}</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('image')}
          </label>
          <EventImageUploader
            value={formData.images[0] || ''}
            onChange={(url) => handleInputChange('images', [url])}
            onUploadError={(error) => {
              console.error('Image upload error:', error);
              setError(t('imageUploadFailed'));
            }}
            // 传递事件ID，用于构建正确的上传路径
            eventId={eventId}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tags')}
          </label>
          <div className="space-y-2">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder={t('tagPlaceholder')}
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tags', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    {t('delete')}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + {t('addTag')}
            </button>
          </div>
        </div>

        {/* Location Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('location')}
          </label>
          <div className="relative h-80 w-full rounded-md border-2 border-gray-300 overflow-hidden">
            {typeof window !== 'undefined' && (
              <LeafletMapWrapper 
                initialGeom={formData.geom}
                onGeomChange={handleGeomChange}
              />
            )}
            {formData.geom && (
              <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-md shadow-md">
                <p className="text-sm font-medium">{t('selectedLocation')}</p>
                <p className="text-xs text-gray-600">
                  {formData.geom.lat.toFixed(6)}, {formData.geom.lng.toFixed(6)}
                </p>
              </div>
            )}
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
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? t('updating') : t('updateEvent')}
          </button>
        </div>
      </form>
    </div>
  );
}