import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import { Eye, Target } from 'lucide-react';

export function VisionMission() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="vision" className="py-24 bg-primary text-white relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-secondary font-bold text-lg">{t.visionMission.badge}</span>
          <div className="h-px bg-white/20 flex-grow max-w-xs" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 transition-colors"
          >
            <div className="mb-6 bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center">
              <Eye className="text-secondary w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-6 text-white">{t.visionMission.visionTitle}</h3>
            <p className="text-white/80 text-lg leading-relaxed">
              {t.visionMission.visionText}
            </p>
          </motion.div>

          <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 transition-colors"
          >
            <div className="mb-6 bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center">
              <Target className="text-secondary w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-6 text-white">{t.visionMission.missionTitle}</h3>
            <p className="text-white/80 text-lg leading-relaxed">
              {t.visionMission.missionText}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
