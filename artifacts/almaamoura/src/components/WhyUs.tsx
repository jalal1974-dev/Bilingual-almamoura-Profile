import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';

export function WhyUs() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section className="py-24 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-secondary font-bold text-lg">{t.whyUs.badge}</span>
          <div className="h-px bg-white/20 flex-grow max-w-xs" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-16">
          {t.whyUs.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {t.whyUs.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-6 rtl:pl-0 rtl:pr-6"
            >
              {/* Gold line accent */}
              <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-1 bg-secondary/50" />
              
              <h3 className="text-xl font-bold mb-3 text-white">
                {item.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
