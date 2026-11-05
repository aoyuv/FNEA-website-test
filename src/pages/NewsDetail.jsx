import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Share2, CalendarDays } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import Img from '../components/UI/Img';
import Button from '../components/UI/Button';
import SampleBadge from '../components/UI/SampleBadge';
import SocialIcon from '../components/UI/SocialIcon';
import NewsCard from '../components/cards/NewsCard';
import NotFound from './NotFound';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';
import { formatDate } from '../lib/utils';

export default function NewsDetail() {
  const { id } = useParams();
  const { t, p, lang, dir } = useLang();
  const { news } = useContent();
  const [copied, setCopied] = useState(false);
  const n = news.find((x) => x.id === id);
  if (!n) return <NotFound title={t('news.notFound')} />;
  const body = p(n.body) || [];
  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft;
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: p(n.title), url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch { /* ignored */ }
  };
  return (
    <>
      <PageHeader title={p(n.title)} crumbs={[{ label: t('nav.news'), to: '/news' }, { label: p(n.title) }]}>
        <p className="hero-in mt-4 inline-flex items-center gap-2 text-white/85" style={{ '--d': '120ms' }}>
          <CalendarDays className="h-5 w-5 text-accent" aria-hidden="true" /><time dateTime={n.date}>{formatDate(n.date, lang)}</time>
          {p(n.category) && <><span aria-hidden="true">•</span>{p(n.category)}</>}
        </p>
      </PageHeader>
      <article className="section">
        <div className="container max-w-3xl">
          <Img src={n.image} alt={p(n.title)} eager className="aspect-[16/9] w-full rounded-2xl shadow-lift" />
          <div className="mt-8"><SampleBadge item={n} /></div>
          <p className="lead mt-4 font-semibold !text-ink" dir="auto">{p(n.summary)}</p>
          <div className="mt-4 grid gap-4 text-ink/85">{(Array.isArray(body) ? body : [body]).map((para, i) => <p key={i} dir="auto">{para}</p>)}</div>
          {lang !== 'ar' && n.body && !n.body[lang] && <p className="mt-6 text-sm text-muted">{t('common.arabicOnly')}</p>}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6">
            <Button onClick={share} variant="outline"><Share2 className="h-4 w-4" aria-hidden="true" />{copied ? t('news.copied') : t('news.share')}</Button>
            <Button href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} variant="outline" aria-label="Facebook"><SocialIcon name="facebook" className="h-4 w-4" />Facebook</Button>
            <Button href={`https://wa.me/?text=${encodeURIComponent(p(n.title) + ' ' + url)}`} variant="outline" aria-label="WhatsApp"><SocialIcon name="whatsapp" className="h-4 w-4" />WhatsApp</Button>
            <Button to="/news" variant="link" className="ms-auto"><Back className="h-4 w-4" aria-hidden="true" />{t('cta.allNews')}</Button>
          </div>
        </div>
      </article>
      <section className="section bg-surface">
        <div className="container">
          <h2 className="h-section mb-8">{t('news.related')}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{news.filter((x) => x.id !== id).slice(0, 3).map((o) => <li key={o.id}><NewsCard item={o} /></li>)}</ul>
        </div>
      </section>
    </>
  );
}
