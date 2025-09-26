import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/common/Providers';
import Navbar from '@/components/common/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import GoogleAnalytics from '@/components/features/analytics/GoogleAnalytics';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  // 等待params解析
  await params;
  const t = await getTranslations('Layout');

  return {
    title: t('title'),
    description: t('description'),
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  // 等待params解析
  const resolvedParams = await params;

  return (
    <html>
      <body className={inter.className}>
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <Providers>
          <NextIntlClientProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
