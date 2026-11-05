import PageHeader from '../components/UI/PageHeader';
import Button from '../components/UI/Button';
import { useLang } from '../i18n/LanguageContext';

export default function NotFound({ title }) {
  const { t } = useLang();
  return (
    <>
      <PageHeader title={title || t('common.notFoundTitle')} lead={t('common.notFoundText')} crumbs={[{ label: '404' }]} />
      <section className="section"><div className="container flex flex-wrap gap-3">
        <Button to="/">{t('cta.home')}</Button><Button to="/submit" variant="outline">{t('cta.submit')}</Button>
      </div></section>
    </>
  );
}
