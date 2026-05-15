import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';

export function Methodology() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="methodology" className="py-24 bg-primary text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-secondary font-bold text-lg">{t.methodology.badge}</span>
          <div className="h-px bg-white/20 flex-grow" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
          {t.methodology.title}
        </h2>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {t.methodology.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-primary border-2 border-secondary flex items-center justify-center text-xl font-bold text-secondary mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-primary transition-all">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold mb-3 h-14 flex items-center justify-center">
                  {step.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
