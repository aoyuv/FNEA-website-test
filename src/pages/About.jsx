import { HeartHandshake, Megaphone, Lightbulb, ShieldCheck, Users, GitBranch } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import Reveal from '../components/UI/Reveal';
import Img from '../components/UI/Img';
import Button from '../components/UI/Button';
import ContactCTA from '../components/section/ContactCTA';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

// نصوص صفحة "من نحن" — عدّلها هنا أو انقلها إلى JSON إذا أردت
const CONTENT = {
  ar: {
    mission: 'نسعى إلى أن نكون حلقة وصل فعّالة بين الطلبة والإدارة، وأن نرافق الطالب في مساره الجامعي من التسجيل إلى التخرج، مع تشجيع روح المبادرة والتطوع والمشاركة في الحياة الجامعية.',
    values: [['الاستماع', 'نصغي لانشغالات الطلبة ونتعامل معها بجدية واحترام.'], ['التمثيل', 'نحمل صوت الطالب إلى الجهات المعنية بمسؤولية.'], ['المبادرة', 'نشجّع الأفكار والمشاريع الطلابية ونساعد على تجسيدها.'], ['التنظيم', 'نعمل بروح الفريق وبشفافية ووضوح.']],
    what: ['استقبال وتوجيه الطلبة الجدد', 'جمع الانشغالات البيداغوجية والاجتماعية ومتابعتها', 'تنظيم أيام توجيهية ولقاءات بيداغوجية', 'حملات تحسيسية وتطوعية', 'أنشطة ثقافية وعلمية ورياضية', 'التواصل الدائم عبر الفروع والشبكات الاجتماعية'],
  },
  fr: {
    mission: "Être un lien efficace entre les étudiants et l'administration, accompagner l'étudiant de l'inscription à l'obtention du diplôme, et encourager l'initiative, le volontariat et la participation à la vie universitaire.",
    values: [['Écoute', 'Nous prenons au sérieux les préoccupations des étudiants.'], ['Représentation', 'Nous portons la voix des étudiants avec responsabilité.'], ['Initiative', 'Nous encourageons les projets étudiants.'], ['Organisation', "Nous travaillons en équipe, avec transparence."]],
    what: ['Accueil et orientation des nouveaux étudiants', 'Recueil et suivi des préoccupations', "Journées d'orientation et rencontres pédagogiques", 'Campagnes de sensibilisation et de volontariat', 'Activités culturelles, scientifiques et sportives', 'Communication via les sections et les réseaux sociaux'],
  },
  en: {
    mission: 'To be an effective link between students and the administration, to support students from registration to graduation, and to encourage initiative, volunteering and participation in university life.',
    values: [['Listening', 'We take students’ concerns seriously.'], ['Representation', 'We carry students’ voices responsibly.'], ['Initiative', 'We encourage student projects.'], ['Organisation', 'We work as a team, transparently.']],
    what: ['Welcoming and guiding new students', 'Collecting and following up concerns', 'Orientation days and academic meetings', 'Awareness and volunteer campaigns', 'Cultural, scientific and sports activities', 'Ongoing communication through branches and social media'],
  },
};
const ICONS = [Megaphone, Users, Lightbulb, ShieldCheck];

export default function About() {
  const { t, p, lang } = useLang();
  const { siteConfig } = useContent();
  const c = CONTENT[lang] || CONTENT.ar;
  return (
    <>
      <PageHeader title={t('about.pageTitle')} lead={t('about.pageLead')} crumbs={[{ label: t('about.pageTitle') }]} />
      <section className="section">
        <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">{p(siteConfig.orgFullName)}</p>
            <h2 className="h-section">{t('about.title')}</h2>
            <p className="lead mt-4">{p(siteConfig.about.short)}</p>
            <div className="mt-8 rounded-2xl border-s-4 border-accent bg-surface p-6">
              <h3 className="font-body text-lg font-bold">{t('about.mission')}</h3>
              <p className="mt-2 text-muted">{c.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={100}><Img src={siteConfig.about.image} alt={t('about.pageTitle')} className="aspect-[4/3] w-full rounded-2xl shadow-lift" /></Reveal>
        </div>
      </section>
      <section className="section bg-surface">
        <div className="container">
          <Reveal><h2 className="h-section mb-10">{t('about.values')}</h2></Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.values.map(([title, text], i) => { const I = ICONS[i]; return (
              <Reveal as="li" key={title} delay={i * 70} className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-white"><I className="h-6 w-6" aria-hidden="true" /></span>
                <h3 className="mt-4 font-body text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-[0.95rem] text-muted">{text}</p>
              </Reveal>
            ); })}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <h2 className="h-section">{t('about.whatWeDo')}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/team" variant="primary"><Users className="h-4 w-4" aria-hidden="true" />{t('nav.team')}</Button>
              <Button to="/branches" variant="outline"><GitBranch className="h-4 w-4" aria-hidden="true" />{t('nav.branches')}</Button>
            </div>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.what.map((w, i) => (
              <Reveal as="li" key={w} delay={(i % 2) * 60} className="flex items-start gap-3 rounded-2xl border border-ink/[0.07] p-4">
                <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>{w}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <div className="pt-4"><ContactCTA /></div>
    </>
  );
}
