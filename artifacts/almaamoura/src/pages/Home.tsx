import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { VisionMission } from '@/components/VisionMission';
import { Values } from '@/components/Values';
import { Leadership } from '@/components/Leadership';
import { Methodology } from '@/components/Methodology';
import { Sectors } from '@/components/Sectors';
import { Services } from '@/components/Services';
import { Projects } from '@/components/Projects';
import { WhyUs } from '@/components/WhyUs';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageContext';

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        <main>
          <Hero />
          <About />
          <VisionMission />
          <Values />
          <Leadership />
          <Methodology />
          <Sectors />
          <Services />
          <Projects />
          <WhyUs />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
