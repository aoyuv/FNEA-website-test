import { useState } from 'react';
import { Expand } from 'lucide-react';
import SectionHeading from '../UI/SectionHeading';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import Img from '../UI/Img';
import Lightbox from '../UI/Lightbox';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';
import { cn } from '../../lib/utils';

export default function GalleryPreview() {
  const { t, p } = useLang();
  const { gallery } = useContent();
  const photos = gallery.photos.slice(0, 5);
  const [idx, setIdx] = useState(null);
  return (
    <section id="gallery" className="section bg-surface">
      <div className="container">
        <SectionHeading eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} lead={t('gallery.lead')} action={<Button to="/gallery" variant="outline">{t('cta.fullGallery')}</Button>} />
        <Reveal className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          {photos.map((ph, i) => (
            <button key={ph.id} type="button" onClick={() => setIdx(i)} aria-label={p(ph.alt)}
              className={cn('group relative overflow-hidden rounded-2xl', i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square')}>
              <Img src={ph.src} alt={p(ph.alt)} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
              <span className="absolute inset-0 grid place-items-center bg-primary-dark/0 text-white opacity-0 transition-all duration-300 group-hover:bg-primary-dark/40 group-hover:opacity-100"><Expand className="h-7 w-7" aria-hidden="true" /></span>
            </button>
          ))}
        </Reveal>
      </div>
      {idx !== null && <Lightbox items={photos} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} />}
    </section>
  );
}
