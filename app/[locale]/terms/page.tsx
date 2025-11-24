import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('TermsPage');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('pageTitle')}</h1>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p className="text-lg">{t('introduction')}</p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.acceptance.title')}</h2>
              <p>{t('sections.acceptance.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.platformDescription.title')}</h2>
              <p>{t('sections.platformDescription.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.accountRegistration.title')}</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('sections.accountRegistration.points.0')}</li>
                <li>{t('sections.accountRegistration.points.1')}</li>
                <li>{t('sections.accountRegistration.points.2')}</li>
                <li>{t('sections.accountRegistration.points.3')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.userConduct.title')}</h2>
              <p>{t('sections.userConduct.intro')}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('sections.userConduct.points.0')}</li>
                <li>{t('sections.userConduct.points.1')}</li>
                <li>{t('sections.userConduct.points.2')}</li>
                <li>{t('sections.userConduct.points.3')}</li>
                <li>{t('sections.userConduct.points.4')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.contentManagement.title')}</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('sections.contentManagement.points.0')}</li>
                <li>{t('sections.contentManagement.points.1')}</li>
                <li>{t('sections.contentManagement.points.2')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.intellectualProperty.title')}</h2>
              <p>{t('sections.intellectualProperty.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.termination.title')}</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('sections.termination.points.0')}</li>
                <li>{t('sections.termination.points.1')}</li>
                <li>{t('sections.termination.points.2')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.disclaimers.title')}</h2>
              <p>{t('sections.disclaimers.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.limitationOfLiability.title')}</h2>
              <p>{t('sections.limitationOfLiability.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.termsModifications.title')}</h2>
              <p>{t('sections.termsModifications.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.governingLaw.title')}</h2>
              <p>{t('sections.governingLaw.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.contactUs.title')}</h2>
              <p>{t('sections.contactUs.description')}</p>
              <p className="font-medium">{t('sections.contactUs.email')}</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}