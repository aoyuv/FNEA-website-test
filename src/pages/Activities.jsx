import { useMemo, useState } from 'react';
import { Search, CalendarDays, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';
import Img from '../components/UI/Img';
import PageHeader from '../components/UI/PageHeader';
import FilterTabs from '../components/UI/FilterTabs';
import Reveal from '../components/UI/Reveal';
import EmptyState from '../components/UI/EmptyState';
import ActivityCard from '../components/cards/ActivityCard';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

/** النشاطات: public/data/activities.json — الصور: public/images/activities/ */
export default function Activities() {
  const { t } = useLang();
  const { activities } = useContent();
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const { p, lang, dir } = useLang();
  const cats = useMemo(() => [...new Set(activities.map((a) => a.category).filter(Boolean))], [activities]);
  const filtered = cat === 'all' ? activities : activities.filter((a) => a.category === cat);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const list = normalizedQuery ? filtered.filter((a) => [p(a.title), p(a.summary), p(a.location)].some((value) => String(value || '').toLocaleLowerCase().includes(normalizedQuery))) : filtered;
  const featured = activities[0];
  const FeaturedArrow = dir === 'rtl' ? ArrowUpLeft : ArrowUpRight;
  const options = [{ value: 'all', label: t('activities.all'), count: activities.length },
    ...cats.map((c) => ({ value: c, label: t(`activities.cats.${c}`), count: activities.filter((a) => a.category === c).length }))];
  return (
    <>
      <PageHeader title={t('activities.title')} lead={t('activities.pageLead')} crumbs={[{ label: t('nav.activities') }]} />
      <section className="section pt-8 md:pt-12">
        <div className="container">
          {featured && !query && cat === 'all' && (
            <article className="relative mb-10 grid overflow-hidden rounded-3xl bg-ink text-white shadow-lift md:min-h-[340px] md:grid-cols-2">
              <div className="relative min-h-[230px] overflow-hidden md:order-2 md:min-h-full">
                <Img src={featured.images?.[0] || featured.image} alt={p(featured.title)} eager className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 md:bg-gradient-to-l" />
                <span className="absolute start-5 top-5 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-ink">{t('activities.latest') === 'activities.latest' ? (lang === 'ar' ? 'أبرز الأنشطة' : lang === 'fr' ? 'À LA UNE' : 'FEATURED') : t('activities.latest')}</span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9 md:order-1 md:p-12">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent" />{formatDate(featured.date, lang)}</span>
                  {featured.category && <span className="rounded-full border border-white/20 px-3 py-1">{t(`activities.cats.${featured.category}`)}</span>}
                </div>
                <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">{p(featured.title)}</h2>
                <p className="mt-4 line-clamp-3 text-white/75" dir="auto">{p(featured.summary)}</p>
                <Link to={`/activities/${featured.id}`} className="mt-7 inline-flex min-h-[48px] w-fit items-center gap-3 rounded-xl bg-white px-5 font-bold text-ink transition hover:bg-accent">
                  {t('cta.details')} <FeaturedArrow className="h-4 w-4" />
                </Link>
              </div>
            </article>
          )}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><p className="eyebrow">FNEA · {lang === 'ar' ? 'الحياة الطلابية' : lang === 'fr' ? 'Vie estudiantine' : 'Student life'}</p><h2 className="h-section mt-2">{t('activities.title')}</h2></div>
            <label className="relative block w-full md:max-w-sm">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input className="input ps-12" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={lang === 'ar' ? 'ابحث عن نشاط، ولاية أو كلمة...' : lang === 'fr' ? 'Rechercher une activité, wilaya...' : 'Search activities, location...'} aria-label={lang === 'ar' ? 'البحث في الأنشطة' : 'Search activities'} />
            </label>
          </div>
          <FilterTabs options={options} value={cat} onChange={setCat} label={t('nav.activities')} />
          <div className="mb-5 mt-5 flex items-center justify-between text-sm text-muted"><span>{lang === 'ar' ? `عرض ${list.length} نشاط` : lang === 'fr' ? `${list.length} activité(s)` : `${list.length} activities`}</span></div>
          {list.length === 0 ? <EmptyState text={normalizedQuery ? (lang === 'ar' ? 'ما لقيناش نشاط يطابق بحثك.' : lang === 'fr' ? 'Aucune activité trouvée.' : 'No activities found.') : t('common.loadError')} /> : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a, i) => <Reveal as="li" key={a.id} delay={(i % 3) * 70}><ActivityCard activity={a} /></Reveal>)}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
