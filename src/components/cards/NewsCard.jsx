import { Link } from 'react-router-dom';
import Img from '../UI/Img';
import SampleBadge from '../UI/SampleBadge';
import { useLang } from '../../i18n/LanguageContext';
import { cn, formatDate } from '../../lib/utils';

export default function NewsCard({ item, featured = false }) {
  const { p, t, lang } = useLang();
  return (
    <article className={cn('card group relative flex h-full overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lift', featured ? 'flex-col lg:flex-row' : 'flex-col')}>
      <div className={cn('relative overflow-hidden', featured ? 'aspect-[16/10] lg:aspect-auto lg:w-1/2' : 'aspect-[16/10]')}>
        <Img src={item.image} alt={p(item.title)} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
      </div>
      <div className={cn('flex flex-1 flex-col', featured ? 'p-6 md:p-8' : 'p-5')}>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          {p(item.category) && <span className="font-semibold text-primary">{p(item.category)}</span>}
          <span className="text-muted" aria-hidden="true">•</span>
          <time dateTime={item.date} className="text-muted">{formatDate(item.date, lang)}</time>
          <SampleBadge item={item} />
        </div>
        <h3 className={cn('font-body font-bold text-ink', featured ? 'text-xl md:text-2xl' : 'text-lg')} dir="auto">{p(item.title)}</h3>
        <p className={cn('mt-2 flex-1 text-[0.95rem] text-muted', !featured && 'line-clamp-3')} dir="auto">{p(item.summary)}</p>
        <Link to={`/news/${item.id}`} className="mt-4 inline-flex min-h-[44px] items-center self-start text-sm font-semibold text-primary underline-offset-4 group-hover:underline after:absolute after:inset-0">
          {t('cta.readMore')}
        </Link>
      </div>
    </article>
  );
}
