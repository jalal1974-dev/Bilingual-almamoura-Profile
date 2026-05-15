import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';

export function Values() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="values" className="py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-border w-16" />
            <span className="text-secondary font-bold text-lg">{t.values.badge}</span>
            <div className="h-px bg-border w-16" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary">
            {t.values.title}
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {t.values.items.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 border border-border hover:shadow-lg hover:border-secondary transition-all"
            >
              <div className="text-secondary font-bold text-2xl mb-4 opacity-50">
                0{index + 1}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
