import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function Hero() {
  const { lang, dir } = useLanguage();
  const t = translations[lang];

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-primary">
      {/* Background SVG Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="inline-block text-secondary tracking-widest uppercase text-sm mb-6 font-semibold">
            {t.hero.subheadline}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
            {t.hero.headline}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button 
              onClick={() => scrollTo('#services')}
              className="bg-secondary text-white px-8 py-4 rounded-sm font-medium hover:bg-secondary/90 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {t.hero.ctaServices}
              <ArrowIcon size={18} />
            </button>
            <button 
              onClick={() => scrollTo('#leadership')}
              className="border border-white/30 text-white px-8 py-4 rounded-sm font-medium hover:bg-white/10 hover:border-white transition-all w-full sm:w-auto justify-center"
            >
              {t.hero.ctaTeam}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Animated divider */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
    </section>
  );
}
