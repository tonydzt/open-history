import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import {routing} from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chronicle - 多视角事件记录平台',
  description: '记录事件，分享视角，构建完整的历史图景',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {

  const {locale} = await params;

  return (
    <html>
      <body className={inter.className}>
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
