import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import Img from '../UI/Img';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';

const POINTS = {
  ar: ['مرافقة الطلبة وتوجيههم', 'نقل الانشغالات ومتابعتها', 'تنظيم نشاطات علمية وثقافية ورياضية'],
  fr: ['Accompagner et orienter les étudiants', 'Transmettre et suivre les préoccupations', 'Organiser des activités scientifiques, culturelles et sportives'],
  en: ['Support and guide students', 'Convey and follow up concerns', 'Organise scientific, cultural and sports activities'],
};

/** صورة القسم: site-config.json → about.image */
export default function AboutPreview() {
  const { t, p, lang, dir } = useLang();
  const { siteConfig } = useContent();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  return (
    <section id="about" className="section">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-2 lg:order-1">
          <div className="absolute -inset-2 rounded-[1.5rem] border-2 border-accent/60 md:-inset-4 md:translate-x-4 md:translate-y-4 md:rtl:-translate-x-4" aria-hidden="true" />
          <Img src={siteConfig.about.image} alt={t('about.eyebrow')} className="relative aspect-[4/3] w-full rounded-2xl shadow-lift" />
        </Reveal>
        <Reveal delay={100} className="order-1 lg:order-2">
          <p className="eyebrow mb-3">{t('about.eyebrow')}</p>
          <h2 className="h-section">{t('about.title')}</h2>
          <p className="lead mt-4">{p(siteConfig.about.short)}</p>
          <ul className="mt-6 grid gap-3">
            {(POINTS[lang] || POINTS.ar).map((pt) => (
              <li key={pt} className="flex items-start gap-3 text-ink">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Check className="h-4 w-4" aria-hidden="true" /></span>{pt}
              </li>
            ))}
          </ul>
          <Button to="/about" variant="primary" className="mt-8">{t('cta.learnMore')}<Arrow className="h-4 w-4" aria-hidden="true" /></Button>
        </Reveal>
      </div>
    </section>
  );
}
