import SectionHeading from '../UI/SectionHeading';
import Reveal from '../UI/Reveal';
import ServiceCard from '../cards/ServiceCard';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';

/** الخدمات تُعدَّل من public/data/services.json */
export default function Services({ showHeading = true }) {
  const { t } = useLang();
  const { services } = useContent();
  return (
    <section id="services" className="section bg-surface">
      <div className="container">
        {showHeading && <SectionHeading eyebrow={t('services.eyebrow')} title={t('services.title')} lead={t('services.lead')} />}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {services.map((s, i) => <Reveal as="li" key={s.id} delay={(i % 3) * 80}><ServiceCard service={s} /></Reveal>)}
        </ul>
      </div>
    </section>
  );
}
