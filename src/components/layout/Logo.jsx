import { useContent } from '../../context/ContentContext';
import { asset, cn } from '../../lib/utils';

/**
 * الشعار: إذا وضعت مسار صورة في site-config.json → logo.src يظهر شعارك الحقيقي،
 * وإلا يظهر الشعار المؤقت (نجمة ثمانية مستوحاة من الزخرفة الجزائرية + حرف F).
 */
export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="rgb(var(--c-primary))" />
      <g transform="translate(32 32)" fill="none" stroke="rgb(var(--c-accent))" strokeWidth="3" strokeLinejoin="round">
        <rect x="-15" y="-15" width="30" height="30" />
        <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
      </g>
      <path d="M26 25h13M26 25v15M26 32h10" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Logo({ light = false, className }) {
  const data = useContent();
  const logo = data?.siteConfig?.logo;
  const short = data?.siteConfig?.shortName || 'FNEA OUARGLA';
  const [a, ...b] = short.split(' ');
  return (
    <span className={cn('flex items-center gap-2.5', className)} aria-label={logo?.alt || short}>
      {logo?.src ? <img src={asset(logo.src)} alt={logo.alt || short} className="h-10 max-w-[112px] object-contain object-center rounded-lg" /> : <LogoMark />}
      <span className="flex flex-col leading-none" dir="ltr">
        <span className={cn('font-display text-[1.05rem] font-extrabold tracking-wide', light ? 'text-white' : 'text-ink')}>{a}</span>
        <span className={cn('mt-1 text-[0.68rem] font-semibold tracking-[0.28em]', light ? 'text-accent' : 'text-primary')}>{b.join(' ')}</span>
      </span>
    </span>
  );
}
