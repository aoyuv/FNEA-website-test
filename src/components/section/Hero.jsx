import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import Button from '../UI/Button';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';
import { asset } from '../../lib/utils';

/** صورة الخلفية: site-config.json → hero.image (افتراضيًا /images/hero.webp) */
export default function Hero() {
  const { t, p, dir } = useLang();
  const { siteConfig } = useContent();
  const hero = siteConfig.hero;
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-primary-dark pb-28 pt-[calc(var(--nav-h)+3rem)] md:min-h-[88vh] md:items-center md:pb-36">
      <img src={asset(hero.image)} alt="" aria-hidden="true" fetchpriority="high" className="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover object-[35%_center]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-dark via-primary-dark/75 to-primary-dark/30 md:bg-none" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 hidden md:block ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary-dark/95 via-primary-dark/70 to-primary-dark/10" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-40 bg-gradient-to-t from-primary-dark/60 to-transparent md:block" aria-hidden="true" />

      <div className="container">
        <div className="max-w-2xl">
          <p className="hero-in mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm" dir="ltr">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />Fédération Nationale des Étudiants Algériens
          </p>
          <h1 id="hero-title" className="hero-in font-display font-extrabold leading-[1.25] !text-white" style={{ '--d': '80ms', fontSize: 'clamp(2rem, 1.2rem + 3.6vw, 3.75rem)' }}>
            {p(hero.title)}
          </h1>
          <p className="hero-in mt-4 font-display font-semibold text-accent" style={{ '--d': '160ms', fontSize: 'clamp(1.1rem, 1rem + .7vw, 1.5rem)' }}>{p(hero.slogan)}</p>
          <p className="hero-in mt-4 max-w-xl text-white/85" style={{ '--d': '240ms', fontSize: 'clamp(1rem, .95rem + .3vw, 1.15rem)' }}>{p(hero.description)}</p>
          <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ '--d': '320ms' }}>
            <Button to="/about" variant="accent" size="lg">{t('cta.discover')}<Arrow className="h-5 w-5" aria-hidden="true" /></Button>
            <Button to="/contact" variant="ghostLight" size="lg"><MessageCircle className="h-5 w-5" aria-hidden="true" />{t('cta.contact')}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
