import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { LogoMark } from './components/layout/Logo';
import { useContentState } from './context/ContentContext';
import Home from './pages/Home';
import About from './pages/About';
import ServicesPage from './pages/ServicesPage';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Guide from './pages/Guide';
import Team from './pages/Team';
import Branches from './pages/Branches';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import SubmitConcern from './pages/SubmitConcern';
import NotFound from './pages/NotFound';

/**
 * التوجيه (Routing): HashRouter يعمل على أي استضافة ثابتة دون إعدادات خادم.
 * لاحقًا يمكن إضافة: <Route path="admin/*" element={<AdminDashboard />} /> محمية بتسجيل الدخول.
 */
export default function App() {
  const { data, error } = useContentState();
  if (error) return <div className="grid min-h-screen place-items-center p-6 text-center"><p>تعذّر تحميل المحتوى. تحقّق من ملفات data/*.json أو مسارات تحميلها</p></div>;
  if (!data) return <div className="grid min-h-screen place-items-center bg-primary-dark" aria-busy="true"><LogoMark className="h-14 w-14 animate-pulse" /></div>;
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="activities" element={<Activities />} />
          <Route path="activities/:id" element={<ActivityDetail />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="guide" element={<Guide />} />
          <Route path="team" element={<Team />} />
          <Route path="branches" element={<Branches />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="videos" element={<Videos />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="submit" element={<SubmitConcern />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
