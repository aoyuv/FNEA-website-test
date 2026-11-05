import { Send } from 'lucide-react';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import { useLang } from '../../i18n/LanguageContext';

export default function ConcernCTA() {
  const { t } = useLang();
  const steps = t('concern.steps');
  return (
    <section id="concerns" className="section">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-primary pattern-stars px-6 py-12 text-white md:px-14 md:py-16">
          <div className="absolute -top-24 end-[-6rem] h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="font-display font-bold !text-white" style={{ fontSize: 'clamp(1.6rem, 1.1rem + 2vw, 2.6rem)' }}>{t('concern.title')}</h2>
              <p className="mt-4 max-w-xl text-white/85 md:text-lg">{t('concern.text')}</p>
              <Button to="/submit" variant="accent" size="lg" className="mt-8 w-full sm:w-auto sm:px-10 text-lg">
                <Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />{t('cta.submit')}
              </Button>
            </div>
            <ol className="grid gap-3">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent font-display font-bold text-ink tabular-nums">{i + 1}</span>
                  <span className="font-semibold">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
