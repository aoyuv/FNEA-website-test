import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Icon from '../UI/Icon';
import { useLang } from '../../i18n/LanguageContext';

export default function ServiceCard({ service }) {
  const { p, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  return (
    <article className="card group relative flex h-full flex-col p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lift md:p-7">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/[0.07] text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        <Icon name={service.icon} className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 font-body text-lg font-bold text-ink">{p(service.title)}</h3>
      <p className="mt-2 flex-1 text-[0.95rem] text-muted">{p(service.description)}</p>
      <Link to={service.link} className="mt-5 inline-flex min-h-[44px] items-center gap-2 self-start text-sm font-semibold text-primary after:absolute after:inset-0 after:rounded-2xl">
        {p(service.cta)}<Arrow className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 ltr:group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </article>
  );
}
