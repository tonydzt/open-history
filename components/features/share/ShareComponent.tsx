'use client';

import React, { useState } from 'react';

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
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
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
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                  aria-label="分享到Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.805 9.797v.02c0 2.757 1.993 5.09 4.785 5.64a5.044 5.044 0 01-2.455 1.935c-.002.017-.011.033-.011.05v.02c0 2.481 1.703 4.583 3.93 4.946.3.042.602.063.905.063z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                  aria-label="分享到Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>

                <button
                  onClick={() => handleShare('reddit')}
                  className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                  aria-label="分享到Reddit"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-1.822-.356-3.54-1.002-5.073-1.193 1.49-2.736 2.57-4.506 3.043.854-.502 1.504-1.28 1.818-2.267C18.278 6.593 15.42 4 12 4 10.783 4 9.642 4.386 8.693 5.104c-.91.7-1.495 1.735-1.62 2.943C5.898 7.88 3.936 5.348 2.237 2.432A11.323 11.323 0 0 1 12 0zm0 2.943c.603 0 1.196.097 1.77.281.576.185 1.126.44 1.642.758-.717.44-1.532.686-2.412.686-.88 0-1.701-.246-2.412-.686.516-.318 1.066-.573 1.642-.758C10.804 3.04 11.397 2.943 12 2.943zm-3.45 4.336c.006.08.02.159.04.236.02.077.048.152.083.223.035.071.077.138.124.202.047.064.099.123.156.178.057.055.118.106.182.152.064.046.131.087.2.123.069.036.139.069.211.097.072.028.144.052.217.073.073.021.147.039.221.052.074.013.148.021.221.025.073.004.146.006.218.006.072 0 .144-.002.216-.006.073-.004.146-.012.218-.025.074-.013.148-.031.221-.052.073-.021.145-.045.217-.073.072-.028.142-.061.211-.097.069-.036.136-.077.2-.123.064-.046.125-.097.182-.152.057-.055.109-.114.156-.178.047-.064.089-.131.124-.202.035-.071.063-.146.083-.223.02-.077.034-.156.04-.236.006-.08.01-.162.01-.246 0-.083.004-.164.01-.246.006-.08.02-.159.04-.236.02-.077.048-.152.083-.223.035-.071.077-.138.124-.202.047-.064.099-.123.156-.178.057-.055.118-.106.182-.152.064-.046.131-.087.2-.123.069-.036.139-.069.211-.097.072-.028.144-.052.217-.073.073-.021.147-.039.221-.052.074-.013.148-.021.221-.025.073-.004.146-.006.218-.006.072 0 .144.002.216.006.073.004.146.012.218.025.074.013.148.031.221.052.073.021.145-.045.217-.073.072-.028.142-.061.211-.097.069-.036.136-.077.2-.123.064-.046.125-.097.182-.152.057-.055.109-.114.156-.178.047-.064.089-.131.124-.202.035-.071.063-.146.083-.223.02-.077.034-.156.04-.236.006-.08.01-.162.01-.246 0 .084.004.165.01.246zm0 .986c-.006.08-.02.159-.04.236-.02.077-.048.152-.083.223-.035.071-.077.138-.124.202-.047.064-.099.123-.156.178-.057.055-.118.106-.182.152-.064.046-.131.087-.2.123-.069.036-.139.069-.211.097-.072.028-.144.052-.217.073-.073.021-.147.039-.221.052-.074.013-.148.021-.221.025-.073.004-.146.006-.218.006-.072 0-.144-.002-.216-.006-.073-.004-.146-.012-.218-.025-.074-.013-.148-.031-.221-.052-.073-.021-.145-.045-.217-.073-.072-.028-.142-.061-.211-.097-.069-.036-.136-.077-.2-.123-.064-.046-.125-.097-.182-.152-.057-.055-.109-.114-.156-.178-.047-.064-.089-.131-.124-.202-.035-.071-.063-.146-.083-.223-.02-.077-.034-.156-.04-.236-.006-.08-.01-.162-.01-.246 0-.083.004-.164.01-.246.006-.08.02-.159.04-.236.02-.077.048-.152.083-.223.035-.071.077-.138.124-.202.047-.064.099-.123.156-.178.057-.055.118-.106.182-.152.064-.046.131-.087.2-.123.069-.036.139-.069.211-.097.072-.028.144-.052.217-.073.073-.021.147-.039.221-.052.074-.013.148-.021.221-.025.073-.004.146-.006.218-.006.072 0 .144.002.216.006.073.004.146.012.218.025.074.013.148.031.221.052.073.021.145.045.217.073.072.028.142.061.211.097.069.036.136.077.2.123.064.046.125.097.182.152.057.055.109.114.156.178.047.064.089.131.124.202.035.071.063.146.083.223.02.077.034.156.04.236.006.08.01.162.01.246 0 .084-.004.165-.01.246zm1.725.218c-.006.08-.02.159-.04.236-.02.077-.048.152-.083.223-.035.071-.077.138-.124.202-.047.064-.099.123-.156.178-.057.055-.118.106-.182.152-.064.046-.131.087-.2.123-.069.036-.139.069-.211.097-.072.028-.144.052-.217.073-.073.021-.147.039-.221.052-.074.013-.148.021-.221.025-.073.004-.146.006-.218.006-.072 0-.144-.002-.216-.006-.073-.004-.146-.012-.218-.025-.074-.013-.148-.031-.221-.052-.073-.021-.145-.045-.217-.073-.072-.028-.142-.061-.211-.097-.069-.036-.136-.077-.2-.123-.064-.046-.125-.097-.182-.152-.057-.055-.109-.114-.156-.178-.047-.064-.089-.131-.124-.202-.035-.071-.063-.146-.083-.223-.02-.077-.034-.156-.04-.236-.006-.08-.01-.162-.01-.246 0-.083.004-.164.01-.246.006-.08.02-.159.04-.236.02-.077.048-.152.083-.223.035-.071.077-.138.124-.202.047-.064.099-.123.156-.178.057-.055.118-.106.182-.152.064-.046.131-.087.2-.123.069-.036.139-.069.211-.097.072-.028.144-.052.217-.073.073-.021.147-.039.221-.052.074-.013.148-.021.221-.025.073-.004.146-.006.218-.006.072 0 .144.002.216.006.073.004.146.012.218.025.074.013.148.031.221.052.073.021.145.045.217.073.072.028.142.061.211.097.069.036.136.077.2.123.064.046.125.097.182.152.057.055.109.114.156.178.047.064.089.131.124.202.035.071.063.146.083.223.02.077.034.156.04.236.006.08.01.162.01.246 0 .084-.004.165-.01.246zm5.195.444c-.006.08-.02.159-.04.236-.02.077-.048.152-.083.223-.035.071-.077.138-.124.202-.047.064-.099.123-.156.178-.057.055-.118.106-.182.152-.064.046-.131.087-.2.123-.069.036-.139.069-.211.097-.072.028-.144.052-.217.073-.073.021-.147.039-.221.052-.074.013-.148.021-.221.025-.073.004-.146.006-.218.006-.072 0-.144-.002-.216-.006-.073-.004-.146-.012-.218-.025-.074-.013-.148-.031-.221-.052-.073-.021-.145-.045-.217-.073-.072-.028-.142-.061-.211-.097-.069-.036-.136-.077-.2-.123-.064-.046-.125-.097-.182-.152-.057-.055-.109-.114-.156-.178-.047-.064-.089-.131-.124-.202-.035-.071-.063-.146-.083-.223-.02-.077-.034-.156-.04-.236-.006-.08-.01-.162-.01-.246 0-.083.004-.164.01-.246.006-.08.02-.159.04-.236.02-.077.048-.152.083-.223.035-.071.077-.138.124-.202.047-.064.099-.123.156-.178.057-.055.118-.106.182-.152.064-.046.131-.087.2-.123.069-.036.139-.069.211-.097.072-.028.144-.052.217-.073.073-.021.147-.039.221-.052.074-.013.148-.021.221-.025.073-.004.146-.006.218-.006.072 0 .144.002.216.006.073.004.146.012.218.025.074.013.148.031.221.052.073.021.145.045.217.073.072.028.142.061.211.097.069.036.136.077.2.123.064.046.125.097.182.152.057.055.109.114.156.178.047.064.089.131.124.202.035.071.063.146.083.223.02.077.034.156.04.236.006.08.01.162.01.246 0 .084-.004.165-.01.246z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 设置部分 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">设置</h3>
              <p className="text-xs text-gray-500 mb-4">
                设置这些值可以改善您的内容在推文或Facebook分享中的显示效果。
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