import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';

export function About() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-12">
          <span className="text-secondary font-bold text-lg">{t.about.badge}</span>
          <div className="h-px bg-border flex-grow max-w-xs" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
              {t.about.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {t.about.body}
            </p>
            <p className="text-primary font-semibold text-xl italic border-l-4 border-secondary pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4 py-2">
              "{t.about.tagline}"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6"
          >
            {[
              { value: t.about.stats.years, label: 'Expertise' },
              { value: t.about.stats.regions, label: 'Coverage' },
              { value: t.about.stats.sectors, label: 'Industries' },
            ].map((stat, i) => (
              <div key={i} className="bg-muted p-8 border border-border hover:border-secondary transition-colors group">
                <h3 className="text-3xl font-bold text-secondary mb-2 group-hover:scale-105 transition-transform origin-left rtl:origin-right">
                  {stat.value}
                </h3>
                <div className="h-0.5 w-12 bg-border group-hover:bg-secondary mb-4 transition-colors" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
