import SectionHeading from '../UI/SectionHeading';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import ActivityCard from '../cards/ActivityCard';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';

export default function ActivitiesPreview() {
  const { t } = useLang();
  const { activities } = useContent();
  return (
    <section id="activities" className="section bg-surface transition-colors duration-300">
      <div className="container">
        <SectionHeading eyebrow={t('activities.eyebrow')} title={t('activities.title')} lead={t('activities.lead')}
          action={<Button to="/activities" variant="outline">{t('cta.allActivities')}</Button>} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {activities.slice(0, 3).map((a, i) => <Reveal as="li" key={a.id} delay={i * 80}><ActivityCard activity={a} /></Reveal>)}
        </ul>
      </div>
    </section>
  );
}
