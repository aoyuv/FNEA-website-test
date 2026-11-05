import PageHeader from '../components/UI/PageHeader';
import Services from '../components/section/Services';
import ConcernCTA from '../components/section/ConcernCTA';
import { useLang } from '../i18n/LanguageContext';

export default function ServicesPage() {
  const { t } = useLang();
  return (
    <>
      <PageHeader title={t('services.title')} lead={t('services.pageLead')} crumbs={[{ label: t('nav.services') }]} />
      <Services showHeading={false} />
      <ConcernCTA />
    </>
  );
}
