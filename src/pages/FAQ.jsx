import PageHeader from '../components/UI/PageHeader';
import FAQSection from '../components/section/FAQSection';
import ContactCTA from '../components/section/ContactCTA';
import { useLang } from '../i18n/LanguageContext';

export default function FAQ() {
  const { t } = useLang();
  return (
    <>
      <PageHeader title={t('faq.title')} crumbs={[{ label: t('nav.faq') }]} />
      <FAQSection showAllLink={false} />
      <ContactCTA />
    </>
  );
}
