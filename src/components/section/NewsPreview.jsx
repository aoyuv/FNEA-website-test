import SectionHeading from '../UI/SectionHeading';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import NewsCard from '../cards/NewsCard';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';

export default function NewsPreview() {
  const { t } = useLang();
  const { news } = useContent();
  const [first, ...rest] = news;
  if (!first) return null;
  return (
    <section id="news" className="section">
      <div className="container">
        <SectionHeading eyebrow={t('news.eyebrow')} title={t('news.title')} action={<Button to="/news" variant="outline">{t('cta.allNews')}</Button>} />
        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2"><NewsCard item={first} featured /></Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 2).map((n, i) => <Reveal key={n.id} delay={(i + 1) * 80}><NewsCard item={n} /></Reveal>)}
          </div>
        </div>
      </div>
    </section>
  );
}
