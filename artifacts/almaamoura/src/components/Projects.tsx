import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import { MapPin } from 'lucide-react';

export function Projects() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="projects" className="py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-border w-16" />
            <span className="text-secondary font-bold text-lg">{t.projects.badge}</span>
            <div className="h-px bg-border w-16" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary">
            {t.projects.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.projects.items.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white p-6 border border-border hover:border-secondary hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 text-secondary mb-3 text-sm font-medium">
                <MapPin size={16} />
                {project.location}
              </div>
              <h3 className="text-lg font-bold text-primary leading-tight group-hover:text-secondary transition-colors">
                {project.project}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
