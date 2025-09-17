'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface DeleteEventButtonProps {
  eventId: string;
}

const DeleteEventButton: React.FC<DeleteEventButtonProps> = ({ eventId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const t = useTranslations('EventDetailPage');

  const handleDelete = async () => {
    // 使用原生confirm对话框
    if (!window.confirm(t('deleteEventConfirm'))) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(t('deleteEventError'));
      }

      // 删除成功后重定向到主页
      alert(t('deleteEventSuccess'));
      router.push('/');
    } catch (error) {
      console.error('删除事件时发生错误:', error);
      alert(error instanceof Error ? error.message : t('deleteEventError'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="fixed right-6 bottom-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
    >
      {isDeleting ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Deleting...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {t('deleteEventButton')}
        </>
      )}
    </button>
  );
};

export default DeleteEventButton;