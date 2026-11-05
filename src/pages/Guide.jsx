import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Info, Send } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import Reveal from '../components/UI/Reveal';
import Button from '../components/UI/Button';
import Icon from '../components/UI/Icon';
import AverageCalculator from '../components/UI/AverageCalculator';
import { AccordionItem } from '../components/UI/Accordion';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';
import { cn } from '../lib/utils';

/** محتوى الدليل: public/data/guide.json */
export default function Guide() {
  const { t, p, lang } = useLang();
  const { guide } = useContent();
  const { hash } = useLocation();
  const [open, setOpen] = useState(() => new Set([hash ? hash.slice(1) : guide.sections[0].id]));

  useEffect(() => { if (hash) setOpen((s) => new Set(s).add(decodeURIComponent(hash.slice(1)))); }, [hash]);
  const toggle = (id) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allOpen = open.size === guide.sections.length;

  return (
    <>
      <PageHeader title={t('guide.title')} lead={t('guide.lead')} crumbs={[{ label: t('nav.guide') }]} />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <nav aria-label={t('guide.contents')} className="sticky top-[calc(var(--nav-h)+1.5rem)]">
              <p className="mb-3 text-sm font-bold text-ink">{t('guide.contents')}</p>
              <ol className="grid gap-0.5 border-s border-ink/10">
                {guide.sections.map((s, i) => (
                  <li key={s.id}>
                    <Link to={`/guide#${s.id}`} onClick={() => setOpen((o) => new Set(o).add(s.id))}
                      className={cn('-ms-px flex gap-2 border-s-2 py-1.5 ps-4 text-sm transition-colors', open.has(s.id) ? 'border-primary font-semibold text-primary' : 'border-transparent text-muted hover:text-ink')}>
                      <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>{p(s.title)}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <div className="min-w-0">
            <Reveal className="mb-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-ink">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><p>{p(guide.disclaimer)}{lang !== 'ar' && <> — {t('common.arabicOnly')}</>}</p>
            </Reveal>
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(guide.sections.map((s) => s.id)))} className="min-h-[44px] rounded-xl px-3 text-sm font-semibold text-primary hover:bg-primary/5">
                {allOpen ? t('guide.collapseAll') : t('guide.expandAll')}
              </button>
            </div>
            <div className="grid gap-3" dir="rtl">
              {guide.sections.map((s, i) => (
                <AccordionItem key={s.id} id={s.id} open={open.has(s.id)} onToggle={() => toggle(s.id)} icon={<Icon name={s.icon} className="h-5 w-5" />}
                  title={<span className="flex items-baseline gap-2"><span className="text-sm tabular-nums text-muted">{i + 1}.</span>{p(s.title)}</span>}>
                  <div className="grid gap-3 text-ink/80">
                    {s.content.map((b, j) => b.p ? <p key={j}>{b.p}</p>
                      : b.list ? <ul key={j} className="grid gap-2">{b.list.map((li) => <li key={li} className="flex gap-2.5"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />{li}</li>)}</ul>
                      : b.calculator ? <AverageCalculator key={j} /> : null)}
                  </div>
                </AccordionItem>
              ))}
            </div>
            <Reveal className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-primary p-6 text-white sm:flex-row sm:items-center sm:justify-between md:p-8">
              <div><p className="font-display text-xl font-bold">{t('guide.stillQuestion')}</p><p className="mt-1 text-white/80">{t('guide.stillText')}</p></div>
              <Button to="/submit?category=pedagogy" variant="accent"><Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />{t('cta.submit')}</Button>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
