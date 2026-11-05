import { MapPin, Clock, Send } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import Reveal from '../components/UI/Reveal';
import Button from '../components/UI/Button';
import SocialIcon from '../components/UI/SocialIcon';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';
import { cn } from '../lib/utils';

/** كل بيانات التواصل في public/data/site-config.json → contact و social */
export default function Contact() {
  const { t, p } = useLang();
  const { siteConfig } = useContent();
  const { contact = {}, social = {} } = siteConfig;
  const wa = (contact.whatsapp || '').replace(/[^\d]/g, '');
  const channels = [
    { key: 'facebook', value: social.facebook, href: social.facebook },
    { key: 'instagram', value: social.instagram, href: social.instagram },
    { key: 'tiktok', value: social.tiktok, href: social.tiktok },
    { key: 'email', value: contact.email, href: contact.email && `mailto:${contact.email}` },
    { key: 'whatsapp', value: contact.whatsapp, href: wa && `https://wa.me/${wa}` },
    { key: 'phone', value: contact.phone, href: contact.phone && `tel:${contact.phone.replace(/\s/g, '')}` },
  ];
  const display = (k, v) => (!v ? '' : ['facebook', 'instagram', 'tiktok'].includes(k) ? v.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : v);
  return (
    <>
      <PageHeader title={t('contact.title')} lead={t('contact.lead')} crumbs={[{ label: t('nav.contact') }]} />
      <section className="section">
        <div className="container">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((c, i) => {
              const active = Boolean(c.href);
              const body = (
                <>
                  <span className={cn('grid h-14 w-14 shrink-0 place-items-center rounded-2xl transition-colors', active ? 'bg-primary text-white group-hover:bg-accent group-hover:text-ink' : 'bg-surface text-muted')}><SocialIcon name={c.key} className="h-6 w-6" /></span>
                  <span className="min-w-0">
                    <span className="block font-bold text-ink">{t(`contact.channels.${c.key}`)}</span>
                    <span className={cn('block truncate text-sm', active ? 'text-primary' : 'text-muted')} dir={active ? 'ltr' : undefined}>{active ? display(c.key, c.value) : t('contact.soon')}</span>
                  </span>
                </>
              );
              const external = /^https?:/.test(c.href || '');
              return (
                <Reveal as="li" key={c.key} delay={(i % 3) * 60}>
                  {active
                    ? <a href={c.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="card group flex min-h-[96px] items-center gap-4 p-5 transition-all hover:-translate-y-1 hover:shadow-lift">{body}</a>
                    : <div className="card flex min-h-[96px] items-center gap-4 border-dashed p-5 opacity-80">{body}</div>}
                </Reveal>
              );
            })}
          </ul>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.6fr]">
            <Reveal className="card flex flex-col gap-5 p-6 md:p-8">
              <div className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><p className="font-bold">{t('contact.address')}</p><p className="text-muted">{p(contact.address) || t('contact.soon')}</p></div></div>
              <div className="flex gap-3"><Clock className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><p className="font-bold">{t('contact.hours')}</p><p className="text-muted">{p(contact.officeHours) || t('contact.soon')}</p></div></div>
              <Button to="/submit" className="mt-auto w-full"><Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />{t('cta.submit')}</Button>
            </Reveal>
            <Reveal delay={80} className="overflow-hidden rounded-2xl border border-ink/[0.07]">
              {contact.mapEmbedUrl
                ? <iframe title={t('contact.address')} src={contact.mapEmbedUrl} className="h-[360px] w-full border-0 md:h-full md:min-h-[360px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                : <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 bg-surface pattern-stars-dark p-8 text-center text-muted"><MapPin className="h-10 w-10 text-primary/40" aria-hidden="true" /><p>{t('contact.mapSoon')}</p></div>}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
