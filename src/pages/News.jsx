import PageHeader from '../components/UI/PageHeader';
import Reveal from '../components/UI/Reveal';
import EmptyState from '../components/UI/EmptyState';
import NewsCard from '../components/cards/NewsCard';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

/** الأخبار: public/data/news.json — الصور: public/images/news/ */
export default function News() {
  const { t } = useLang();
  const { news } = useContent();
  const [first, ...rest] = news;
  return (
    <>
      <PageHeader title={t('news.pageTitle')} lead={t('news.pageLead')} crumbs={[{ label: t('nav.news') }]} />
      <section className="section">
        <div className="container">
          {!first ? <EmptyState text={t('common.loadError')} /> : (
            <>
              <Reveal className="mb-6"><NewsCard item={first} featured /></Reveal>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((n, i) => <Reveal as="li" key={n.id} delay={(i % 3) * 70}><NewsCard item={n} /></Reveal>)}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
