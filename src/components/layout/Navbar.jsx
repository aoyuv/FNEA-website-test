import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Send, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import Button from '../UI/Button';
import { MAIN_NAV, MORE_NAV } from '../../lib/navigation';
import { useLang } from '../../i18n/LanguageContext';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { t } = useLang();
  const { dark, toggle } = useTheme();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); setMoreOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && (setOpen(false), setMoreOpen(false));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  useEffect(() => {
    const close = (e) => moreRef.current && !moreRef.current.contains(e.target) && setMoreOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const solid = scrolled || open;
  const linkCls = ({ isActive }) => cn(
    'relative rounded-lg px-2.5 py-2 text-[0.92rem] font-medium transition-colors whitespace-nowrap',
    solid ? (isActive ? 'text-primary' : 'text-ink/80 hover:text-primary dark:text-slate-200 dark:hover:text-emerald-300') : (isActive ? 'text-white' : 'text-white/80 hover:text-white'),
    isActive && 'after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent'
  );

  return (
    <>
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out', solid ? 'bg-white/95 dark:bg-[#111a22]/95 shadow-[0_1px_0_rgb(19_32_26/0.08),0_8px_24px_-16px_rgb(19_32_26/0.25)] backdrop-blur-md' : 'bg-transparent')}>
      <nav aria-label="main" className="container flex h-[var(--nav-h)] items-center justify-between gap-3">
        <Link to="/" className="shrink-0 rounded-lg" aria-label={t('nav.home')}><Logo light={!solid} /></Link>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {MAIN_NAV.map((l) => <li key={l.key}><NavLink to={l.to} end={l.to === '/'} className={linkCls}>{t(`nav.${l.key}`)}</NavLink></li>)}
          <li ref={moreRef} className="relative">
            <button type="button" onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen} aria-haspopup="true"
              className={cn('flex items-center gap-1 rounded-lg px-2.5 py-2 text-[0.92rem] font-medium', solid ? 'text-ink/80 hover:text-primary dark:text-slate-200 dark:hover:text-emerald-300' : 'text-white/80 hover:text-white')}>
              {t('nav.more')}<ChevronDown className={cn('h-4 w-4 transition-transform', moreOpen && 'rotate-180')} aria-hidden="true" />
            </button>
            {moreOpen && (
              <ul className="fade-in absolute end-0 top-full mt-2 w-48 rounded-xl border border-ink/10 bg-white p-1 shadow-lift dark:border-white/10 dark:bg-[#17222c]">
                {MORE_NAV.map((l) => <li key={l.key}><Link to={l.to} className="block rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-surface hover:text-primary dark:text-slate-100 dark:hover:bg-white/10">{t(`nav.${l.key}`)}</Link></li>)}
              </ul>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'الوضع الفاتح' : 'الوضع الداكن'} className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors', solid ? 'text-ink hover:bg-ink/5 dark:text-slate-100 dark:hover:bg-white/10' : 'text-white hover:bg-white/10')}><span className="sr-only">{dark ? 'Light mode' : 'Dark mode'}</span>{dark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}</button>
          <div className="hidden sm:block"><LanguageSwitcher light={!solid} /></div>
          <Button to="/submit" variant={solid ? 'primary' : 'accent'} size="sm" className="hidden md:inline-flex !min-h-[44px] whitespace-nowrap" aria-label={t('cta.submit')}>
            <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />{t('cta.submitShort')}
          </Button>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t('nav.close') : t('nav.menu')}
            className={cn('grid h-11 w-11 place-items-center rounded-xl xl:hidden transition-colors', solid ? 'text-ink hover:bg-ink/5' : 'text-white hover:bg-white/10')}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
    </header>

      {/* قائمة الهاتف — خارج الـ header لأن backdrop-blur يكسر position:fixed للأبناء */}
      <div id="mobile-menu" className={cn('fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-[45] overflow-y-auto bg-white transition-all dark:bg-[#111a22] duration-300 ease-out xl:hidden', open ? 'visible opacity-100' : 'invisible opacity-0 -translate-y-2')}>
        <div className="container flex min-h-full flex-col gap-6 py-6">
          <ul className="grid gap-1">
            {[...MAIN_NAV, ...MORE_NAV].map((l, i) => (
              <li key={l.key} style={{ transitionDelay: open ? `${i * 25}ms` : '0ms' }} className={cn('transition-all duration-300', open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2')}>
                <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => cn('flex min-h-[52px] items-center rounded-xl px-4 text-[1.05rem] font-semibold', isActive ? 'bg-primary/[0.07] text-primary dark:bg-emerald-400/10 dark:text-emerald-300' : 'text-ink hover:bg-surface dark:text-slate-100 dark:hover:bg-white/10')}>
                  {t(`nav.${l.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-4 border-t border-ink/10 pt-6 dark:border-white/10">
            <LanguageSwitcher inline />
            <Button to="/submit" size="lg" className="w-full"><Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />{t('cta.submit')}</Button>
          </div>
        </div>
      </div>
    </>
  );
}
