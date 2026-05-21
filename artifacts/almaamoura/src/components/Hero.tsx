import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=85&fit=crop',
    sectorEn: 'Aviation & Aerospace',
    sectorAr: 'الطيران والفضاء',
  },
  {
    url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=85&fit=crop',
    sectorEn: 'Real Estate Development',
    sectorAr: 'التطوير العقاري',
  },
  {
    url: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1920&q=85&fit=crop',
    sectorEn: 'Hospitality & Tourism',
    sectorAr: 'الضيافة والسياحة',
  },
  {
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1920&q=85&fit=crop',
    sectorEn: 'Healthcare',
    sectorAr: 'الرعاية الصحية',
  },
  {
    url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=85&fit=crop',
    sectorEn: 'Renewable Energy',
    sectorAr: 'الطاقة المتجددة',
  },
  {
    url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1920&q=85&fit=crop',
    sectorEn: 'Oil & Gas Services',
    sectorAr: 'خدمات النفط والغاز',
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=85&fit=crop',
    sectorEn: 'Financial Services',
    sectorAr: 'الخدمات المالية',
  },
  {
    url: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1920&q=85&fit=crop',
    sectorEn: 'Industrial Manufacturing',
    sectorAr: 'التصنيع الصناعي',
  },
];

export function Hero() {
  const { lang, dir } = useLanguage();
  const t = translations[lang];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const prev = () => setCurrent(i => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent(i => (i + 1) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, current]);

  const slide = SLIDES[current];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-testid="hero-section"
    >
      {/* Background image slideshow */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.url}
            alt={slide.sectorEn}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2E] via-[#0D1B2E55] to-[#0D1B2E33]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2E33] via-transparent to-[#0D1B2E33]" />

      {/* Slide dots — bottom right */}
      <div className="absolute bottom-16 right-8 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            data-testid={`hero-dot-${i}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-2 bg-secondary'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        data-testid="hero-prev"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-secondary/80 border border-white/20 flex items-center justify-center text-white transition-all duration-200"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        data-testid="hero-next"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-secondary/80 border border-white/20 flex items-center justify-center text-white transition-all duration-200"
      >
        <ChevronRight size={20} />
      </button>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            {t.hero.headline}
          </h1>

          {/* Sector label — animated with slides, sits right below headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current + '-label-inline'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="w-8 h-px bg-secondary" />
              <span
                className="text-secondary text-sm font-semibold tracking-widest uppercase"
                data-testid="hero-sector-label"
              >
                {lang === 'ar' ? slide.sectorAr : slide.sectorEn}
              </span>
              <div className="w-8 h-px bg-secondary" />
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('#services')}
              data-testid="hero-cta-services"
              className="bg-secondary text-white px-8 py-4 rounded-sm font-medium hover:bg-secondary/90 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {t.hero.ctaServices}
              <ArrowIcon size={18} />
            </button>
            <button
              onClick={() => scrollTo('#leadership')}
              data-testid="hero-cta-team"
              className="border border-white/40 text-white px-8 py-4 rounded-sm font-medium hover:bg-white/10 hover:border-white transition-all w-full sm:w-auto justify-center"
            >
              {t.hero.ctaTeam}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Gold progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-bar'}
            className="h-full bg-secondary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: paused ? 0 : 5, ease: 'linear' }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}
