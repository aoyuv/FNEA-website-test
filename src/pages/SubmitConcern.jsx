import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Paperclip, Send, Loader2, AlertCircle, Info, X, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/UI/PageHeader';
import Reveal from '../components/UI/Reveal';
import Button from '../components/UI/Button';
import { useLang } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';
import { submitConcern } from '../services/submissionService';
import { cn } from '../lib/utils';

const CATEGORIES = ['pedagogy', 'registration', 'housing', 'transport', 'scholarship', 'services', 'activities', 'suggestion', 'other'];
const EMPTY = { fullName: '', email: '', phone: '', university: '', faculty: '', level: '', category: '', subject: '', message: '' };
const REQUIRED = ['fullName', 'email', 'university', 'faculty', 'level', 'category', 'subject', 'message'];
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

function Field({ name, label, required, children, hint, errors, t }) {
  return (
    <div>
      <label htmlFor={`f-${name}`} className="label">{label}{required ? <span className="text-red-600"> *</span> : <span className="font-normal text-muted"> ({t('form.optional')})</span>}</label>
      {children}
      {hint && !errors[name] && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {errors[name] && <p id={`e-${name}`} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600"><AlertCircle className="h-4 w-4" aria-hidden="true" />{errors[name]}</p>}
    </div>
  );
}

/**
 * نموذج إرسال الانشغال.
 * الإرسال الفعلي يتم في src/services/submissionService.js حسب site-config.json → forms.provider
 */
export default function SubmitConcern() {
  const { t } = useLang();
  const { siteConfig } = useContent();
  const forms = siteConfig.forms || {};
  const maxMB = forms.maxFileSizeMB || 5;
  const [params] = useSearchParams();
  const initialCat = CATEGORIES.includes(params.get('category')) ? params.get('category') : '';
  const [values, setValues] = useState({ ...EMPTY, category: initialCat });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [mode, setMode] = useState(null);
  const [errorDetail, setErrorDetail] = useState('');
  const fileRef = useRef(null);
  const topRef = useRef(null);

  const validate = (v = values, f = file) => {
    const e = {};
    REQUIRED.forEach((k) => { if (!String(v[k]).trim()) e[k] = t('form.errors.required'); });
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = t('form.errors.email');
    if (v.phone && !/^[+\d][\d\s-]{7,16}$/.test(v.phone)) e.phone = t('form.errors.phone');
    if (v.message && v.message.trim().length > 0 && v.message.trim().length < 20) e.message = t('form.errors.minLength');
    if (f && f.size > maxMB * 1024 * 1024) e.file = t('form.errors.fileSize');
    if (f && !ACCEPT.includes(f.type)) e.file = t('form.errors.fileType');
    return e;
  };
  const set = (k) => (ev) => {
    const v = { ...values, [k]: ev.target.value };
    setValues(v);
    if (errors[k]) setErrors((e) => { const n = { ...e }; const ve = validate(v); if (!ve[k]) delete n[k]; return n; });
  };
  const onFile = (ev) => {
    const f = ev.target.files?.[0] || null;
    setFile(f);
    const e = validate(values, f);
    setErrors((prev) => { const n = { ...prev }; if (e.file) n.file = e.file; else delete n.file; return n; });
  };
  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = [...REQUIRED, 'phone', 'file'].find((k) => e[k]);
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setErrorDetail('');
    setStatus('sending');
    try {
      const res = await submitConcern(forms, values, file);
      setMode(res.mode);
      setStatus('done');
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error(err);
      setErrorDetail(err?.message || '');
      setStatus('error');
    }
  };
  const reset = () => { setValues({ ...EMPTY }); setFile(null); setErrors({}); setStatus('idle'); setMode(null); };

  const inputProps = (name, extra = {}) => ({
    id: `f-${name}`, name, value: values[name], onChange: set(name), 'aria-invalid': Boolean(errors[name]) || undefined,
    'aria-describedby': errors[name] ? `e-${name}` : undefined, className: cn('input', errors[name] && '!border-red-500'), ...extra,
  });

  return (
    <>
      <PageHeader title={t('form.title')} lead={t('form.lead')} crumbs={[{ label: t('form.title') }]} />
      <section className="section" ref={topRef}>
        <div className="container max-w-3xl">
          {status === 'done' ? (
            <div className="card fade-in flex flex-col items-center p-8 text-center md:p-12" role="status" aria-live="polite">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary"><CheckCircle2 className="h-11 w-11" aria-hidden="true" /></span>
              <h2 className="mt-6 font-display text-2xl font-bold">{t('form.successTitle')}</h2>
              <p className="mt-2 text-lg text-muted">{t('form.successText')}</p>
              {mode === 'email' && <p className="mt-3 text-sm text-muted">{t('form.emailOpened')}</p>}
              {mode === 'preview' && forms.showPreviewNotice && (
                <p className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-start text-sm text-amber-900"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{t('form.previewNotice')}</p>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button onClick={reset} variant="outline">{t('form.another')}</Button>
                <Button to="/">{t('cta.home')}</Button>
              </div>
            </div>
          ) : (
            <Reveal as="form" onSubmit={onSubmit} noValidate className="card grid gap-5 p-5 sm:p-8 md:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field errors={errors} t={t} name="fullName" label={t('form.fullName')} required><input {...inputProps('fullName', { autoComplete: 'name', placeholder: t('form.placeholders.fullName') })} /></Field>
                <Field errors={errors} t={t} name="email" label={t('form.email')} required><input {...inputProps('email', { type: 'email', autoComplete: 'email', inputMode: 'email', dir: 'ltr', placeholder: t('form.placeholders.email') })} /></Field>
                <Field errors={errors} t={t} name="phone" label={t('form.phone')}><input {...inputProps('phone', { type: 'tel', autoComplete: 'tel', inputMode: 'tel', dir: 'ltr', placeholder: t('form.placeholders.phone') })} /></Field>
                <Field errors={errors} t={t} name="university" label={t('form.university')} required><input {...inputProps('university', { placeholder: t('form.placeholders.university') })} /></Field>
                <Field errors={errors} t={t} name="faculty" label={t('form.faculty')} required><input {...inputProps('faculty', { placeholder: t('form.placeholders.faculty') })} /></Field>
                <Field errors={errors} t={t} name="level" label={t('form.level')} required>
                  <select {...inputProps('level')}><option value="">{t('form.choose')}</option>{t('form.levels').map((l) => <option key={l} value={l}>{l}</option>)}</select>
                </Field>
              </div>
              <Field errors={errors} t={t} name="category" label={t('form.category')} required>
                <select {...inputProps('category')}><option value="">{t('form.choose')}</option>{CATEGORIES.map((c) => <option key={c} value={c}>{t(`form.categories.${c}`)}</option>)}</select>
              </Field>
              <Field errors={errors} t={t} name="subject" label={t('form.subject')} required><input {...inputProps('subject', { maxLength: 150, placeholder: t('form.placeholders.subject') })} /></Field>
              <Field errors={errors} t={t} name="message" label={t('form.message')} required><textarea {...inputProps('message', { rows: 6, placeholder: t('form.placeholders.message') })} className={cn('input min-h-[160px] resize-y', errors.message && '!border-red-500')} /></Field>

              <Field errors={errors} t={t} name="file" label={t('form.file')} hint={`${t('form.fileHint')} ${maxMB}MB`}>
                <input ref={fileRef} id="f-file" type="file" accept={ACCEPT.join(',')} onChange={onFile} className="sr-only" aria-describedby={errors.file ? 'e-file' : undefined} />
                {file ? (
                  <div className="flex items-center gap-3 rounded-xl border border-ink/15 bg-surface px-4 py-3">
                    <Paperclip className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-sm" dir="ltr">{file.name}</span>
                    <span className="shrink-0 text-xs text-muted tabular-nums" dir="ltr">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button type="button" onClick={() => { setFile(null); fileRef.current.value = ''; setErrors((e) => { const n = { ...e }; delete n.file; return n; }); }} aria-label={t('guide.calc.remove')} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <label htmlFor="f-file" className="flex min-h-[88px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-ink/15 px-4 py-5 text-center text-sm text-muted transition-colors hover:border-primary/50 hover:bg-primary/[0.03]">
                    <Paperclip className="h-6 w-6 text-primary" aria-hidden="true" /><span className="font-semibold text-ink">{t('form.file')}</span><span className="text-xs">JPG, PNG, WEBP, PDF</span>
                  </label>
                )}
              </Field>

              {status === 'error' && <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />{t('form.errors.submit')}{errorDetail ? ` (${errorDetail})` : ''}</p>}

              <div className="flex flex-col gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm text-muted"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{t('form.privacy')}</p>
                <Button type="submit" size="lg" disabled={status === 'sending'} className="w-full sm:w-auto disabled:opacity-70">
                  {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />}
                  {status === 'sending' ? t('form.sending') : t('form.send')}
                </Button>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
