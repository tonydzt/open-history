import React from 'react';
import Image from 'next/image';

interface LogoProps {
  type?: 'reddit' | 'voft' | 'instagram' | 'twitter' | 'x';
  size?: number;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  type = 'voft', 
  size = 48, 
  alt = 'Logo' 
}) => {
  // 定义logo图片路径映射
  const logoPaths = {
    reddit: '/img/logo/reddit.png',
    voft: '/img/logo/vineoftime.png',
    instagram: '/img/logo/instagram.png',
    twitter: '/img/logo/twitter.png',
    x: '/img/logo/x.png'
  };

  // 根据type获取对应的图片路径
  const src = logoPaths[type];

  return (
    <div className="flex items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Logo;