'use client';

import React, { useState } from 'react';
import Logo from '@/components/common/Logo';

interface ShareComponentProps {
  storyMapUrl: string;
  title?: string;
  description?: string;
  featuredImage?: string;
  buttonText?: string;
  buttonClassName?: string;
}

/**
 * 分享按钮组件
 */
const ShareButton = ({ onClick, children, className }: { onClick: () => void; children?: React.ReactNode; className?: string }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors ${className}`}
    >
      {children || '分享'}
    </button>
  );
};

/**
 * 分享对话框组件
 */
const ShareDialog = ({ open, onOpenChange, storyMapUrl, title, description, featuredImage }: { open: boolean; onOpenChange: (open: boolean) => void; storyMapUrl: string; title?: string; description?: string; featuredImage?: string }) => {
  // 社交媒体分享URL生成函数
  const getSocialShareUrl = (platform: string, url: string, title?: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title || '');

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      // case 'instagram':
      //   // Instagram不支持直接网页分享，这里返回原链接
      //   return url;
      case 'reddit':
        return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
      default:
        return url;
    }
  };

  // 打开分享链接
  const handleShare = (platform: string) => {
    const shareUrl = getSocialShareUrl(platform, storyMapUrl, title);
    window.open(shareUrl, '_blank', 'noopener noreferrer');
  };

  // 复制链接
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(storyMapUrl);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        {/* 遮罩层 */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={() => onOpenChange(false)}
        ></div>

        {/* 对话框容器 */}
        <div
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl"
          role="dialog"
          aria-modal="true"
        >
          {/* 对话框头部 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">分享此内容</h3>
          </div>

          {/* 对话框内容 */}
          <div className="space-y-6 py-4 px-6">
            {/* 关联部分 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">关联</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    复制
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={storyMapUrl}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                您可以将此链接单独放在一行，以便将您的内容嵌入到Medium.com中。
              </p>
            </div>

            {/* 社交媒体分享按钮 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">社会的</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleShare('twitter')}
                  className="bg-transparent hover:opacity-80 transition-opacity"
                  aria-label="分享到Twitter"
                >
                  <Logo type="twitter" size={32} alt="Twitter Logo" />
                </button>

                {/* <button
                  onClick={() => handleShare('instagram')}
                  className="bg-transparent hover:opacity-80 transition-opacity"
                  aria-label="分享到Instagram"
                >
                  <Logo type="instagram" size={32} alt="Instagram Logo" />
                </button> */}

                <button
                  onClick={() => handleShare('reddit')}
                  className="bg-transparent hover:opacity-80 transition-opacity"
                  aria-label="分享到Reddit"
                >
                  <Logo type="reddit" size={32} alt="Reddit Logo" />
                </button>
              </div>
            </div>

            {/* 设置部分 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">设置</h3>
              <p className="text-xs text-gray-500 mb-4">
                设置这些值可以改善您的内容在推文或Instagram分享中的显示效果。
              </p>

              {/* 描述字段 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={description || ''}
                  readOnly
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="输入描述..."
                />
              </div>

              {/* 特色图片 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">特色图片</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={featuredImage || ''}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="图片URL..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  或者将图片上传到您的内容文件夹。
                </p>
              </div>
            </div>
          </div>

          {/* 对话框底部 */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 合并的分享组件
 */
const ShareComponent = ({ storyMapUrl, title, description, featuredImage, buttonText, buttonClassName }: ShareComponentProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ShareButton
        onClick={() => setOpen(true)}
        className={buttonClassName}
      >
        {buttonText || '分享'}
      </ShareButton>
      <ShareDialog
        open={open}
        onOpenChange={setOpen}
        storyMapUrl={storyMapUrl}
        title={title}
        description={description}
        featuredImage={featuredImage}
      />
    </>
  );
};

export default ShareComponent;