import { MessageCircle, Send } from 'lucide-react';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import SocialIcon from '../UI/SocialIcon';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';
import { SOCIAL_KEYS } from '../../lib/navigation';

export default function ContactCTA() {
  const { t } = useLang();
  const { siteConfig } = useContent();
  const socials = SOCIAL_KEYS.filter((k) => siteConfig.social?.[k]);
  return (
    <section id="contact-cta" className="pb-16 md:pb-24">
      <div className="container">
        <Reveal className="card flex flex-col items-start gap-6 p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <h2 className="h-section !text-[clamp(1.4rem,1.1rem+1.2vw,2rem)]">{t('contact.ctaTitle')}</h2>
            <p className="lead mt-2">{t('contact.ctaText')}</p>
            {socials.length > 0 && (
              <ul className="mt-4 flex gap-2">
                {socials.map((k) => <li key={k}><a href={siteConfig.social[k]} target="_blank" rel="noopener noreferrer" aria-label={t(`contact.channels.${k}`)} className="grid h-11 w-11 place-items-center rounded-xl bg-primary/[0.07] text-primary hover:bg-primary hover:text-white"><SocialIcon name={k} /></a></li>)}
              </ul>
            )}
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button to="/contact" variant="outline" size="lg"><MessageCircle className="h-5 w-5" aria-hidden="true" />{t('cta.contact')}</Button>
            <Button to="/submit" size="lg"><Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />{t('cta.submit')}</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
