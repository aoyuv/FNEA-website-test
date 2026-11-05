import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import Img from '../UI/Img';
import SampleBadge from '../UI/SampleBadge';
import { useLang } from '../../i18n/LanguageContext';
import { formatDate } from '../../lib/utils';

export const isUpcoming = (date) => date && new Date(date + 'T23:59:59') >= new Date();

export default function ActivityCard({ activity }) {
  const { p, t, lang } = useLang();
  const upcoming = isUpcoming(activity.date);
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Img src={activity.image} alt={p(activity.title)} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
        <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${upcoming ? 'bg-accent text-ink' : 'bg-white/90 text-ink'}`}>{upcoming ? t('activities.upcoming') : t('activities.past')}</span>
          {activity.category && <span className="rounded-md bg-primary/90 px-2 py-0.5 text-xs font-semibold text-white">{t(`activities.cats.${activity.category}`)}</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" /><time dateTime={activity.date}>{formatDate(activity.date, lang)}</time></span>
          {p(activity.location) && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" aria-hidden="true" />{p(activity.location)}</span>}
        </div>
        <h3 className="font-body text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary dark:group-hover:text-emerald-300 sm:text-xl">{p(activity.title)}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[0.95rem] text-muted" dir="auto">{p(activity.summary)}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Link to={`/activities/${activity.id}`} className="inline-flex min-h-[44px] items-center rounded-xl border border-primary/20 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white after:absolute after:inset-0">
            {t('cta.details')}
          </Link>
          <SampleBadge item={activity} />
        </div>
      </div>
    </article>
  );
}
