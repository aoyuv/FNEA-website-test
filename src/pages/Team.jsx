import PageHeader from '../components/UI/PageHeader';
import Reveal from '../components/UI/Reveal';
import MemberCard from '../components/cards/MemberCard';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

/** الأعضاء: public/data/members.json — الصور: public/images/members/ */
export default function Team() {
  const { t } = useLang();
  const { members } = useContent();
  return (
    <>
      <PageHeader title={t('team.title')} lead={t('team.pageLead')} crumbs={[{ label: t('nav.team') }]} />
      <section className="section">
        <div className="container">
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {members.map((m, i) => <Reveal as="li" key={m.id} delay={(i % 4) * 60}><MemberCard member={m} /></Reveal>)}
          </ul>
        </div>
      </section>
    </>
  );
}
