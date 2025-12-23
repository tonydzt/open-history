'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Logo from './Logo';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-end items-center">
          <div className="flex flex-col items-end space-y-4">
            {/* 社交媒体链接 */}
            <div className="flex space-x-4">
              <Link 
                href="https://www.reddit.com/user/Disastrous-Copy3052/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Reddit"
                className="hover:opacity-80 transition-opacity"
              >
                <Logo type="reddit" size={32} alt="Reddit Logo" />
              </Link>
              <Link 
                href="https://x.com/VOFT_vineoftime" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter/X"
                className="hover:opacity-80 transition-opacity"
              >
                <Logo type="x" size={32} alt="Twitter/X Logo" />
              </Link>
              <Link 
                href="https://www.instagram.com/voft_vineoftime" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:opacity-80 transition-opacity"
              >
                <Logo type="instagram" size={32} alt="Instagram Logo" />
              </Link>
            </div>
            {/* 网站链接 */}
            <div className="flex space-x-6">
              <Link 
                href={`/${locale}/about`} 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {t('about')}
              </Link>
              <Link 
                href={`/${locale}/terms`}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {t('terms')}
              </Link>
              <Link 
                href={`/${locale}/privacy`}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {t('privacy')}
              </Link>
            </div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {t('copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}