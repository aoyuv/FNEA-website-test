import { Link } from 'react-router-dom';
import { Send, BookOpen, CalendarDays, Phone } from 'lucide-react';
import Reveal from '../UI/Reveal';
import { useLang } from '../../i18n/LanguageContext';
import { cn } from '../../lib/utils';

const ACTIONS = [
  { key: 'submit', to: '/submit', icon: Send, primary: true },
  { key: 'guide', to: '/guide', icon: BookOpen },
  { key: 'activities', to: '/activities', icon: CalendarDays },
  { key: 'contact', to: '/contact', icon: Phone },
];

export default function QuickActions() {
  const { t } = useLang();
  return (
    <section aria-label={t('quick.title')} className="relative z-10 -mt-20 md:-mt-24">
      <div className="container">
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {ACTIONS.map(({ key, to, icon: I, primary }, i) => {
            const [title, sub] = t(`quick.${key}`);
            return (
              <Reveal as="li" key={key} delay={i * 70}>
                <Link to={to} className={cn('group flex h-full flex-col gap-3 rounded-2xl p-4 shadow-lift transition-all duration-300 ease-out hover:-translate-y-1 sm:p-5 md:flex-row md:items-center md:gap-4 md:p-6',
                  primary ? 'bg-accent text-ink' : 'bg-white text-ink border border-ink/[0.06]')}>
                  <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-300', primary ? 'bg-ink/10 text-ink' : 'bg-primary/[0.08] text-primary group-hover:bg-primary group-hover:text-white')}>
                    <I className={cn('h-6 w-6', key === 'submit' && 'rtl:-scale-x-100')} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.98rem] font-bold leading-snug sm:text-base">{title}</span>
                    <span className={cn('mt-0.5 block text-xs leading-snug sm:text-sm', primary ? 'text-ink/70' : 'text-muted')}>{sub}</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
