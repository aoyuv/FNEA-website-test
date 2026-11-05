import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollManager from './ScrollManager';
import useDocumentTitle from '../../lib/useDocumentTitle';
import { useContent } from '../../context/ContentContext';
import { asset } from '../../lib/utils';

export default function Layout() {
  useDocumentTitle();
  const data = useContent();
  const logo = data?.siteConfig?.logo;
  return (
    <>
      {/* SVG displacement filter: continuously ripples the original logo, not a reflection */}
      <svg className="fnea-wave-defs" aria-hidden="true" focusable="false">
        <filter id="fnea-wave" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="1" seed="8" result="wave">
            <animate attributeName="baseFrequency" values="0.006 0.009;0.009 0.006;0.006 0.009" dur="16s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="wave" scale="3" xChannelSelector="R" yChannelSelector="G">
            <animate attributeName="scale" values="2;4;2" dur="14s" repeatCount="indefinite" />
          </feDisplacementMap>
        </filter>
      </svg>
      {logo?.src && <div className="fnea-watermark" aria-hidden="true"><img src={asset(logo.src)} alt="" /></div>}
      <ScrollManager />
      <Navbar />
      <main id="main" tabIndex={-1} className="relative z-[1] outline-none"><Outlet /></main>
      <div className="relative z-[1]"><Footer /></div>
    </>
  );
}
