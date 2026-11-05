import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../UI/SectionHeading';
import Reveal from '../UI/Reveal';
import Button from '../UI/Button';
import { AccordionItem } from '../UI/Accordion';
import { useLang } from '../../i18n/LanguageContext';
import { useContent } from '../../context/ContentContext';

/** الأسئلة تُعدَّل من public/data/faq.json */
export default function FAQSection({ limit, showAllLink = true, as = 'h2' }) {
  const { t, p } = useLang();
  const { faq } = useContent();
  const [open, setOpen] = useState(faq[0]?.id);
  const list = limit ? faq.slice(0, limit) : faq;
  return (
    <section id="faq" className="section">
      <div className="container max-w-3xl">
        <SectionHeading center eyebrow={t('faq.eyebrow')} title={t('faq.title')} as={as} />
        <Reveal className="grid gap-3">
          {list.map((f) => (
            <AccordionItem key={f.id} title={p(f.q)} open={open === f.id} onToggle={() => setOpen(open === f.id ? null : f.id)}>
              <p dir="auto">{p(f.a)}</p>
              {f.link && <Link to={f.link} className="mt-3 inline-flex min-h-[40px] items-center text-sm font-semibold text-primary hover:underline">{t('faq.more')}</Link>}
            </AccordionItem>
          ))}
        </Reveal>
        {showAllLink && limit && faq.length > limit && <div className="mt-8 text-center"><Button to="/faq" variant="outline">{t('cta.allFaq')}</Button></div>}
      </div>
    </section>
  );
}
