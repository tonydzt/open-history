'use client';

import { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/DropdownMenu';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface EventActionsMenuProps {
  eventId: string;
  isAuthor: boolean;
  onShare?: () => void;
  onAddPerspective?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  shareButtonText: string;
  addPerspectiveButtonText: string;
  editButtonText: string;
  deleteEventButtonText: string;
  actionsMenuText: string;
}

const EventActionsMenu: React.FC<EventActionsMenuProps> = ({
  eventId,
  isAuthor,
  onShare,
  onAddPerspective,
  onEdit,
  onDelete,
  shareButtonText,
  addPerspectiveButtonText,
  editButtonText,
  deleteEventButtonText,
  actionsMenuText
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const t = useTranslations('EventDetailPage');

  const handleAddPerspective = () => {
    setIsMenuOpen(false);
    if (onAddPerspective) {
      onAddPerspective();
    } else {
      window.location.href = `/event/${eventId}/perspective`;
    }
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    if (onEdit) {
      onEdit();
    } else {
      window.location.href = `/event/${eventId}/edit`;
    }
  };

  const handleDelete = async () => {
    setIsMenuOpen(false);
    
    if (onDelete) {
      onDelete();
      return;
    }
    
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

  const handleShare = () => {
    setIsMenuOpen(false);
    if (onShare) {
      onShare();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative z-10">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          aria-label={actionsMenuText}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        open={isMenuOpen} 
        onOpenChange={setIsMenuOpen} 
        align="right"
      >
        <DropdownMenuItem onClick={handleShare}>
          <div className="flex items-center gap-2 w-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>{shareButtonText}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddPerspective}>
          <div className="flex items-center gap-2 w-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m0 10l-5-5 5-5" />
            </svg>
            <span>{addPerspectiveButtonText}</span>
          </div>
        </DropdownMenuItem>
        {isAuthor && (
          <>
            <DropdownMenuItem onClick={handleEdit}>
              <div className="flex items-center gap-2 w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>{editButtonText}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem isDestructive onClick={handleDelete}>
              <div className="flex items-center gap-2 w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{deleteEventButtonText}</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventActionsMenu;