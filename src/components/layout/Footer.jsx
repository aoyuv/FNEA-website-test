import { Link } from 'react-router-dom';
import Logo from './Logo';
import SocialIcon from '../UI/SocialIcon';
import { FOOTER_NAV, MORE_NAV, SOCIAL_KEYS } from '../../lib/navigation';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';

export default function Footer() {
  const { t, p } = useLang();
  const { siteConfig } = useContent();
  const socials = SOCIAL_KEYS.filter((k) => siteConfig.social?.[k]);
  const { email, phone } = siteConfig.contact || {};
  return (
    <footer className="relative bg-primary-dark pattern-stars text-white/80">
      <div className="h-1 bg-accent" aria-hidden="true" />
      <div className="container grid gap-10 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <Link to="/" aria-label={t('nav.home')} className="inline-block"><Logo light /></Link>
          <p className="mt-5 font-display text-lg font-bold text-white">{p(siteConfig.orgName)}</p>
          <p className="mt-2 max-w-sm text-sm text-white/70">{p(siteConfig.orgFullName)}</p>
          <p className="mt-1 max-w-sm text-sm text-white/70">{t('footer.tagline')}</p>
          {socials.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-white">{t('footer.follow')}</p>
              <ul className="flex gap-2">
                {socials.map((k) => (
                  <li key={k}><a href={siteConfig.social[k]} target="_blank" rel="noopener noreferrer" aria-label={t(`contact.channels.${k}`)}
                    className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-accent hover:text-ink"><SocialIcon name={k} /></a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="md:col-span-4">
          <p className="mb-4 text-sm font-semibold text-white">{t('footer.links')}</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {FOOTER_NAV.map((l) => <li key={l.key}><Link to={l.to} className="inline-flex min-h-[40px] items-center text-sm hover:text-accent">{t(`nav.${l.key}`)}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="mb-4 text-sm font-semibold text-white">{t('footer.more')}</p>
          <ul className="grid gap-1">
            {MORE_NAV.map((l) => <li key={l.key}><Link to={l.to} className="inline-flex min-h-[40px] items-center text-sm hover:text-accent">{t(`nav.${l.key}`)}</Link></li>)}
            <li><Link to="/submit" className="inline-flex min-h-[40px] items-center text-sm font-semibold text-accent hover:underline">{t('cta.submit')}</Link></li>
          </ul>
          {(email || phone) && (
            <ul className="mt-4 grid gap-1 text-sm" dir="ltr">
              {email && <li><a href={`mailto:${email}`} className="hover:text-accent">{email}</a></li>}
              {phone && <li><a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-accent">{phone}</a></li>}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>{t('footer.rights')} {new Date().getFullYear()}</p>
          <p dir="ltr">Fédération Nationale des Étudiants Algériens – Ouargla</p>
        </div>
      </div>
    </footer>
  );
}
