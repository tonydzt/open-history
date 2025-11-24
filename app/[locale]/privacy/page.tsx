import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('PrivacyPolicyPage');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('pageTitle')}</h1>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p className="text-lg">{t('introduction')}</p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.collectedInfo.title')}</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{t('sections.collectedInfo.providedInfo.title')}</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t('sections.collectedInfo.providedInfo.accountInfo.title')}</strong>：{t('sections.collectedInfo.providedInfo.accountInfo.description')}</li>
                <li><strong>{t('sections.collectedInfo.providedInfo.contentInfo.title')}</strong>：{t('sections.collectedInfo.providedInfo.contentInfo.description')}</li>
                <li><strong>{t('sections.collectedInfo.providedInfo.contactInfo.title')}</strong>：{t('sections.collectedInfo.providedInfo.contactInfo.description')}</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">{t('sections.collectedInfo.autoCollectedInfo.title')}</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t('sections.collectedInfo.autoCollectedInfo.logInfo.title')}</strong>：{t('sections.collectedInfo.autoCollectedInfo.logInfo.description')}</li>
                <li><strong>{t('sections.collectedInfo.autoCollectedInfo.deviceInfo.title')}</strong>：{t('sections.collectedInfo.autoCollectedInfo.deviceInfo.description')}</li>
                <li><strong>{t('sections.collectedInfo.autoCollectedInfo.cookies.title')}</strong>：{t('sections.collectedInfo.autoCollectedInfo.cookies.description')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.howWeUse.title')}</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('sections.howWeUse.points.0')}</li>
                <li>{t('sections.howWeUse.points.1')}</li>
                <li>{t('sections.howWeUse.points.2')}</li>
                <li>{t('sections.howWeUse.points.3')}</li>
                <li>{t('sections.howWeUse.points.4')}</li>
                <li>{t('sections.howWeUse.points.5')}</li>
                <li>{t('sections.howWeUse.points.6')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.infoSharing.title')}</h2>
              <p>{t('sections.infoSharing.intro')}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t('sections.infoSharing.withYourConsent.title')}</strong>：{t('sections.infoSharing.withYourConsent.description')}</li>
                <li><strong>{t('sections.infoSharing.thirdPartyProviders.title')}</strong>：{t('sections.infoSharing.thirdPartyProviders.description')}</li>
                <li><strong>{t('sections.infoSharing.legalRequirements.title')}</strong>：{t('sections.infoSharing.legalRequirements.description')}</li>
                <li><strong>{t('sections.infoSharing.businessTransactions.title')}</strong>：{t('sections.infoSharing.businessTransactions.description')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.infoSecurity.title')}</h2>
              <p>{t('sections.infoSecurity.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.yourPrivacyRights.title')}</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t('sections.yourPrivacyRights.accessRight.title')}</strong>：{t('sections.yourPrivacyRights.accessRight.description')}</li>
                <li><strong>{t('sections.yourPrivacyRights.correctionRight.title')}</strong>：{t('sections.yourPrivacyRights.correctionRight.description')}</li>
                <li><strong>{t('sections.yourPrivacyRights.deletionRight.title')}</strong>：{t('sections.yourPrivacyRights.deletionRight.description')}</li>
                <li><strong>{t('sections.yourPrivacyRights.restrictionRight.title')}</strong>：{t('sections.yourPrivacyRights.restrictionRight.description')}</li>
                <li><strong>{t('sections.yourPrivacyRights.dataPortability.title')}</strong>：{t('sections.yourPrivacyRights.dataPortability.description')}</li>
                <li><strong>{t('sections.yourPrivacyRights.objectionRight.title')}</strong>：{t('sections.yourPrivacyRights.objectionRight.description')}</li>
                <li><strong>{t('sections.yourPrivacyRights.withdrawConsent.title')}</strong>：{t('sections.yourPrivacyRights.withdrawConsent.description')}</li>
              </ul>
              <p className="mt-2">{t('sections.yourPrivacyRights.contactUs')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.minorsProtection.title')}</h2>
              <p>{t('sections.minorsProtection.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.dataRetention.title')}</h2>
              <p>{t('sections.dataRetention.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.internationalDataTransfer.title')}</h2>
              <p>{t('sections.internationalDataTransfer.description')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.privacyPolicyUpdates.title')}</h2>
              <p>{t('sections.privacyPolicyUpdates.description')}</p>
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