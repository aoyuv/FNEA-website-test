import Hero from '../components/section/Hero';
import QuickActions from '../components/section/QuickActions';
import AboutPreview from '../components/section/AboutPreview';
import Services from '../components/section/Services';
import ConcernCTA from '../components/section/ConcernCTA';
import ActivitiesPreview from '../components/section/ActivitiesPreview';
import NewsPreview from '../components/section/NewsPreview';
import NewStudents from '../components/section/NewStudents';
import TeamPreview from '../components/section/TeamPreview';
import GalleryPreview from '../components/section/GalleryPreview';
import FAQSection from '../components/section/FAQSection';
import ContactCTA from '../components/section/ContactCTA';

/** ترتيب أقسام الصفحة الرئيسية — يمكن إعادة ترتيبها أو حذف أي قسم هنا */
export default function Home() {
  return (
    <>
      <Hero />
      <QuickActions />
      <AboutPreview />
      <Services />
      <ConcernCTA />
      <ActivitiesPreview />
      <NewsPreview />
      <NewStudents />
      <TeamPreview />
      <GalleryPreview />
      <FAQSection limit={6} />
      <ContactCTA />
    </>
  );
}
