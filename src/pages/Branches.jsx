import { useState } from 'react';
import { Building2, GraduationCap, Home as HomeIcon, Landmark, UserRound, Phone, Mail } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import FilterTabs from '../components/UI/FilterTabs';
import Reveal from '../components/UI/Reveal';
import EmptyState from '../components/UI/EmptyState';
import SampleBadge from '../components/UI/SampleBadge';
import SocialIcon from '../components/UI/SocialIcon';
import Img from '../components/UI/Img';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

/** الفروع: public/data/branches.json — type: university | faculty | residence | institution */
const TYPES = { university: Landmark, faculty: GraduationCap, residence: HomeIcon, institution: Building2 };

export default function Branches() {
  const { t, p } = useLang();
  const { branches } = useContent();
  const [type, setType] = useState('all');
  const list = type === 'all' ? branches : branches.filter((b) => b.type === type);
  const options = [{ value: 'all', label: t('branches.all'), count: branches.length },
    ...Object.keys(TYPES).map((k) => ({ value: k, label: t(`branches.types.${k}`), count: branches.filter((b) => b.type === k).length }))];
  return (
    <>
      <PageHeader title={t('branches.title')} lead={t('branches.lead')} crumbs={[{ label: t('nav.branches') }]} />
      <section className="section">
        <div className="container">
          <FilterTabs options={options} value={type} onChange={setType} label={t('branches.title')} />
          {list.length === 0 ? <EmptyState text={t('branches.empty')} /> : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((b, i) => {
                const I = TYPES[b.type] || Building2;
                const c = b.contact || {};
                const has = c.phone || c.email || c.facebook;
                return (
                  <Reveal as="li" key={b.id} delay={(i % 3) * 60} className="card flex flex-col overflow-hidden">
                    {b.image && <Img src={b.image} alt={p(b.name)} className="aspect-[16/9] w-full" />}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/[0.07] text-primary"><I className="h-6 w-6" aria-hidden="true" /></span>
                        <SampleBadge item={b} />
                      </div>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">{t(`branches.types.${b.type}`)}</p>
                      <h2 className="mt-1 font-body text-lg font-bold text-ink">{p(b.name)}</h2>
                      <p className="text-sm text-muted">{p(b.institution)}</p>
                      <dl className="mt-4 grid gap-2 border-t border-ink/[0.07] pt-4 text-sm">
                        <div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-muted" aria-hidden="true" /><dt className="sr-only">{t('branches.manager')}</dt><dd>{p(b.manager)}</dd></div>
                        <div className="flex flex-wrap items-center gap-2">
                          <dt className="sr-only">{t('branches.contact')}</dt>
                          {has ? <>
                            {c.phone && <dd><a href={`tel:${c.phone.replace(/\s/g, '')}`} className="inline-flex min-h-[40px] items-center gap-1.5 text-primary hover:underline" dir="ltr"><Phone className="h-4 w-4" aria-hidden="true" />{c.phone}</a></dd>}
                            {c.email && <dd><a href={`mailto:${c.email}`} className="inline-flex min-h-[40px] items-center gap-1.5 text-primary hover:underline"><Mail className="h-4 w-4" aria-hidden="true" />{c.email}</a></dd>}
                            {c.facebook && <dd><a href={c.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1.5 text-primary hover:underline"><SocialIcon name="facebook" className="h-4 w-4" />Facebook</a></dd>}
                          </> : <dd className="text-muted">{t('branches.noContact')}</dd>}
                        </div>
                      </dl>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
