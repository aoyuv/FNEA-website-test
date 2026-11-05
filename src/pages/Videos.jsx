import { useState } from 'react';
import { Play, ExternalLink, X, Clock } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import Reveal from '../components/UI/Reveal';
import Img from '../components/UI/Img';
import SocialIcon from '../components/UI/SocialIcon';
import SampleBadge from '../components/UI/SampleBadge';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

/** يستخرج معرّف فيديو YouTube من أي شكل رابط */
export const youtubeId = (url = '') => (url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
const PLATFORM = { youtube: 'YouTube', facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok' };

/** الفيديوهات: public/data/videos.json */
export default function Videos() {
  const { t, p } = useLang();
  const { videos } = useContent();
  const [playing, setPlaying] = useState(null);
  return (
    <>
      <PageHeader title={t('videos.title')} lead={t('videos.lead')} crumbs={[{ label: t('nav.videos') }]} />
      <section className="section">
        <div className="container">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.videos.map((v, i) => {
              const yt = v.platform === 'youtube' && youtubeId(v.url);
              const thumb = v.thumbnail || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : '');
              const soon = !v.url;
              const inner = (
                <>
                  <div className="relative aspect-video overflow-hidden">
                    <Img src={thumb} alt={p(v.title)} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 grid place-items-center bg-primary-dark/35">
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-primary shadow-lift transition-transform duration-300 group-hover:scale-110">
                        {soon ? <Clock className="h-7 w-7" aria-hidden="true" /> : yt ? <Play className="h-7 w-7 translate-x-0.5 fill-current" aria-hidden="true" /> : <ExternalLink className="h-6 w-6" aria-hidden="true" />}
                      </span>
                    </span>
                    <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-ink"><SocialIcon name={v.platform} className="h-3.5 w-3.5" />{PLATFORM[v.platform]}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <h2 className="font-body text-base font-bold text-ink">{p(v.title)}</h2>
                    {soon ? <span className="shrink-0 rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-muted">{t('videos.soon')}</span> : <SampleBadge item={v} />}
                  </div>
                </>
              );
              return (
                <Reveal as="li" key={v.id} delay={(i % 3) * 70}>
                  {soon ? <div className="card group overflow-hidden" aria-disabled="true">{inner}</div>
                    : yt ? <button type="button" onClick={() => setPlaying(yt)} className="card group block w-full overflow-hidden text-start transition-all hover:-translate-y-1 hover:shadow-lift" aria-label={`${t('videos.watch')}: ${p(v.title)}`}>{inner}</button>
                    : <a href={v.url} target="_blank" rel="noopener noreferrer" className="card group block overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lift" aria-label={`${t('videos.openOn')} ${PLATFORM[v.platform]}: ${p(v.title)}`}>{inner}</a>}
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
      {playing && (
        <div role="dialog" aria-modal="true" className="fade-in fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4" onClick={() => setPlaying(null)}>
          <button onClick={() => setPlaying(null)} aria-label={t('nav.close')} className="absolute end-3 top-3 grid h-12 w-12 place-items-center rounded-full text-white hover:bg-white/10"><X className="h-6 w-6" /></button>
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black" onClick={(e) => e.stopPropagation()}>
            <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${playing}?autoplay=1`} title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
    </>
  );
}
