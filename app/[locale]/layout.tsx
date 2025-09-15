import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import { NextIntlClientProvider} from 'next-intl';
import { getTranslations } from 'next-intl/server';
import GoogleAnalytics from '@/components/GoogleAnalytics';

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

export default async function LocaleLayout({children, params}: Props) {
  // 等待params解析
  const resolvedParams = await params;

  return (
    <html>
      <body className={inter.className}>
        <GoogleAnalytics />
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
