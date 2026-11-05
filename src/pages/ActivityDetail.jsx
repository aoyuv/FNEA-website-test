import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Share2, ArrowRight, ArrowLeft } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import Img from '../components/UI/Img';
import Button from '../components/UI/Button';
import SampleBadge from '../components/UI/SampleBadge';
import Lightbox from '../components/UI/Lightbox';
import ActivityCard from '../components/cards/ActivityCard';
import NotFound from './NotFound';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';
import { formatDate } from '../lib/utils';

export default function ActivityDetail() {
  const { id } = useParams();
  const { t, p, lang, dir } = useLang();
  const { activities } = useContent();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const a = activities.find((x) => x.id === id);
  if (!a) return <NotFound title={t('activities.notFound')} />;

  const body = p(a.body) || [];
  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft;
  const others = activities.filter((x) => x.id !== id).slice(0, 3);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const gallery = [
    { src: a.image, alt: a.title },
    ...(Array.isArray(a.images) ? a.images : []),
  ]
    .map((item) => (typeof item === 'string'
      ? { src: item, alt: a.title }
      : { src: item?.src || item?.image || item?.url, alt: item?.alt || a.title, caption: item?.caption }))
    .filter((item) => item.src)
    .filter((item, index, items) => items.findIndex((entry) => entry.src === item.src) === index);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: p(a.title), url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* ignored */
    }
  };

  const remainingCount = Math.max(0, gallery.length - 5);
  const thumbnails = gallery.slice(1, 5);

  return (
    <>
      <PageHeader title={t('nav.activities')} crumbs={[{ label: t('nav.activities'), to: '/activities' }]} />

      <article className="section">
        <div className="container max-w-4xl">
          <header>
            <h1 className="font-body text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-[2.7rem]" dir="auto">
              {p(a.title)}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-ink/10 py-3 text-sm text-muted">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <time dateTime={a.date}>{formatDate(a.date, lang)}</time>
                </span>
                {p(a.location) && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span dir="auto">{p(a.location)}</span>
                  </span>
                )}
              </div>
              <Button onClick={share} variant="outline" size="sm" className="shrink-0">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                {copied ? t('activities.copied') : t('activities.share')}
              </Button>
            </div>
          </header>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label={p(a.title)}
              className="group relative block w-full overflow-hidden rounded-2xl text-start"
            >
              <Img
                src={gallery[0]?.src}
                alt={p(a.title)}
                eager
                className="aspect-[16/9] w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-dark/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>

            {thumbnails.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {thumbnails.map((item, index) => {
                  const isLastVisible = index === 3 && remainingCount > 0;
                  const galleryIndex = index + 1;
                  return (
                    <button
                      key={`${item.src}-${galleryIndex}`}
                      type="button"
                      onClick={() => setLightboxIndex(galleryIndex)}
                      aria-label={p(item.alt)}
                      className="group relative block overflow-hidden rounded-xl text-start"
                    >
                      <Img
                        src={item.src}
                        alt={p(item.alt)}
                        className="aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      {isLastVisible && (
                        <span className="absolute inset-0 grid place-items-center bg-black/65 text-2xl font-bold text-white sm:text-3xl">
                          +{remainingCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <SampleBadge item={a} />
            {a.category && <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{t(`activities.cats.${a.category}`)}</span>}
          </div>

          <p className="lead mt-5 border-s-4 border-primary ps-4 text-lg font-bold !text-ink sm:text-xl" dir="auto">
            {p(a.summary)}
          </p>

          <div className="mt-6 grid gap-5 text-base leading-8 text-ink/85 sm:text-[1.05rem]">
            {(Array.isArray(body) ? body : [body]).map((para, i) => <p key={i} dir="auto">{para}</p>)}
          </div>
          {lang !== 'ar' && a.body && !a.body[lang] && <p className="mt-6 text-sm text-muted">{t('common.arabicOnly')}</p>}

          <Button to="/activities" variant="outline" className="mt-10">
            <Back className="h-4 w-4" aria-hidden="true" />
            {t('cta.allActivities')}
          </Button>
        </div>
      </article>

      {others.length > 0 && (
        <section className="section bg-surface">
          <div className="container">
            <h2 className="h-section mb-8">{t('activities.related')}</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{others.map((o) => <li key={o.id}><ActivityCard activity={o} /></li>)}</ul>
          </div>
        </section>
      )}

      {lightboxIndex !== null && <Lightbox items={gallery} index={lightboxIndex} onIndex={setLightboxIndex} onClose={() => setLightboxIndex(null)} />}
    </>
  );
}
