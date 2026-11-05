import SectionHeading from '../UI/SectionHeading';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import MemberCard from '../cards/MemberCard';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';

export default function TeamPreview() {
  const { t } = useLang();
  const { members } = useContent();
  return (
    <section id="team" className="section">
      <div className="container">
        <SectionHeading eyebrow={t('team.eyebrow')} title={t('team.title')} lead={t('team.lead')} action={<Button to="/team" variant="outline">{t('cta.fullTeam')}</Button>} />
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {members.slice(0, 4).map((m, i) => <Reveal as="li" key={m.id} delay={i * 70}><MemberCard member={m} /></Reveal>)}
        </ul>
      </div>
    </section>
  );
}
