import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LoadingIndicator from '@/components/common/LoadingIndicator';

interface Collection {
  id: string;
  name: string;
  description?: string;
  _count?: {
    collection_event: number;
  };
}

interface CollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess?: () => void;
}

export default function CollectionDialog({
  isOpen,
  onClose,
  eventId,
  onSuccess,
}: CollectionDialogProps) {
  const t = useTranslations('CollectionDialog');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadCollections();
    }
  }, [isOpen]);

  const loadCollections = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/component/tab/collection');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const result = await response.json();
      setCollections(result.collections.map((collection: any) => ({
        ...collection,
        description: collection.description || undefined
      })));
      if (result.collections.length > 0) {
        setSelectedCollection(result.collections[0].id);
      }
    } catch (err) {
      setError(t('loadFailed'));
      console.error('Failed to load collections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollection) return;

    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch(`/api/events/${eventId}/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionId: selectedCollection }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('addFailed'));
      }
      
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || t('addFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-8 text-center">
              <LoadingIndicator />
            </div>
          ) : collections.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {t('noCollections')}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('selectCollection')}
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name} ({collection._count?.collection_event || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isSubmitting || !selectedCollection}
                >
                  {isSubmitting ? (
                    <LoadingIndicator loadingText={t('adding')} buttonStyle={true} />
                  ) : (
                    t('confirm')
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}