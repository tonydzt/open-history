import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Import all translation files
  const [
    commonFooter,
    commonLayout,
    componentsNavbar,
    componentsPerspectiveList,
    componentsEventCard,
    componentsImageUploader,
    componentsEventImageUploader,
    componentsEventSelector,
    componentsTimelineJS,
    pagesEditEventPage,
    pagesEditTimelinePage,
    pagesSignInPage,
    pagesAddPerspectivePage,
    pagesCreateEventPage,
    pagesCreateTimelinePage,
    pagesErrorPage,
    pagesEventDetailPage,
    pagesHomePage,
    pagesLoadingPage,
    pagesPrivacyPolicyPage,
    pagesTermsPage,
    pagesTimelineDetailPage
  ] = await Promise.all([
    import(`./messages/common/footer.${locale}.json`),
    import(`./messages/common/Layout.${locale}.json`),
    import(`./messages/components/Navbar.${locale}.json`),
    import(`./messages/components/PerspectiveList.${locale}.json`),
    import(`./messages/components/EventCard.${locale}.json`),
    import(`./messages/components/ImageUploader.${locale}.json`),
    import(`./messages/components/EventImageUploader.${locale}.json`),
    import(`./messages/components/EventSelector.${locale}.json`),
    import(`./messages/components/TimelineJS.${locale}.json`),
    import(`./messages/pages/EditEventPage.${locale}.json`),
    import(`./messages/pages/EditTimelinePage.${locale}.json`),
    import(`./messages/pages/SignInPage.${locale}.json`),
    import(`./messages/pages/AddPerspectivePage.${locale}.json`),
    import(`./messages/pages/CreateEventPage.${locale}.json`),
    import(`./messages/pages/CreateTimelinePage.${locale}.json`),
    import(`./messages/pages/ErrorPage.${locale}.json`),
    import(`./messages/pages/EventDetailPage.${locale}.json`),
    import(`./messages/pages/HomePage.${locale}.json`),
    import(`./messages/pages/LoadingPage.${locale}.json`),
    import(`./messages/pages/PrivacyPolicyPage.${locale}.json`),
    import(`./messages/pages/TermsPage.${locale}.json`),
    import(`./messages/pages/TimelineDetailPage.${locale}.json`)
  ]);

  // Merge all translation files
  return {
    locale,
    messages: {
      ...commonFooter.default,
      ...commonLayout.default,
      ...componentsNavbar.default,
      ...componentsPerspectiveList.default,
      ...componentsEventCard.default,
      ...componentsImageUploader.default,
      ...componentsEventImageUploader.default,
      ...componentsEventSelector.default,
      ...componentsTimelineJS.default,
      ...pagesEditEventPage.default,
    ...pagesEditTimelinePage.default,
    ...pagesSignInPage.default,
      ...pagesAddPerspectivePage.default,
      ...pagesCreateEventPage.default,
      ...pagesCreateTimelinePage.default,
      ...pagesErrorPage.default,
      ...pagesEventDetailPage.default,
      ...pagesHomePage.default,
      ...pagesLoadingPage.default,
      ...pagesPrivacyPolicyPage.default,
      ...pagesTermsPage.default,
      ...pagesTimelineDetailPage.default
    }
  };
});