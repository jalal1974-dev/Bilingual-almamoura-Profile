import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import { 
  Plane, Building2, Utensils, HeartPulse, GraduationCap, 
  Sun, Factory, ShoppingCart, Landmark, Droplet
} from 'lucide-react';

const icons = [
  Plane, Building2, Utensils, HeartPulse, GraduationCap,
  Sun, Factory, ShoppingCart, Landmark, Droplet
];

export function Sectors() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="sectors" className="py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-border w-16" />
            <span className="text-secondary font-bold text-lg">{t.sectors.badge}</span>
            <div className="h-px bg-border w-16" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary">
            {t.sectors.title}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {t.sectors.items.map((sector, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white px-6 py-4 border border-border flex items-center gap-3 hover:border-secondary hover:shadow-md transition-all cursor-default"
              >
                <Icon className="text-secondary w-5 h-5" />
                <span className="font-medium text-primary">{sector}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
