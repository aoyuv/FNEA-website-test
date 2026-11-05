import { useState } from 'react';
import { Expand } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import FilterTabs from '../components/UI/FilterTabs';
import Img from '../components/UI/Img';
import Lightbox from '../components/UI/Lightbox';
import EmptyState from '../components/UI/EmptyState';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

/** الصور: public/images/gallery/ + سطر في public/data/gallery.json (بدون إعادة بناء الموقع) */
export default function Gallery() {
  const { t, p } = useLang();
  const { gallery } = useContent();
  const [cat, setCat] = useState('all');
  const [idx, setIdx] = useState(null);
  const list = cat === 'all' ? gallery.photos : gallery.photos.filter((x) => x.category === cat);
  const options = [{ value: 'all', label: t('gallery.all'), count: gallery.photos.length },
    ...gallery.categories.map((c) => ({ value: c, label: t(`gallery.cats.${c}`), count: gallery.photos.filter((x) => x.category === c).length }))];
  return (
    <>
      <PageHeader title={t('gallery.title')} lead={t('gallery.lead')} crumbs={[{ label: t('nav.gallery') }]} />
      <section className="section">
        <div className="container">
          <FilterTabs options={options} value={cat} onChange={(v) => { setCat(v); setIdx(null); }} label={t('gallery.title')} />
          {list.length === 0 ? <EmptyState text={t('gallery.empty')} /> : (
            <ul className="columns-2 gap-3 md:columns-3 md:gap-4 [&>li]:mb-3 md:[&>li]:mb-4">
              {list.map((ph, i) => (
                <li key={ph.id} className="fade-in break-inside-avoid">
                  <button type="button" onClick={() => setIdx(i)} aria-label={p(ph.alt)} className="group relative block w-full overflow-hidden rounded-2xl">
                    <Img src={ph.src} alt={p(ph.alt)} className={`w-full transition-transform duration-700 ease-out group-hover:scale-105 ${i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
                    <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-primary-dark/70 via-transparent to-transparent p-3 text-start text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs backdrop-blur-sm">{t(`gallery.cats.${ph.category}`)}</span><Expand className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {idx !== null && <Lightbox items={list} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} />}
    </>
  );
}
