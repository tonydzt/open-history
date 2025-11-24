import { useTranslations } from 'next-intl';
import { NextPage } from 'next';

const AboutPage: NextPage = () => {
  const t = useTranslations('about');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {t('title')}
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {t('section1.title')}
          </h2>
            {/* 避免直接使用数组类型的消息，而是通过单独的键获取每个段落 */}
            <p className="text-gray-700">{t('section1.content.0')}</p>
            <p className="text-gray-700">{t('section1.content.1')}</p>
            <p className="text-gray-700">{t('section1.content.2')}</p>
            <p className="text-gray-700">{t('section1.content.3')}</p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;