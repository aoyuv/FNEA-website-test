import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import Img from '../UI/Img';
import Icon from '../UI/Icon';
import { useLang } from '../../i18n/LanguageContext';

// كل عنصر يفتح القسم المطابق في دليل الطالب (/guide#id)
const LINKS = [
  ['lmd', 'Layers'], ['cours', 'Presentation'], ['average', 'Calculator'], ['compensation', 'Scale'], ['rattrapage', 'RotateCcw'],
  ['registration', 'ClipboardList'], ['scholarship', 'Wallet'], ['housing', 'BedDouble'], ['transport', 'Bus'], ['mistakes', 'TriangleAlert'],
];

export default function NewStudents() {
  const { t, dir } = useLang();
  const items = t('newStudents.items');
  const Chev = dir === 'rtl' ? ChevronLeft : ChevronRight;
  return (
    <section id="new-students" className="section relative overflow-hidden bg-surface pattern-stars-dark">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
        <Reveal className="flex flex-col">
          <p className="eyebrow mb-3">{t('newStudents.eyebrow')}</p>
          <h2 className="h-section">{t('newStudents.title')}</h2>
          <p className="lead mt-3">{t('newStudents.lead')}</p>
          <Img src="/images/guide.webp" alt={t('guide.title')} className="mt-8 hidden aspect-[4/3] w-full rounded-2xl shadow-card lg:block" />
          <Button to="/guide" size="lg" className="mt-8 self-start"><BookOpen className="h-5 w-5" aria-hidden="true" />{t('cta.guide')}</Button>
        </Reveal>
        <ul className="grid content-start gap-3 sm:grid-cols-2">
          {LINKS.map(([id, icon], i) => (
            <Reveal as="li" key={id} delay={(i % 4) * 50}>
              <Link to={`/guide#${id}`} className="group flex min-h-[64px] items-center gap-3 rounded-2xl border border-ink/[0.07] bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/[0.07] text-primary transition-colors group-hover:bg-primary group-hover:text-white"><Icon name={icon} className="h-5 w-5" /></span>
                <span className="flex-1 font-semibold text-ink">{items[i]}</span>
                <Chev className="h-4 w-4 text-muted transition-transform group-hover:text-primary" aria-hidden="true" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
